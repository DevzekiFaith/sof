"use client";

import { useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { User, Mail, Lock, X, ArrowRight, Eye, EyeOff } from "lucide-react";

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const { login, register, resendConfirmationEmail } = useUser();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailNotConfirmed, setIsEmailNotConfirmed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    setIsEmailNotConfirmed(false);

    try {
      let success = false;
      if (isSignUp) {
        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters");
          setIsLoading(false);
          return;
        }
        success = await register(formData.name, formData.email, formData.password);
      } else {
        success = await login(formData.email, formData.password);
        if (!success) {
          // Check if the error is about email confirmation
          setIsEmailNotConfirmed(true);
          setError("Email not confirmed. Please check your inbox or click below to resend the confirmation email.");
        }
      }

      if (success) {
        onClose();
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    setIsLoading(true);
    const success = await resendConfirmationEmail(formData.email);
    if (success) {
      setError("Confirmation email resent! Please check your inbox.");
      setIsEmailNotConfirmed(false);
    } else {
      setError("Failed to resend confirmation email. Please try again.");
    }
    setIsLoading(false);
  };


  return (
    <div className="bg-[#181818] rounded-2xl p-8 shadow-2xl border border-white/5 animate-fade-in relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#1ed760]/10 rounded-full blur-3xl pointer-events-none" />
      
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white transition-colors"
      >
        <X size={20} />
      </button>

      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-[#1ed760]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#1ed760]/20">
          <User className="text-[#1ed760]" size={32} />
        </div>
        <h2 className="text-3xl font-black text-white tracking-tighter mb-2">
          {isSignUp ? "Join Magify" : "Welcome Back"}
        </h2>
        <p className="text-sm text-[#b3b3b3]">
          {isSignUp ? "Start your formation journey today." : "Log in to continue your progress."}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
          {error}
          {isEmailNotConfirmed && (
            <button
              onClick={handleResendConfirmation}
              disabled={isLoading}
              className="mt-3 w-full py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors text-sm font-medium"
            >
              {isLoading ? "Sending..." : "Resend Confirmation Email"}
            </button>
          )}
        </div>
      )}


      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#1ed760] transition-colors" size={18} />
            <input
              type="text"
              required
              placeholder="Full Name"
              className="w-full pl-12 pr-4 py-4 bg-[#282828] border border-transparent focus:border-[#1ed760]/50 rounded-xl outline-none text-white transition-all"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
        )}
        <div className="relative group">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#1ed760] transition-colors" size={18} />
          <input
            type="email"
            required
            placeholder="Email Address"
            className="w-full pl-12 pr-4 py-4 bg-[#282828] border border-transparent focus:border-[#1ed760]/50 rounded-xl outline-none text-white transition-all"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div className="relative group">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#1ed760] transition-colors" size={18} />
          <input
            type={showPassword ? "text" : "password"}
            required
            placeholder="Password"
            className="w-full pl-12 pr-12 py-4 bg-[#282828] border border-transparent focus:border-[#1ed760]/50 rounded-xl outline-none text-white transition-all"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-[#1ed760] text-black font-bold rounded-full hover:scale-105 transition-all flex items-center justify-center gap-2 mt-6 disabled:opacity-50 disabled:scale-100"
        >
          {isLoading ? "Processing..." : (isSignUp ? "Create Account" : "Sign In")}
          {!isLoading && <ArrowRight size={18} />}
        </button>
      </form>

      <div className="mt-8 text-center">
        <button
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError("");
          }}
          className="text-sm text-[#b3b3b3] hover:text-white transition-colors"
        >
          {isSignUp ? "Already have an account? Sign in" : "New to Magify? Create an account"}
        </button>
      </div>
    </div>
  );
}
