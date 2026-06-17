"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { Lock, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if we have the access token from the email link
    const accessToken = searchParams.get("access_token");
    if (!accessToken) {
      setError("Invalid or expired reset link. Please request a new password reset.");
    }
  }, [searchParams]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/");
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#181818] rounded-2xl p-8 shadow-2xl border border-white/5">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#1ed760]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#1ed760]/20">
              <Lock className="text-[#1ed760]" size={32} />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter mb-2">
              Reset Password
            </h1>
            <p className="text-sm text-[#b3b3b3]">
              Enter your new password below
            </p>
          </div>

          {success ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-[#1ed760] mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Password Reset Successful</h2>
              <p className="text-[#b3b3b3]">Redirecting to login...</p>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                  {error}
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#1ed760] transition-colors" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="New Password"
                    className="w-full pl-12 pr-12 py-4 bg-[#282828] border border-transparent focus:border-[#1ed760]/50 rounded-xl outline-none text-white transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#1ed760] transition-colors" size={18} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Confirm New Password"
                    className="w-full pl-12 pr-12 py-4 bg-[#282828] border border-transparent focus:border-[#1ed760]/50 rounded-xl outline-none text-white transition-all"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-[#1ed760] text-black font-bold rounded-full hover:scale-105 transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:scale-100"
                >
                  {isLoading ? "Updating Password..." : "Update Password"}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => router.push("/")}
                  className="text-sm text-[#b3b3b3] hover:text-white transition-colors"
                >
                  Back to Home
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
