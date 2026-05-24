"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { useUser } from "../contexts/UserContext";
import { CreditCard } from "lucide-react";

// Plan config
const PLANS = {
  free: {
    name: "Free",
    description: "Access to 2 basic courses, basic progress tracking, daily streak tracking, view leaderboards.",
    priceUSD: 0,
    priceNGN: 0,
    featured: false,
  },
  monthly: {
    name: "Monthly",
    description: "All courses access, full gamification (XP, achievements), full social features (friends, challenges), offline downloads, priority support.",
    priceUSD: 9.99,
    priceNGN: 15000,
    featured: false,
  },
  annual: {
    name: "Annual",
    description: "Everything in Monthly + exclusive masterclasses, 1-on-1 coaching session (quarterly), certificate of completion, priority feature requests.",
    priceUSD: 79.99,
    priceNGN: 120000,
    featured: true,
  },
  lifetime: {
    name: "Lifetime",
    description: "Everything forever, all future courses, priority feature requests, VIP support, exclusive community access.",
    priceUSD: 149,
    priceNGN: 225000,
    featured: false,
  },
} as const;

type PlanKey = keyof typeof PLANS;

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const rawPlan = searchParams.get("plan") ?? "monthly";
  const planKey: PlanKey = (rawPlan in PLANS ? rawPlan : "monthly") as PlanKey;
  const plan = PLANS[planKey];

  const { currentUser, login, register, logout, upgradeToPremium } = useUser();

  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [currency, setCurrency] = useState<"USD" | "NGN">("USD");

  const displayPrice = currency === "NGN"
    ? `₦${plan.priceNGN.toLocaleString()}`
    : `$${plan.priceUSD}`;

  const flwConfig = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY ?? "",
    tx_ref: `magify-${planKey}-${Date.now()}`,
    amount: currency === "NGN" ? plan.priceNGN : plan.priceUSD,
    currency,
    payment_options: currency === "NGN"
      ? "card,banktransfer,ussd,mobilemoney"
      : "card",
    customer: {
      email: currentUser?.email ?? "",
      name: currentUser?.name ?? "",
      phone_number: "",
    },
    customizations: {
      title: "Magify — Formation for Life",
      description: `${plan.name} — ${planKey === 'lifetime' ? 'One-time payment' : planKey === 'annual' ? 'Yearly subscription' : 'Monthly subscription'}`,
      logo: "https://magify.app/logo.png",
    },
  };

  const handleFlutterPayment = useFlutterwave(flwConfig);

  const handlePay = () => {
    if (!currentUser) return;
    handleFlutterPayment({
      callback: async (response) => {
        closePaymentModal();
        if (response.status === "successful" || response.status === "completed") {
          // Convert planKey to the correct type for upgradeToPremium
          const planType = planKey === 'free' ? 'monthly' : planKey as 'monthly' | 'annual' | 'lifetime';
          await upgradeToPremium(planType);
          router.push("/profile?success=true");
        }
      },
      onClose: () => {
        // User dismissed modal — no action needed
      },
    });
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsAuthLoading(true);
    try {
      if (isSignUp) {
        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters");
          return;
        }
        const ok = await register(formData.name, formData.email, formData.password);
        if (!ok) setError("An account with this email already exists.");
      } else {
        const ok = await login(formData.email, formData.password);
        if (!ok) setError("Invalid email or password.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsAuthLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col font-sans text-white selection:bg-[#1ed760]/30 selection:text-white">
      {/* Simple Header */}
      <header className="h-16 flex-shrink-0 bg-[#000000] flex items-center justify-between px-4 sm:px-6 z-30 border-b border-[#282828]">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="hover:bg-[#282828] transition-colors flex items-center gap-2 px-3 py-1.5 rounded-full text-[#b3b3b3] hover:text-white group"
          >
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-bold">Back</span>
          </button>
          <div className="h-6 w-[1px] bg-[#282828]"></div>
          <div className="font-bold text-lg text-white">Secure Checkout</div>
        </div>
        <Link href="/" className="text-xs font-black text-[#b3b3b3] hover:text-white uppercase tracking-tighter">
          Magify
        </Link>
      </header>

      <main className="flex-grow container mx-auto px-4 py-10 sm:py-16 max-w-4xl relative">
        <div className="relative z-10 flex flex-col md:flex-row gap-8 sm:gap-12">

          {/* ── Order Summary ── */}
          <div className="w-full md:w-1/3 order-2 md:order-1">
            <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
            <div className={`rounded-xl p-6 sm:p-8 shadow-xl bg-[#181818] border border-[#282828] text-white relative`}>
              {plan.featured && (
                <div className="absolute top-0 inset-x-0 bg-[#1ed760] text-black text-xs font-bold py-1.5 text-center uppercase tracking-wider rounded-t-xl">
                  Most Popular
                </div>
              )}
              <div className={`mb-5 ${plan.featured ? "mt-4" : ""}`}>
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className={`text-sm text-[#b3b3b3]`}>{plan.description}</p>
              </div>

              {/* Currency switcher */}
              <div className="flex gap-2 mb-5">
                {(["USD", "NGN"] as const).map((cur) => (
                  <button
                    key={cur}
                    onClick={() => setCurrency(cur)}
                    className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${
                      currency === cur
                        ? "bg-[#1ed760] text-black"
                        : "bg-[#282828] text-[#b3b3b3] hover:bg-[#333]"
                    }`}
                  >
                    {cur === "USD" ? "$ USD" : "₦ NGN"}
                  </button>
                ))}
              </div>

              <div className={`py-5 border-y border-[#282828] mb-5 flex justify-between items-center`}>
                <span className="font-semibold">{planKey === 'lifetime' ? 'One-time' : planKey === 'annual' ? 'Yearly' : 'Monthly'}</span>
                <span className="font-black text-2xl">{displayPrice}</span>
              </div>

              <div className="flex justify-between items-center mb-1">
                <span className="font-bold">Due Today</span>
                <span className="font-black text-2xl text-[#1ed760]">{displayPrice}</span>
              </div>
              <p className={`text-xs text-right text-[#a7a7a7]`}>
                Cancel anytime.
              </p>
            </div>

            {/* Payment methods note */}
            <div className="mt-4 p-4 bg-[#181818] rounded-xl border border-[#282828] shadow-sm">
              <p className="text-xs font-bold text-[#b3b3b3] uppercase tracking-wider mb-2">Accepted Payments</p>
              <div className="flex flex-wrap gap-2 text-xs text-[#a7a7a7]">
                <span className="px-2 py-1 bg-[#282828] rounded-md flex items-center gap-1">
                  <CreditCard size={12} /> Card
                </span>
                {currency === "NGN" && (
                  <>
                    <span className="px-2 py-1 bg-[#282828] rounded-md">🏦 Bank Transfer</span>
                    <span className="px-2 py-1 bg-[#282828] rounded-md">📱 USSD</span>
                    <span className="px-2 py-1 bg-[#282828] rounded-md">📲 Mobile Money</span>
                  </>
                )}
              </div>
              <p className="text-xs text-[#535353] mt-2">Secured by Flutterwave</p>
            </div>
          </div>

          {/* ── Checkout Form ── */}
          <div className="w-full md:w-2/3 order-1 md:order-2">
            <h1 className="text-4xl font-black text-white mb-8 tracking-tight">Checkout</h1>

            {/* Auth block */}
            {currentUser ? (
              <div className="bg-[#181818] rounded-xl p-6 sm:p-8 shadow-md border border-[#282828] mb-6">
                <h2 className="text-xl font-bold text-white mb-2">Account</h2>
                <p className="text-[#b3b3b3] mb-3">
                  Signed in as <span className="font-bold text-white">{currentUser.name}</span>
                  <span className="text-[#a7a7a7]"> ({currentUser.email})</span>
                </p>
                <button onClick={logout} className="text-sm text-[#1ed760] hover:text-white underline">
                  Not you? Sign out
                </button>
              </div>
            ) : (
              <div className="bg-[#181818] rounded-xl p-6 sm:p-8 shadow-md border border-[#282828] mb-6">
                <h2 className="text-xl font-bold text-white mb-4">
                  {isSignUp ? "Create an Account" : "Sign In to Continue"}
                </h2>
                {error && (
                  <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 text-red-500 text-sm rounded-md">
                    {error}
                  </div>
                )}
                <form className="space-y-4" onSubmit={handleAuthSubmit}>
                  {isSignUp && (
                    <div>
                      <label className="block text-sm font-semibold text-white mb-2">Full Name</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-[#121212] rounded-md border border-[#282828] focus:border-[#1ed760] outline-none transition-all text-white"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-[#121212] rounded-md border border-[#282828] focus:border-[#1ed760] outline-none transition-all text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">Password</label>
                    <input
                      type="password"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder={isSignUp ? "Min. 6 characters" : "Enter your password"}
                      className="w-full px-4 py-3 bg-[#121212] rounded-md border border-[#282828] focus:border-[#1ed760] outline-none transition-all text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isAuthLoading}
                    className="w-full py-3 px-6 bg-white hover:scale-105 text-black font-bold rounded-full transition-transform disabled:opacity-50"
                  >
                    {isAuthLoading ? "Please wait..." : isSignUp ? "Create Account & Continue" : "Sign In & Continue"}
                  </button>
                </form>
                <div className="mt-4 text-center">
                  <button
                    onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
                    className="text-sm text-[#b3b3b3] hover:text-white font-medium transition-colors"
                  >
                    {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Create one"}
                  </button>
                </div>
              </div>
            )}

            {/* Pay button */}
            <button
              disabled={!currentUser}
              onClick={handlePay}
              className="w-full py-4 px-6 bg-[#1ed760] hover:scale-[1.02] text-black font-bold text-lg rounded-full shadow-lg shadow-[#1ed760]/20 transition-transform flex justify-center items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Pay {displayPrice} via Flutterwave
              <span className="transform group-hover:translate-x-1 transition-transform">→</span>
            </button>

            {!currentUser && (
              <p className="text-center text-sm text-red-500 mt-2 font-medium">
                Please sign in or create an account to complete your purchase.
              </p>
            )}

            <p className="text-center text-xs text-[#a7a7a7] mt-4 flex items-center justify-center gap-2">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              256-bit SSL encryption · Secured by Flutterwave
            </p>

            <div className="mt-6 text-center">
              <Link href="/#courses" className="text-sm text-[#b3b3b3] hover:text-white transition-colors">
                ← View all plans
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1ed760]" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
