import { useState } from 'react';
import { useLocation } from 'wouter';
import { loginUser } from '@/api/services';
import { useUserStore } from '@/stores/useUserStore';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/api/client';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  CheckCircle, 
  AlertCircle,
  Shield,
  Sparkles,
  ArrowRight,
  Loader2
} from 'lucide-react';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const { triggerUpdate } = useUserStore();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Read redirect param
  const searchParams = new URLSearchParams(window.location.search);
  const redirect = searchParams.get('redirect') || '/';

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      const response = await loginUser(email, password);
      const user = response.data.user;

      toast({
        title: 'Welcome back!',
        description: `Successfully signed in as ${user.name || user.email}`,
      });

      triggerUpdate();
      setTimeout(() => navigate(redirect), 1000);
    } catch (error: any) {
      const msg = error?.response?.data?.message || 'Invalid email or password. Please try again.';
      toast({
        title: 'Sign in failed',
        description: msg,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    });

    if (error) {
      toast({
        title: 'Google sign in failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-full flex items-center justify-center shadow-2xl">
              <Shield className="h-10 w-10 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
          <p className="text-xl text-gray-600">Sign in to access your account</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LogIn className="h-6 w-6" />
                <div>
                  <h2 className="text-xl font-bold">Sign In</h2>
                  <p className="text-indigo-100 text-sm">Enter your credentials to continue</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-medium">Secure</span>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <Mail className="h-4 w-4 text-indigo-600" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="Enter your email address"
                    autoComplete="email"
                    className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 ${
                      errors.email
                        ? 'border-red-300 focus:ring-red-200 focus:border-red-500 bg-red-50'
                        : 'border-gray-200 focus:ring-indigo-200 focus:border-indigo-500 hover:border-gray-300'
                    }`}
                  />
                  {email && !errors.email && (
                    <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
                  )}
                </div>
                {errors.email && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {errors.email}
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                  <Lock className="h-4 w-4 text-indigo-600" />
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className={`w-full px-4 py-4 border-2 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 pr-12 ${
                      errors.password
                        ? 'border-red-300 focus:ring-red-200 focus:border-red-500 bg-red-50'
                        : 'border-gray-200 focus:ring-indigo-200 focus:border-indigo-500 hover:border-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center gap-2 mt-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => navigate('/forgot-password')}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors duration-200"
                >
                  Forgot your password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 transform focus:outline-none focus:ring-4 focus:ring-indigo-300 shadow-lg ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed transform-none'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 hover:scale-105 shadow-indigo-500/25'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 className="animate-spin h-5 w-5" />
                    <span>Signing you in...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <LogIn className="h-5 w-5" />
                    <span>Sign In</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </button>
            </form>

            {/* OR separator */}
            <div className="flex items-center my-8">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-4 text-gray-500 font-semibold bg-gray-50 px-3 py-1 rounded-full text-sm">OR</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-4 py-4 px-6 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-lg transition-all duration-200 transform hover:scale-105 bg-white"
              aria-label="Sign in with Google"
            >
              <svg
                className="w-6 h-6"
                viewBox="0 0 533.5 544.3"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M533.5 278.4c0-18.4-1.6-36.1-4.7-53.4H272.1v101.1h146.6c-6.3 34-25.4 62.9-54.3 82.2v68.2h87.9c51.4-47.4 81.2-117.1 81.2-197.9z"
                  fill="#4285F4"
                />
                <path
                  d="M272.1 544.3c73.6 0 135.5-24.4 180.7-66.4l-87.9-68.2c-24.5 16.4-55.7 26.1-92.8 26.1-71.5 0-132-48.3-153.5-113.4H29.9v70.7c45.5 89.5 139 150.8 242.2 150.8z"
                  fill="#34A853"
                />
                <path
                  d="M118.6 322.4c-11.7-34.5-11.7-71.8 0-106.3V145.4H29.9c-39 76-39 167.3 0 243.3l88.7-66.3z"
                  fill="#FBBC05"
                />
                <path
                  d="M272.1 107.7c39.8-.6 77.7 14.1 106.6 40.7l79.9-79.9C404.2 22.7 342.3-1.1 272.1 0 168.9 0 75.5 61.3 29.9 150.8l88.7 70.7c21.5-65 82-113.4 153.5-113.8z"
                  fill="#EA4335"
                />
              </svg>
              <span className="font-semibold text-gray-700">Continue with Google</span>
            </button>

            {/* Sign Up Link */}
            <div className="text-center mt-8">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/signup')}
                  className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors duration-200 relative"
                >
                  Sign up here
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-200 hover:w-full"></span>
                </button>
              </p>
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-2 text-center justify-center">
                <Shield className="h-4 w-4 text-gray-600" />
                <p className="text-xs text-gray-600">
                  Your login is protected by industry-standard encryption
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Features */}
        <div className="mt-6 grid grid-cols-2 gap-4 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
            <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Secure Login</p>
            <p className="text-xs text-gray-500">SSL Encrypted</p>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
            <Sparkles className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Fast Access</p>
            <p className="text-xs text-gray-500">Quick Sign In</p>
          </div>
        </div>
      </div>
    </div>
  );
}
