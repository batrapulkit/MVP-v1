import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);

    const { data, error } = await supabase.auth.updateUser({
      password
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
      title: "Password updated",
      description: "You can now log in with your new password"
    });

    navigate("/signin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold mb-6">Reset Password</h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-2 text-sm font-medium">New Password</label>
            <input
              type="password"
              className="w-full border px-4 py-3 rounded-xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
