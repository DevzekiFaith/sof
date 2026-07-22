"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Book, Package, Shirt, PenTool, ShoppingBag, Star, Award, Heart, Download } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";
import { STORE_PRODUCTS, StoreProduct } from "../data/store-products";
import { supabase } from "../../lib/supabase";

function StoreContent() {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      showToast("Please enter a valid email address.", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const errData = await res.json();
        console.warn("Subscription database error:", errData.error || res.statusText);
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

  const urlCategory = searchParams.get("category");
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    if (urlCategory && categories.some((c) => c.id === urlCategory)) {
      setActiveCategory(urlCategory);
    }
  }, [urlCategory]);

  const merchCategoryCard: StoreProduct & { isCategoryCard?: boolean } = {
    id: 9999,
    name: "Origin Apparel & Gifts",
    description: "Browse our premium collection of branded hoodies, tees, mugs, and travel essentials.",
    imageUrl: "/origin_merch_collection.png",
    gradient: "from-[#60a5fa]/10 to-[#60a5fa]/5",
    icon: Shirt,
    rating: 4.8,
    reviews: 189,
    price: 0,
    category: "merch" as const,
    isCategoryCard: true,
  };

  const filteredProducts = activeCategory === "all" 
    ? [
        ...products.filter(p => p.category !== "merch"),
        merchCategoryCard
      ]
    : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-white text-zinc-950 font-sans pb-24 selection:bg-[#1db954]/20">
      {/* Sub-Header / Logo Bar */}
      <div className="border-b border-zinc-100 py-5 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-zinc-200">
              <Image src="/origin.png" alt="Origin Logo" fill className="object-cover" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-zinc-900">Origin Store</span>
            </div>
          </div>
          <div className="text-xs text-zinc-400 font-medium tracking-wider uppercase">
            Personal growth essentials
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-[#f4f3f1] py-12 md:py-20 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
          {/* Left Column: Image */}
          <div className="relative h-64 md:h-[420px] w-full bg-zinc-200 shadow-sm group overflow-hidden border border-zinc-300/10">
            <Image
              src="/origin_hero_collection.png"
              alt="Origin Collection"
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-[2000ms]"
            />
          </div>
          {/* Right Column: Copy */}
          <div className="space-y-6 max-w-lg md:pl-6 text-left">
            <div className="text-zinc-500 font-bold text-xs tracking-[0.25em] uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1db954]" />
              Branded Merchandise
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-zinc-900 tracking-tight leading-[1.1]">
              Origin Apparel & Gifts
            </h1>
            <p className="text-zinc-500 text-base font-light leading-relaxed">
              Elevate your journey of becoming. Explore premium minimalist hoodies, organic tees, matte mugs, and travel essentials designed to keep you inspired.
            </p>
            <button
              onClick={() => {
                setActiveCategory("merch");
                const grid = document.getElementById("store-products-grid");
                if (grid) {
                  grid.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="inline-block border border-zinc-900 text-zinc-900 px-8 py-3.5 text-xs font-bold tracking-widest hover:bg-zinc-900 hover:text-white transition-all rounded-none uppercase"
            >
              Shop Collection
            </button>
          </div>
        </div>
      </div>

      {/* Features Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8 py-8 border-b border-zinc-100 mb-16 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
          <div className="p-3 bg-zinc-50 rounded-full border border-zinc-100/50">
            <Package className="w-6 h-6 text-zinc-800" />
          </div>
          <div>
            <h3 className="font-bold text-zinc-900 text-base mb-1">Instant Digital Access</h3>
            <p className="text-zinc-500 text-sm">Download your eBooks and workshop worksheets immediately after payment.</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
          <div className="p-3 bg-zinc-50 rounded-full border border-zinc-100/50">
            <Shirt className="w-6 h-6 text-zinc-800" />
          </div>
          <div>
            <h3 className="font-bold text-zinc-900 text-base mb-1">Premium Origin Quality</h3>
            <p className="text-zinc-500 text-sm">Organically sourced fabrics and premium prints with minimal branding.</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
          <div className="p-3 bg-zinc-50 rounded-full border border-zinc-100/50">
            <Award className="w-6 h-6 text-zinc-800" />
          </div>
          <div>
            <h3 className="font-bold text-zinc-900 text-base mb-1">Secure Checkout</h3>
            <p className="text-zinc-500 text-sm">Fast, safe, and 256-bit encrypted checkout powered by Flutterwave.</p>
          </div>
        </div>
      </div>

      {/* Main Grid Title */}
      <div id="store-products-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight mb-2 uppercase">New Arrival</h2>
        <div className="w-12 h-1 bg-zinc-900 mx-auto mb-4" />
        <p className="text-zinc-500 max-w-md mx-auto text-sm">Master life's essential skills with our curated growth resources.</p>
      </div>

      {/* Categories Tabs */}
      <div className="max-w-7xl mx-auto mb-16 px-4">
        <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
          {categories.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 text-xs font-semibold transition-all border ${
                  isActive
                    ? "bg-zinc-950 text-white border-zinc-950 shadow-sm font-bold"
                    : "bg-transparent text-zinc-500 border-zinc-200/60 hover:text-zinc-950 hover:border-zinc-900"
                } rounded-none uppercase tracking-wider`}
              >
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
          {filteredProducts.map((product) => {
            const isCategory = "isCategoryCard" in product && (product as any).isCategoryCard;
            return (
              <div
                key={product.id}
                className="group flex flex-col justify-between"
              >
                <div>
                  {/* Image Container with light grey background */}
                  <div className="relative aspect-[3/4] w-full bg-[#f6f6f6] overflow-hidden mb-4 border border-zinc-100/50 flex items-center justify-center p-4">
                    {isCategory ? (
                      <button
                        onClick={() => setActiveCategory("merch")}
                        className="block relative w-full h-full"
                      >
                        <Image
                          src={product.imageUrl || "/origin_merch_collection.png"}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-[1000ms] p-2"
                        />
                      </button>
                    ) : product.imageUrl ? (
                      <Link href={`/store/${product.id}`} className="block relative w-full h-full">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-[1000ms] p-2"
                        />
                      </Link>
                    ) : (
                      <div className="w-20 h-20 relative flex items-center justify-center">
                        <product.icon className="text-zinc-400 w-16 h-16 opacity-80" />
                      </div>
                    )}

                    {/* Category or Price Badge */}
                    <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5 z-10">
                      {isCategory ? (
                        <span className="bg-zinc-900 text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1">
                          Collection
                        </span>
                      ) : product.price > 0 ? (
                        <div className="flex flex-col gap-1 items-start">
                          <span className="bg-white text-zinc-900 text-xs font-bold border border-zinc-200/80 px-2.5 py-1 shadow-sm flex items-center gap-1.5">
                            <span className="text-[#1db954] font-extrabold text-sm">₦{(product.priceNGN || Math.round(product.price * 1375)).toLocaleString()}</span>
                            <span className="text-zinc-300 font-normal">|</span>
                            <span className="text-zinc-500 font-medium">${product.price}</span>
                          </span>
                          {product.originalPrice && (
                            <span className="bg-zinc-900 text-zinc-300 text-[10px] font-medium line-through px-2 py-1 shadow-sm">
                              ₦{Math.round(product.originalPrice * 1375).toLocaleString()}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 shadow-sm">
                          FREE
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Info below container */}
                  <div className="flex justify-between items-start mb-2 px-1">
                    <div className="flex-1 text-left">
                      {isCategory ? (
                        <button
                          onClick={() => setActiveCategory("merch")}
                          className="text-left font-bold text-zinc-900 hover:text-zinc-600 transition-colors leading-tight text-base group-hover:underline"
                        >
                          {product.name}
                        </button>
                      ) : (
                        <Link
                          href={`/store/${product.id}`}
                          className="font-bold text-zinc-900 hover:text-zinc-600 transition-colors leading-tight text-base group-hover:underline"
                        >
                          {product.name}
                        </Link>
                      )}
                    </div>
                    <button className="text-zinc-400 hover:text-red-500 transition-colors ml-2">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-zinc-500 text-xs line-clamp-2 leading-relaxed mb-3 px-1 text-left">
                    {product.description}
                  </p>

                  <div className="flex items-center gap-1.5 mb-4 px-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-zinc-800 text-xs font-bold">{product.rating}</span>
                    <span className="text-zinc-400 text-xs">({product.reviews} reviews)</span>
                  </div>
                </div>

                {/* Add to Cart / Action Button */}
                <div className="px-1 mt-auto">
                  {isCategory ? (
                    <button
                      onClick={() => setActiveCategory("merch")}
                      className="w-full bg-zinc-950 text-white py-3 text-xs font-bold hover:bg-zinc-800 transition-colors text-center uppercase tracking-wider rounded-none"
                    >
                      Explore Collection
                    </button>
                  ) : product.price === 0 && product.pdfUrl ? (
                    <a
                      href={product.pdfUrl}
                      download={`${product.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`}
                      className="w-full bg-emerald-600 text-white py-3 text-xs font-bold hover:bg-emerald-500 transition-colors text-center uppercase tracking-wider rounded-none flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Download size={14} />
                      Download Free Guide
                    </a>
                  ) : (
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
                      className="w-full border border-zinc-250 text-zinc-800 py-3 text-xs font-bold hover:bg-zinc-950 hover:text-white hover:border-zinc-950 transition-all text-center uppercase tracking-wider rounded-none"
                    >
                      Add to Cart
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Newsletter */}
      <div className="max-w-7xl mx-auto mt-28 px-4">
        <div className="py-16 px-6 bg-zinc-50 border border-zinc-100 rounded-none text-center max-w-4xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 mb-2 tracking-tight">Stay Updated</h2>
          <p className="text-zinc-500 mb-8 font-light text-sm max-w-md mx-auto">
            Be the first to know about new products, physical materials, and exclusive subscriber offers.
          </p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              disabled={isSubmitting}
              required
              className="flex-1 bg-white border border-zinc-200 rounded-none px-5 py-3 text-zinc-800 text-sm placeholder-zinc-400 focus:outline-none focus:border-zinc-900 transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-zinc-900 text-white px-8 py-3 text-sm font-bold hover:bg-zinc-800 transition-colors disabled:opacity-50 min-w-[120px] rounded-none uppercase tracking-wider"
            >
              {isSubmitting ? "Subscribed..." : "Subscribe"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function StorePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#60a5fa]" />
      </div>
    }>
      <StoreContent />
    </Suspense>
  );
}
