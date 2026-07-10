"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { useUser } from "../contexts/UserContext";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";
import { CreditCard, Gift } from "lucide-react";
import { courses, getCourseById } from "../data/courses";
import { supabase } from "../../lib/supabase";
import { CURRENCY_CONFIG } from "../../lib/config";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get("course");
  const course = courseId ? getCourseById(courseId) : null;
  const { cart, clearCart, cartTotal, cartTotalNGN } = useCart();
  const { showToast } = useToast();

  const { currentUser, login, register, logout, updateUserPreferences, getOwnedCourses } = useUser();

  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [currency, setCurrency] = useState<"USD" | "NGN">("USD");

  // Redirect if no course selected and cart is empty
  useEffect(() => {
    if (!course && cart.length === 0) {
      router.push("/courses");
    }
  }, [course, cart.length, router]);

  // Use cart items if available, otherwise use single course
  const itemsToCheckout = cart.length > 0 ? cart : (course ? [course] : []);
  const priceUSD = cart.length > 0 ? cartTotal : (course?.priceUSD || 14);
  const priceNGN = cart.length > 0 ? cartTotalNGN : priceUSD * CURRENCY_CONFIG.NGN_TO_USD_RATE;

  const displayPrice = currency === "NGN"
    ? `₦${priceNGN.toLocaleString()}`
    : `$${priceUSD}`;

  const flwConfig = {
    public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY ?? "",
    tx_ref: `origin-cart-${Date.now()}`,
    amount: currency === "NGN" ? priceNGN : priceUSD,
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
      title: "Origin — Formation for Life",
      description: cart.length > 0 ? `${cart.length} course${cart.length > 1 ? 's' : ''} — One-time purchase` : `${course?.title} — One-time purchase`,
      logo: "/origin.png",
    },
  };

  const handleFlutterPayment = useFlutterwave(flwConfig);

  const handlePay = async () => {
    if (!currentUser) return;

    handleFlutterPayment({
      callback: async (response) => {
        closePaymentModal();
        if (response.status === "successful" || response.status === "completed") {
          try {
            // Process gift orders
            const giftItems = cart.filter(item => item.isGift);
            if (giftItems.length > 0) {
              const giftPurchases = giftItems.map(item => ({
                purchaser_id: currentUser.id,
                recipient_email: item.recipientEmail || '',
                recipient_name: item.recipientName || '',
                course_id: item.id,
                amount: item.priceUSD || 14,
                currency: 'USD',
                status: 'completed',
                gift_message: item.giftMessage || '',
              }));
              const { error: giftError } = await supabase.from('gift_orders').insert(giftPurchases);
              if (giftError) {
                console.error('Error inserting gift orders:', giftError);
              }
            }

            // Save purchase(s) to database (non-gifts only for course_purchases)
            if (course) {
              const purchaseData = {
                user_id: currentUser.id,
                course_id: course.id,
                course_title: course.title,
                amount: currency === "NGN" ? priceNGN : priceUSD,
                currency: currency,
                payment_method: 'flutterwave',
                transaction_id: response.transaction_id || response.tx_ref,
                status: 'completed',
                purchased_at: new Date().toISOString(),
              };
              const { error: insertError } = await supabase.from('course_purchases').insert(purchaseData);
              if (insertError) {
                console.error('Error inserting purchase:', insertError);
                showToast('Payment successful but failed to record purchase. Please contact support.', 'error');
              }
            } else {
              const nonGiftItems = cart.filter(item => !item.isGift);
              if (nonGiftItems.length > 0) {
                const purchasesToInsert = nonGiftItems.map(item => {
                  const itemAmount = currency === "NGN" ? ((item.priceUSD ?? 14) * CURRENCY_CONFIG.NGN_TO_USD_RATE) : (item.priceUSD ?? 14);
                  return {
                    user_id: currentUser.id,
                    course_id: item.id,
                    course_title: item.title,
                    amount: itemAmount,
                    currency: currency,
                    payment_method: 'flutterwave',
                    transaction_id: response.transaction_id || response.tx_ref,
                    status: 'completed',
                    purchased_at: new Date().toISOString(),
                  };
                });
                const { error: insertError } = await supabase.from('course_purchases').insert(purchasesToInsert);
                if (insertError) {
                  console.error('Error inserting cart purchases:', insertError);
                  showToast('Payment successful but failed to record some purchases. Please contact support.', 'error');
                }
              }
            }

            // Add courses to user's purchased courses in profile preferences
            const currentOwned = getOwnedCourses();
            const newOwned = [...currentOwned];
            if (course) {
              if (!newOwned.includes(course.id)) {
                newOwned.push(course.id);
              }
            } else {
              const nonGiftItems = cart.filter(item => !item.isGift);
              for (const item of nonGiftItems) {
                if (!newOwned.includes(item.id)) {
                  newOwned.push(item.id);
                }
              }
            }
            await updateUserPreferences({ ownedCourseIds: newOwned });

            // Clear cart after successful payment and DB recording
            if (cart.length > 0) {
              clearCart();
            }
            showToast("Payment successful!", "success");

            // Redirect user
            if (course) {
              router.push(`/courses/${course.id}?purchased=true`);
            } else {
              router.push("/courses?purchase_history=true");
            }
          } catch (dbError) {
            console.error('Error handling post-payment logic:', dbError);
            showToast('Payment successful but failed to record purchase. Please contact support.', 'error');
          }
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
    <div className="min-h-screen bg-[#0f1724] flex flex-col font-sans text-white selection:bg-[#60a5fa]/30 selection:text-white">
      {/* Simple Header */}
      <div className="h-16 shrink-0 bg-[#0b1220] flex items-center justify-between px-4 sm:px-6 z-30 border-b border-white/5">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="hover:bg-[#0f1724] transition-colors flex items-center gap-2 px-3 py-1.5 rounded-full text-[#9aa4b2] hover:text-white group"
          >
            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-bold">Back</span>
          </button>
          <div className="h-6 w-px bg-[#282828]"></div>
          <div className="font-bold text-lg text-white">Secure Checkout</div>
        </div>
        <Link href="/" className="text-xs font-black text-[#b3b3b3] hover:text-white uppercase tracking-tighter">
          Origin
        </Link>
      </div>

      <main className="grow container mx-auto px-4 py-10 sm:py-16 max-w-4xl relative">
        <div className="relative z-10 flex flex-col md:flex-row gap-8 sm:gap-12">

          {/* ── Order Summary ── */}
          <div className="w-full md:w-1/3 order-2 md:order-1">
            <h2 className="text-2xl font-bold text-white mb-6">Order Summary</h2>
            <div className={`rounded-xl p-6 sm:p-8 shadow-xl bg-[#0b1220] border border-white/5 text-white relative`}>
              {cart.length > 0 ? (
                <div className="mb-5 space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {item.isGift && <Gift className="w-4 h-4 text-[#60a5fa]" />}
                          <h3 className="text-sm font-bold">{item.title}</h3>
                        </div>
                        {item.isGift && (
                          <p className="text-xs text-[#9aa4b2] mb-1">
                            Gift to: {item.recipientEmail}
                          </p>
                        )}
                        <p className={`text-xs text-[#9aa4b2] line-clamp-1`}>{item.description}</p>
                      </div>
                      <span className="text-sm font-bold text-[#D4AF37]">${item.priceUSD}</span>
                    </div>
                  ))}
                </div>
              ) : course ? (
                <div className="mb-5">
                  <h3 className="text-xl font-bold mb-1">{course.title}</h3>
                  <p className={`text-sm text-[#b3b3b3] line-clamp-2`}>{course.description}</p>
                </div>
              ) : null}

              {/* Currency switcher */}
              <div className="flex gap-2 mb-5">
                {(["USD", "NGN"] as const).map((cur) => (
                  <button
                    key={cur}
                    onClick={() => setCurrency(cur)}
                    className={`flex-1 py-2 rounded-full text-sm font-bold transition-all ${
                      currency === cur
                        ? "bg-[#60a5fa] text-black"
                        : "bg-[#0f1724] text-[#9aa4b2] hover:bg-[#0e1624]"
                    }`}
                  >
                    {cur === "USD" ? "$ USD" : "₦ NGN"}
                  </button>
                ))}
              </div>

              <div className={`py-5 border-y border-[#282828] mb-5 flex justify-between items-center`}>
                <span className="font-semibold">One-time purchase</span>
                <span className="font-black text-2xl">{displayPrice}</span>
              </div>

              <div className="flex justify-between items-center mb-1">
                <span className="font-bold">Due Today</span>
                <span className="font-black text-2xl text-[#60a5fa]">{displayPrice}</span>
              </div>
              <p className={`text-xs text-right text-[#a7a7a7]`}>
                Lifetime access to this course.
              </p>
            </div>

            {/* Payment methods note */}
            <div className="mt-4 p-4 bg-[#0b1220] rounded-xl border border-white/5 shadow-sm">
              <p className="text-xs font-bold text-[#9aa4b2] uppercase tracking-wider mb-2">Accepted Payments</p>
              <div className="flex flex-wrap gap-2 text-xs text-[#a7a7a7]">
                <span className="px-2 py-1 bg-[#0f1724] rounded-md flex items-center gap-1">
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
              <p className="text-xs text-[#6b7280] mt-2">Secured by Flutterwave</p>
            </div>
          </div>

          {/* ── Checkout Form ── */}
          <div className="w-full md:w-2/3 order-1 md:order-2">
            <h1 className="text-4xl font-black text-white mb-8 tracking-tight">Checkout</h1>

            {/* Auth block */}
            {currentUser ? (
              <div className="bg-[#0b1220] rounded-xl p-6 sm:p-8 shadow-md border border-white/5 mb-6">
                <h2 className="text-xl font-bold text-white mb-2">Account</h2>
                <p className="text-[#9aa4b2] mb-3">
                  Signed in as <span className="font-bold text-white">{currentUser.name}</span>
                  <span className="text-[#a7a7a7]"> ({currentUser.email})</span>
                </p>
                <button onClick={logout} className="text-sm text-[#60a5fa] hover:text-white underline">
                  Not you? Sign out
                </button>
              </div>
            ) : (
              <div className="bg-[#0b1220] rounded-xl p-6 sm:p-8 shadow-md border border-white/5 mb-6">
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
                        className="w-full px-4 py-3 bg-[#0f1724] rounded-md border border-white/5 focus:border-[#60a5fa] outline-none transition-all text-white"
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
                      className="w-full px-4 py-3 bg-[#0f1724] rounded-md border border-white/5 focus:border-[#60a5fa] outline-none transition-all text-white"
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
                        className="w-full px-4 py-3 bg-[#0f1724] rounded-md border border-white/5 focus:border-[#60a5fa] outline-none transition-all text-white"
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
              className="w-full py-4 px-6 bg-[#60a5fa] hover:scale-[1.02] text-black font-bold text-lg rounded-full shadow-lg shadow-[#60a5fa]/15 transition-transform flex justify-center items-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {`Pay ${displayPrice} via Flutterwave`}
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
              <Link href="/#courses" className="text-sm text-[#9aa4b2] hover:text-white transition-colors">
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#60a5fa]" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
