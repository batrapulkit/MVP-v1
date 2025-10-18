'use client';

import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { registerUser } from '@/api/services';
import { createClient } from '@supabase/supabase-js';
import { useUserStore } from '@/stores/useUserStore';
import { useToast } from '@/hooks/use-toast';
import {
  UserPlus,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Mail,
  Lock,
  Phone,
  MapPin,
  Calendar,
} from 'lucide-react';

export const supabase = createClient(
  'https://ktojsokydntrdbbpttsa.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt0b2pzb2t5ZG50cmRiYnB0dHNhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMDM0OTQsImV4cCI6MjA2ODc3OTQ5NH0.Z9CUyMuP36RcwP3sOLT2i0qV2mFBLhN9gQ2U7FyLGnE'
);

type FormData = {
  user_name: string;
  full_name: string;
  first_name: string;
  last_name: string;
  phone: string;
  city: string;
  state: string;
  pincode: string;
  email: string;
  password: string;
  age: number;
  status: string;
  role_type: 'user';
  is_active: boolean;
  auth_type: 'email';
};

export default function SignUp() {
  const [form, setForm] = useState<FormData>({
    user_name: '',
    full_name: '',
    first_name: '',
    last_name: '',
    phone: '',
    city: '',
    state: '',
    pincode: '',
    email: '',
    password: '',
    age: 0,
    status: 'active',
    role_type: 'user',
    is_active: true,
    auth_type: 'email',
  });

  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { triggerUpdate } = useUserStore();

  // 👇 Auto update full name
  useEffect(() => {
    setForm(prev => ({
      ...prev,
      full_name: `${prev.first_name} ${prev.last_name}`.trim(),
    }));
  }, [form.first_name, form.last_name]);

  // 👇 Auto fill location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const { latitude, longitude } = pos.coords;
        fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
          .then(res => res.json())
          .then(data => {
            const address = data.address || {};
            setForm(prev => ({
              ...prev,
              city: address.city || address.town || '',
              state: address.state || '',
              pincode: address.postcode || '',
            }));
          })
          .catch(() => {});
      });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'age' ? Number(value) : value,
    }));
  };

  const nextStep = () => step < totalSteps && setStep(step + 1);
  const prevStep = () => step > 1 && setStep(step - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(form);
      toast({
        title: '🎉 Registration successful!',
        description: 'Redirecting to sign in...',
        variant: 'default',
      });
      triggerUpdate();
      setTimeout(() => navigate('/signin'), 2000);
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error?.response?.data?.message || 'Something went wrong.',
        variant: 'destructive',
      });
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: 'http://127.0.0.1:2000/auth/callback' },
    });
    if (error)
      toast({
        title: 'Google login failed',
        description: error.message,
        variant: 'destructive',
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-blue-500 to-purple-600 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <UserPlus className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 flex items-center justify-center gap-2">
            Join Us <Sparkles className="w-5 h-5 text-yellow-500" />
          </h2>
          <p className="text-gray-500 mt-1">Create your account to get started</p>
        </div>

        {/* Progress */}
        <div className="flex mb-8">
          {[...Array(totalSteps)].map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-2 mx-1 rounded-full transition-all duration-300 ${
                i + 1 <= step ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <>
              <Input label="Username" name="user_name" value={form.user_name} onChange={handleChange} required icon={<UserPlus />} />
              <Input label="Email" name="email" value={form.email} onChange={handleChange} required icon={<Mail />} type="email" />
              <Input label="Password" name="password" value={form.password} onChange={handleChange} required icon={<Lock />} type="password" />
            </>
          )}

          {step === 2 && (
            <>
              <Input label="First Name" name="first_name" value={form.first_name} onChange={handleChange} />
              <Input label="Last Name" name="last_name" value={form.last_name} onChange={handleChange} />
              <Input label="Age" name="age" value={form.age || ''} onChange={handleChange} type="number" icon={<Calendar />} />
              <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} icon={<Phone />} />
            </>
          )}

          {step === 3 && (
            <>
              <Input label="City" name="city" value={form.city} onChange={handleChange} icon={<MapPin />} />
              <Input label="State" name="state" value={form.state} onChange={handleChange} />
              <Input label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} />
            </>
          )}

          {step === 4 && (
            <div className="space-y-3 text-gray-700">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <CheckCircle className="text-green-500" /> Confirm your details
              </h3>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li><b>Username:</b> {form.user_name}</li>
                <li><b>Email:</b> {form.email}</li>
                <li><b>Name:</b> {form.full_name}</li>
                <li><b>City:</b> {form.city}</li>
                <li><b>State:</b> {form.state}</li>
                <li><b>Pincode:</b> {form.pincode}</li>
              </ul>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-2 px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 transition"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div />
            )}

            {step < totalSteps ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Next <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
              >
                <CheckCircle className="w-5 h-5" /> Create Account
              </button>
            )}
          </div>
        </form>

        {/* OR separator */}
        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-3 text-gray-500 font-semibold">OR</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Google button */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-lg hover:shadow-md transition bg-white"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-6 h-6" />
          <span className="font-medium text-gray-700">Sign up with Google</span>
        </button>
      </div>
    </div>
  );
}

// 🔹 Reusable Input Component
function Input({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required,
  icon,
}: {
  label: string;
  name: string;
  type?: string;
  value: any;
  onChange: any;
  required?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="block mb-1 font-medium text-gray-700">{label}{required && <span className="text-red-500">*</span>}</label>
      <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
        {icon && <div className="text-gray-400 mr-2">{icon}</div>}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          className="w-full outline-none text-gray-800 placeholder-gray-400"
        />
      </div>
    </div>
  );
}
