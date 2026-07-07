"use client";

import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";
import { useRouter } from "next/navigation";
import { Trash2, ShoppingBag, ArrowRight, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart, clearCart, cartTotal, cartTotalNGN, cartCount } = useCart();
  const { showToast } = useToast();
  const router = useRouter();

  const handleCheckout = () => {
    if (cart.length === 0) {
      showToast("Your cart is empty", "warning");
      return;
    }
    router.push("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#0f1724] text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-[#0f1724] rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={48} className="text-[#9aa4b2]" />
            </div>
            <h1 className="text-3xl font-black mb-4">Your cart is empty</h1>
            <p className="text-[#9aa4b2] mb-8">
              Add courses to your cart to get started with your learning journey.
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#60a5fa] text-black font-bold rounded-full hover:scale-105 transition-transform"
            >
              Browse Courses <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-black">Shopping Cart ({cartCount})</h1>
            <button
              onClick={clearCart}
              className="text-sm text-[#b3b3b3] hover:text-red-500 transition-colors flex items-center gap-1"
            >
              <Trash2 size={16} /> Clear Cart
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-[#181818] rounded-xl border border-[#282828]"
                >
                  <div className={`w-24 h-24 rounded-lg bg-gradient-to-br ${item.bgGradient} flex items-center justify-center flex-shrink-0 relative`}>
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.title} fill className="object-cover rounded-lg" sizes="96px" />
                    ) : (
                      <BookOpen className="text-white w-12 h-12" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white mb-1 truncate">{item.title}</h3>
                      <p className="text-sm text-[#9aa4b2] line-clamp-2 mb-2">{item.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-[#D4AF37]">${item.priceUSD}</span>
                        <span className="text-sm text-[#9aa4b2]">/</span>
                        <span className="text-sm text-[#9aa4b2]">₦{(item.priceUSD || 0) * 1500}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      removeFromCart(item.id);
                      showToast("Removed from cart", "info");
                    }}
                      className="text-[#9aa4b2] hover:text-red-500 transition-colors self-start"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-[#181818] rounded-xl border border-[#282828] p-6 sticky top-4">
                <h2 className="text-xl font-black mb-4">Order Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                      <span className="text-[#9aa4b2]">Subtotal ({cartCount} items)</span>
                    <span className="font-bold">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                      <span className="text-[#9aa4b2]">NGN Equivalent</span>
                    <span className="font-bold">₦{cartTotalNGN.toLocaleString()}</span>
                  </div>
                    <hr className="border-white/5" />
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Total</span>
                      <span className="font-black text-[#60a5fa]">${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                    className="w-full py-4 bg-[#60a5fa] text-black font-bold rounded-full hover:scale-105 transition-transform flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <ArrowRight size={16} />
                </button>
                <Link
                  href="/courses"
                    className="block w-full mt-3 text-center text-sm text-[#9aa4b2] hover:text-white transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
