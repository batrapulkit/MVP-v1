import { useState } from 'react';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Loader2,
  Sparkles,
  Shield,
  Check
} from 'lucide-react';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const validateForm = () => {
    const newErrors: any = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Minimum 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Sign in successful!');
    }, 2000);
  };

  const handleGoogleSignIn = () => {
    alert('Google sign in');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-blue-500 to-purple-600 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="text-center pt-8 px-8 pb-6">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-4 rounded-2xl">
              <Shield className="w-10 h-10 text-blue-600" />
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 flex items-center justify-center gap-2">
            Welcome Back <Sparkles className="w-6 h-6 text-yellow-500" />
          </h2>
          <p className="text-gray-500 mt-2">Sign in to continue your journey</p>
        </div>

        {/* Form Content */}
        <div className="px-8 pb-8">
          <div className="space-y-5">
            
            {/* Email Input */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <div className={`flex items-center border-2 rounded-xl px-4 py-3 transition-all ${
                errors.email 
                  ? 'border-red-400 bg-red-50' 
                  : 'border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200'
              }`}>
                <Mail className={`w-5 h-5 mr-3 ${errors.email ? 'text-red-400' : 'text-gray-400'}`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="you@example.com"
                  className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-400"
                />
                {email && !errors.email && (
                  <Check className="w-5 h-5 text-green-500 ml-2" />
                )}
              </div>
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <div className={`flex items-center border-2 rounded-xl px-4 py-3 transition-all ${
                errors.password 
                  ? 'border-red-400 bg-red-50' 
                  : 'border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200'
              }`}>
                <Lock className={`w-5 h-5 mr-3 ${errors.password ? 'text-red-400' : 'text-gray-400'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Enter your password"
                  className="w-full outline-none bg-transparent text-gray-800 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
              </label>
              <button className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center my-6">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-3 text-gray-500 font-semibold">OR</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 py-3.5 border-2 border-gray-300 rounded-xl hover:border-gray-400 hover:shadow-lg transition-all duration-300 bg-white transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-medium text-gray-700">Sign in with Google</span>
            </button>

            {/* Sign Up Link */}
            <div className="text-center pt-4">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button className="text-blue-600 hover:text-blue-700 font-semibold transition-colors underline decoration-blue-400 underline-offset-2">
                  Sign up here
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="bg-gray-50 border-t border-gray-200 px-8 py-4">
          <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-green-600" />
              <span>Secure Login</span>
            </div>
            <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
            <div className="flex items-center gap-1.5">
              <Check className="h-4 w-4 text-blue-600" />
              <span>SSL Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
