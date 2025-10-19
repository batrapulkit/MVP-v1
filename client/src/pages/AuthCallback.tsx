'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/supabase/client';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { registerUser, googleLoginUser } from '@/api/services';
import { useUserStore } from '@/stores/useUserStore';
import {
  Loader2,
  MapPin,
  Phone,
  Calendar,
  Hash,
  Mail,
  User,
  CheckCircle,
  AlertCircle,
  Globe,
} from 'lucide-react';

// Utility to reverse geocode coordinates using Nominatim
const fetchLocationDetails = async (lat: number, lon: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`
    );
    const data = await response.json();
    const address = data.address;

    return {
      city: address.city || address.town || address.village || '',
      state: address.state || '',
      pincode: address.postcode || '',
    };
  } catch (error) {
    console.error('Location fetch failed:', error);
    return { city: '', state: '', pincode: '' };
  }
};

export default function AuthCallback() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { triggerUpdate } = useUserStore();

  const [partialUser, setPartialUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    phone: '',
    city: '',
    state: '',
    pincode: '',
    age: '',
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();

      if (authError || !authData?.user) {
        toast({
          title: 'Google login failed',
          description: authError?.message || 'No user session found',
          variant: 'destructive',
        });
        navigate('/signin');
        return;
      }

      const user = authData.user;
      const userEmail = user.email;

      if (!userEmail) {
        toast({
          title: 'Google login failed',
          description: 'Missing email from Google user profile.',
          variant: 'destructive',
        });
        navigate('/signin');
        return;
      }

      const fullName = user.user_metadata?.full_name || '';
      const [firstName, ...rest] = fullName.split(' ');
      const lastName = rest.join(' ') || '';

      try {
        // ✅ Step 1: Check if user already exists in your database
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('email', userEmail)
          .maybeSingle();

        if (fetchError) throw fetchError;

        // ✅ Step 2: Handle existing user cases
        if (existingUser) {
          if (existingUser.auth_type === 'email') {
            toast({
              title: 'Email already registered',
              description:
                'This email is already registered with email/password login. Please sign in using your email instead.',
              variant: 'destructive',
            });
            navigate('/signin');
            return;
          } else if (existingUser.auth_type === 'google_auth') {
            // Existing Google user → just login
            await googleLoginUser(userEmail);
            toast({
              title: 'Welcome back!',
              description: `Signed in as ${userEmail}`,
            });
            triggerUpdate();
            navigate('/');
            return;
          }
        }

        // ✅ Step 3: New Google user — create partial profile
        const password = generateRandomPassword();
        const userData = {
          user_id: user.id,
          email: userEmail,
          full_name: fullName,
          first_name: firstName,
          last_name: lastName,
          user_name: userEmail.split('@')[0] || '',
          password,
          status: 'active',
          role_type: 'user',
          is_active: true,
          auth_type: 'google_auth',
        };

        setPartialUser(userData);

        // Try to auto-detect location
        setLocationLoading(true);
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            const locationData = await fetchLocationDetails(latitude, longitude);

            setFormData((prev) => ({
              ...prev,
              ...locationData,
            }));
            setLocationLoading(false);
            setLoading(false);
          },
          (geoError) => {
            console.warn('Geolocation error:', geoError.message);
            setLocationLoading(false);
            setLoading(false);
          }
        );

        toast({
          title: 'Welcome!',
          description: `New user detected: ${userEmail}`,
        });
      } catch (error: any) {
        console.error('Auth check failed:', error);
        toast({
          title: 'Something went wrong',
          description: 'Could not verify your account. Please try again.',
          variant: 'destructive',
        });
        navigate('/signin');
      }
    };

    checkUser();
  }, []);

  const generateRandomPassword = (length = 16) => {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    return password;
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10,15}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Enter a valid phone number (10-15 digits)';
    }

    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';

    if (!formData.pincode) {
      newErrors.pincode = 'Pincode is required';
    } else if (!/^[A-Za-z0-9\s]{3,10}$/.test(formData.pincode)) {
      newErrors.pincode = 'Enter a valid pincode (3-10 characters)';
    }

    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (+formData.age < 13 || +formData.age > 120) {
      newErrors.age = 'Age must be between 13 and 120 years';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!partialUser) return;
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const finalData = { ...partialUser, ...formData };

      await registerUser(finalData);

      toast({
        title: 'Registration successful!',
        description: 'Logging you in...',
      });

      triggerUpdate();

      await googleLoginUser(partialUser.email);

      toast({
        title: 'Welcome!',
        description: `Logged in as ${partialUser.email}`,
      });

      navigate('/');
    } catch (error: any) {
      toast({
        title: 'Registration or Login failed',
        description: error?.response?.data?.message || 'Something went wrong.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p>Checking your Google session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center px-4">
      {partialUser ? (
        <div className="w-full max-w-2xl">
          {/* Hero Header */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-600 to-purple-700 flex items-center justify-center text-3xl font-bold text-white shadow-2xl mb-6">
                {partialUser.first_name?.charAt(0).toUpperCase()}{partialUser.last_name?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              👋 Welcome, {partialUser.full_name}!
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              You're almost done! Let's complete your profile.
            </p>
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full text-sm font-medium">
              <Mail className="h-4 w-4" />
              {partialUser.email}
            </div>
          </div>

          {/* Main Form Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            {/* Progress Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Complete Your Profile</h2>
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">Step 2 of 2</span>
                </div>
              </div>
              <div className="mt-4">
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full w-3/4 transition-all duration-300"></div>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-8">
              {locationLoading && (
                <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="animate-spin">
                      <Globe className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-blue-800 font-medium">Auto-detecting your location...</p>
                      <p className="text-blue-600 text-sm">We're trying to fill in your address details automatically.</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone Number */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Phone className="h-4 w-4 text-indigo-600" />
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setFormData({ ...formData, phone: value });
                      }}
                      placeholder="Enter your phone number"
                      className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                        errors.phone
                          ? 'border-red-300 focus:ring-red-200 focus:border-red-500 bg-red-50'
                          : 'border-gray-200 focus:ring-indigo-200 focus:border-indigo-500 hover:border-gray-300'
                      }`}
                    />
                    {formData.phone && !errors.phone && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                    )}
                  </div>
                  {errors.phone && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {errors.phone}
                    </div>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <MapPin className="h-4 w-4 text-indigo-600" />
                    City
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Enter your city"
                      className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                        errors.city
                          ? 'border-red-300 focus:ring-red-200 focus:border-red-500 bg-red-50'
                          : 'border-gray-200 focus:ring-indigo-200 focus:border-indigo-500 hover:border-gray-300'
                      }`}
                    />
                    {formData.city && !errors.city && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                    )}
                  </div>
                  {errors.city && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {errors.city}
                    </div>
                  )}
                </div>

                {/* State */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <MapPin className="h-4 w-4 text-indigo-600" />
                    State
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="Enter your state"
                      className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                        errors.state
                          ? 'border-red-300 focus:ring-red-200 focus:border-red-500 bg-red-50'
                          : 'border-gray-200 focus:ring-indigo-200 focus:border-indigo-500 hover:border-gray-300'
                      }`}
                    />
                    {formData.state && !errors.state && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                    )}
                  </div>
                  {errors.state && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {errors.state}
                    </div>
                  )}
                </div>

                {/* Pincode */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Hash className="h-4 w-4 text-indigo-600" />
                    Pincode
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 10) {
                          setFormData({ ...formData, pincode: value });
                        }
                      }}
                      placeholder="Enter pincode"
                      className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                        errors.pincode
                          ? 'border-red-300 focus:ring-red-200 focus:border-red-500 bg-red-50'
                          : 'border-gray-200 focus:ring-indigo-200 focus:border-indigo-500 hover:border-gray-300'
                      }`}
                    />
                    {formData.pincode && !errors.pincode && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                    )}
                  </div>
                  {errors.pincode && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {errors.pincode}
                    </div>
                  )}
                  <p className="text-xs text-gray-500 mt-1">Supports 3-10 digit pincodes</p>
                </div>

                {/* Age */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <Calendar className="h-4 w-4 text-indigo-600" />
                    Age
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="Enter your age"
                      min="13"
                      max="120"
                      className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                        errors.age
                          ? 'border-red-300 focus:ring-red-200 focus:border-red-500 bg-red-50'
                          : 'border-gray-200 focus:ring-indigo-200 focus:border-indigo-500 hover:border-gray-300'
                      }`}
                    />
                    {formData.age && !errors.age && (
                      <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                    )}
                  </div>
                  {errors.age && (
                    <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4" />
                      {errors.age}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  onClick={handleUpdate}
                  disabled={submitting}
                  className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-300 shadow-lg ${
                    submitting
                      ? 'bg-gray-400 cursor-not-allowed transform-none'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 shadow-indigo-500/25'
                  }`}
                >
                  {submitting ? (
                    <div className="flex items-center justify-center gap-3">
                      <Loader2 className="animate-spin h-5 w-5" />
                      <span>Creating your account...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <CheckCircle className="h-5 w-5" />
                      <span>Complete Registration</span>
                    </div>
                  )}
                </button>
              </div>

              {/* Privacy Notice */}
              <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-600 text-center">
                  By completing registration, you agree to our Terms of Service and Privacy Policy. 
                  Your information is secure and will never be shared with third parties.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center bg-white p-12 rounded-3xl shadow-2xl border border-red-100 max-w-md w-full mx-4">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Something Went Wrong</h2>
          <p className="text-gray-600 mb-6">
            We encountered an issue while loading your data. Please try again.
          </p>
          <button
            onClick={() => navigate('/signin')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
          >
            Back to Sign In
          </button>
        </div>
      )}
    </div>
  );
}
