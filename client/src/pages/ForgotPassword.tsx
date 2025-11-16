import { useState, FormEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { Mail, Shield, ArrowRight, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Email sent",
      description: "Check your inbox for the reset link.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#a78bfa] via-[#c4b5fd] to-[#ddd6fe] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Icon + Title */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl mb-4">
            <Shield className="h-10 w-10 text-white" />
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900">Forgot Password</h1>
          <p className="text-gray-700 text-sm mt-2">We’ll send a reset link</p>
        </div>

        {/* Card */}
        <div className="bg-white/95 backdrop-blur-xl border border-white/20 shadow-xl rounded-2xl overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-5 text-white">
            <div className="flex items-center gap-3">
              <Mail className="h-6 w-6" />
              <div>
                <h2 className="text-lg font-bold">Reset Password</h2>
                <p className="text-indigo-100 text-xs">Enter your email</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-600 focus:ring-2 focus:ring-purple-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-700 text-white font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Send Link <ArrowRight className="h-4 w-4" /></>}
              </button>
            </form>

            <button
              onClick={() => navigate("/signin")}
              className="w-full text-center text-purple-700 font-medium hover:underline"
            >
              Back to Sign In
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
