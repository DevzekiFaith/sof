"use client";

import { useState } from "react";
import { useUser } from "../../contexts/UserContext";

export default function AuthButton() {
  const { currentUser, login, register, logout, resetPassword } = useUser();
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      let success = false;

      if (isSignUp) {
        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters");
          return;
        }
        success = await register(formData.name, formData.email, formData.password);
        if (!success) {
          setError("An account with this email already exists");
          return;
        }
      } else {
        success = await login(formData.email, formData.password);
        if (!success) {
          setError("Invalid email or password");
          return;
        }
      }

      setShowModal(false);
      setFormData({ email: "", password: "", name: "" });
    } catch (_err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (!formData.email) {
      setError("Please enter your email address.");
      setIsLoading(false);
      return;
    }

    const success = await resetPassword(formData.email);
    if (success) {
      setSuccess("Password reset email sent! Please check your inbox.");
    } else {
      setError("Failed to send reset email. Please try again.");
    }
    setIsLoading(false);
  };

  if (currentUser) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-gray-700 font-medium">Welcome, {currentUser.name}!</span>
        <button
          onClick={handleLogout}
          className="px-6 py-2 border-2 border-gray-200 rounded-lg font-semibold hover:border-gray-300 transition-colors"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-2 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-colors"
      >
        Sign In
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">
                {isResetPassword ? "Reset Password" : (isSignUp ? "Create Account" : "Welcome Back")}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setIsSignUp(false);
                  setIsResetPassword(false);
                  setFormData({ email: "", password: "", name: "" });
                  setError("");
                  setSuccess("");
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm font-medium">{success}</p>
              </div>
            )}

            {isResetPassword ? (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending..." : "Send Reset Email"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none"
                    placeholder={isSignUp ? "Create a password (min 6 characters)" : "Enter your password"}
                    required
                  />
                </div>
                {!isSignUp && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setIsResetPassword(true);
                        setError("");
                      }}
                      className="text-sm text-gray-600 hover:text-black"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Please wait..." : (isSignUp ? "Create Account" : "Sign In")}
                </button>
              </form>
            )}

            <div className="mt-6 text-center">
              {isResetPassword ? (
                <button
                  onClick={() => {
                    setIsResetPassword(false);
                    setError("");
                    setSuccess("");
                  }}
                  className="text-gray-600 hover:text-black font-medium"
                >
                  Back to Sign In
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError("");
                    setFormData({ email: "", password: "", name: "" });
                  }}
                  className="text-gray-600 hover:text-black font-medium"
                >
                  {isSignUp
                    ? "Already have an account? Sign in"
                    : "Don't have an account? Sign up"}
                </button>
              )}
            </div>

            <div className="mt-4 text-center text-sm text-gray-500">
              <p>Your data is stored locally on your device</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
