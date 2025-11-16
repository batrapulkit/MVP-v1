import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Failed",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Check your email",
      description: "Password reset link sent successfully"
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6">Forgot Password</h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full border px-4 py-3 rounded-xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>
      </div>
    </div>
  );
}
