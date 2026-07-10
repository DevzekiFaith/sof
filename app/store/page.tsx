"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Book, Package, Shirt, PenTool, ShoppingBag, Star, Award } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";
import { STORE_PRODUCTS } from "../data/store-products";
import { supabase } from "../../lib/supabase";

export default function StorePage() {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      showToast("Please enter a valid email address.", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      // Try to save to Supabase. If the newsletter table doesn't exist, handle it gracefully.
      const { error } = await supabase.from('newsletter_subscribers').insert({ email });
      if (error && error.code !== '42P01') {
        console.error("Subscription error:", error);
      }
      localStorage.setItem("newsletter_subscribed", "true");
      localStorage.setItem("subscribed_email", email);
      showToast("Successfully subscribed to the newsletter!", "success");
      setEmail("");
    } catch (err) {
      console.warn("Subscription fallback:", err);
      showToast("Successfully subscribed to the newsletter!", "success");
      setEmail("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { id: "all", name: "All Products", icon: ShoppingBag },
    { id: "ebooks", name: "eBooks", icon: Book },
    { id: "hardcopy", name: "Hardcopy Books", icon: Book },
    { id: "journals", name: "Journals", icon: PenTool },
    { id: "merch", name: "Merch", icon: Shirt },
    { id: "courses", name: "Masterclasses & Workshops", icon: Award },
  ];

  const products = STORE_PRODUCTS;

  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProducts = activeCategory === "all" 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">The Becoming Store</h1>
        <p className="text-[#b3b3b3] text-lg font-light">
          eBooks, hardcopy books, journals, and merchandise to support your journey of becoming.
        </p>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                  activeCategory === category.id
                    ? "bg-[#60a5fa] text-black"
                    : "bg-[#141414] text-[#b3b3b3] hover:bg-[#1a1a1a] hover:text-white border border-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => {
            return (
              <div
                key={product.id}
                className="bg-[#141414] rounded-2xl overflow-hidden hover:bg-[#1a1a1a] transition-all group border border-white/5 hover:border-[#60a5fa]/20 flex flex-col justify-between"
              >
                <div>
                  <Link href={`/store/${product.id}`} className="block relative h-48 overflow-hidden bg-zinc-950">
                    {product.imageUrl ? (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
                        <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient}`} />
                        <product.icon className="text-[#60a5fa] w-20 h-20 opacity-80 relative z-10 absolute inset-0 m-auto" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-[#60a5fa] font-bold text-sm">${product.price}</span>
                    </div>
                  </Link>
                  
                  <div className="p-6 pb-0">
                    <Link href={`/store/${product.id}`} className="block group-hover:text-[#60a5fa] transition-colors">
                      <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-[#b3b3b3] text-sm mb-4 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-white text-sm font-semibold">{product.rating}</span>
                      </div>
                      <span className="text-[#666] text-sm">({product.reviews})</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-4">
                  <button
                    onClick={() => {
                      addToCart({
                        id: `store-${product.id}`,
                        title: product.name,
                        description: product.description,
                        fullDescription: product.description,
                        priceUSD: product.price,
                        imageUrl: product.imageUrl,
                        bgGradient: product.gradient,
                        icon: product.icon,
                        iconColor: "text-[#60a5fa]",
                        ageRange: "All Ages",
                      });
                      showToast(`${product.name} added to cart!`, "success");
                    }}
                    className="w-full bg-[#60a5fa] text-black py-3 rounded-full font-semibold hover:bg-[#60a5fa]/80 transition-colors text-center block"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Newsletter */}
      <div className="max-w-7xl mx-auto mt-24">
        <div className="py-16 px-6 bg-[#0d0d0d] rounded-2xl border border-white/5 text-center">
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Stay Updated</h2>
          <p className="text-[#b3b3b3] mb-8 font-light">
            Be the first to know about new products and exclusive offers.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={isSubmitting}
              required
              className="flex-1 bg-[#141414] border border-white/10 rounded-full px-6 py-3 text-white placeholder-[#666] focus:outline-none focus:border-[#60a5fa] transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#60a5fa] text-black px-8 py-3 rounded-full font-semibold hover:bg-[#60a5fa]/85 transition-colors disabled:opacity-50 min-w-[120px]"
            >
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
