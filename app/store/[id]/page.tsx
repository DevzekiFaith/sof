"use client";

import { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Star, Download, ShoppingCart, ShieldCheck, FileText, CheckCircle, Lock, Heart, Users, BookOpen, Sparkles } from "lucide-react";
import { useCart } from "../../contexts/CartContext";
import { useToast } from "../../contexts/ToastContext";
import { useUser } from "../../contexts/UserContext";
import { getProductById, STORE_PRODUCTS } from "../../data/store-products";
import FitForProfitVolunteerModal from "../../components/FitForProfitVolunteerModal";
import EBookReaderModal from "../../components/EBookReaderModal";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { addToCart, cart } = useCart();
  const { showToast } = useToast();
  const { currentUser, getOwnedCourses } = useUser();
  const [isVolunteerModalOpen, setIsVolunteerModalOpen] = useState(false);
  const [isReaderOpen, setIsReaderOpen] = useState(false);

  const product = getProductById(id);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <Link href="/store" className="text-[#60a5fa] hover:underline flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Store
        </Link>
      </div>
    );
  }

  // Check if this product is owned by the user (IDs are saved as store-[id])
  const ownedIds = getOwnedCourses();
  const isPurchased = ownedIds.includes(`store-${product.id}`);

  // Check if item is already in the cart
  const isInCart = cart.some((item) => item.id === `store-${product.id}`);

  const handleAddToCart = () => {
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
  };

  const handleBuyNow = () => {
    if (!isInCart) {
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
    }
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#60a5fa]/30 selection:text-white pb-20">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">
        <Link
          href="/store"
          className="inline-flex items-center gap-2 text-sm text-[#9aa4b2] hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Back to Store
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-4 mt-4">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Image Cover & Quick Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-white/5 bg-zinc-950 shadow-2xl">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
                  <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-20`} />
                  <product.icon className="text-[#60a5fa] w-32 h-32 opacity-80 z-10" />
                </div>
              )}
              {product.price > 0 ? (
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                  <span className="text-[#60a5fa] font-black text-lg">₦{(product.priceNGN || Math.round(product.price * 1375)).toLocaleString()}</span>
                  <span className="text-zinc-500 text-xs font-semibold">(${product.price})</span>
                </div>
              ) : (
                <div className="absolute top-4 right-4 bg-emerald-500/20 backdrop-blur-md px-4 py-2 rounded-full border border-emerald-500/30">
                  <span className="text-emerald-400 font-bold text-lg">FREE</span>
                </div>
              )}
            </div>

            {/* User Ownership / Action Panel */}
            <div className="bg-[#141414] border border-white/5 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div>
                  <div className="text-xs text-[#9aa4b2] uppercase tracking-wider font-bold mb-1">Format</div>
                  <div className="font-semibold text-sm flex items-center gap-1.5">
                    <FileText size={16} className="text-[#60a5fa]" />
                    {product.category === "ebooks" ? "Digital PDF eBook" : product.category === "courses" ? "Interactive Session / Ticket" : "Premium Merchandise"}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#9aa4b2] uppercase tracking-wider font-bold mb-1">Customer Reviews</div>
                  <div className="flex items-center justify-end gap-1.5">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-bold">{product.rating}</span>
                    <span className="text-[#666] text-xs">({product.reviews})</span>
                  </div>
                </div>
              </div>

              {isPurchased || product.price === 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3.5 rounded-xl text-sm font-semibold">
                    <CheckCircle size={18} />
                    {product.price === 0 ? "Free Mindset Blueprint Guide" : "You own this resource!"}
                  </div>
                  {product.pdfUrl ? (
                    <a
                      href={product.pdfUrl}
                      download={`${product.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`}
                      className="w-full bg-emerald-500 text-black py-4 rounded-full font-bold hover:bg-emerald-400 transition-colors text-center flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 text-base"
                    >
                      <Download size={20} />
                      Download Free Guide (PDF)
                    </a>
                  ) : (
                    <div className="w-full bg-[#1e1e1e] text-[#9aa4b2] py-4 rounded-full font-bold text-center text-sm border border-white/5">
                      Registration Complete (Link Sent via Email)
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={isInCart}
                    className={`py-3.5 rounded-full font-bold transition-all text-center flex items-center justify-center gap-2 text-sm border ${
                      isInCart
                        ? "bg-transparent text-zinc-600 border-zinc-800 cursor-not-allowed"
                        : "bg-transparent text-white border-white/20 hover:border-white hover:bg-white/5"
                    }`}
                  >
                    <ShoppingCart size={16} />
                    {isInCart ? "In Cart" : "Add to Cart"}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="bg-[#60a5fa] text-black py-3.5 rounded-full font-bold hover:bg-[#60a5fa]/80 transition-colors text-center text-sm shadow-lg shadow-[#60a5fa]/10"
                  >
                    Buy Now
                  </button>
                </div>
              )}

              {/* Interactive E-Book Reader Button for Money Farming */}
              {product.id === 7 && (
                <div className="pt-2">
                  <button
                    onClick={() => setIsReaderOpen(true)}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-[#0d172e] via-[#101f3e] to-[#172d5a] border border-[#60a5fa]/40 hover:border-[#60a5fa] text-white font-extrabold rounded-full text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-950/40 hover:scale-[1.02] cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-[#60a5fa]" />
                    <span>Read Sample E-Book / Interactive Reader</span>
                  </button>
                </div>
              )}

              <div className="flex items-center gap-2 text-xs text-[#666] justify-center mt-2">
                <ShieldCheck size={14} />
                <span>Secure payment powered by Flutterwave</span>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Product Description */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
              {product.name}
            </h1>
            <div className="flex items-center gap-3">
              <span className="px-3.5 py-1 bg-[#60a5fa]/10 border border-[#60a5fa]/20 text-[#60a5fa] text-xs font-bold uppercase rounded-full tracking-wider">
                {product.category}
              </span>
              <span className="text-zinc-500 text-sm">|</span>
              <span className="text-zinc-400 text-sm">Lifetime Access</span>
            </div>

            <div className="h-px bg-white/5 my-6" />

            {/* Description Render */}
            <div className="prose prose-invert max-w-none text-[#b3b3b3] space-y-4 leading-relaxed font-light text-base md:text-lg">
              {product.rawDescription ? (
                <div 
                  className="selar-raw-desc space-y-4"
                  dangerouslySetInnerHTML={{ __html: product.rawDescription }} 
                />
              ) : (
                <p>{product.description}</p>
              )}
            </div>

            {/* Downloadable PDF Manuscripts & Bonus Materials Section */}
            {product.bonusPdfs && product.bonusPdfs.length > 0 && (
              <div className="mt-8 p-6 bg-[#121824] border border-[#60a5fa]/20 rounded-2xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-[#60a5fa]/10 text-[#60a5fa] rounded-xl border border-[#60a5fa]/20">
                    <FileText size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Included PDF Manuscripts & Special Guides</h3>
                    <p className="text-xs text-[#9aa4b2]">Instant digital downloads included with this release</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {product.bonusPdfs.map((bonus, idx) => {
                    const coverImg = bonus.name.includes("Human Broadcast") || bonus.name.includes("Complete E-Book")
                      ? "/cover_human_broadcast.png"
                      : bonus.name.includes("Intent Framework")
                      ? "/cover_human_intent.png"
                      : bonus.name.includes("Environment Matrix")
                      ? "/cover_environment_matrix.png"
                      : bonus.name.includes("Architecture of Intention")
                      ? "/cover_intention_blueprint.png"
                      : null;

                    return (
                      <div 
                        key={idx} 
                        className="flex items-center justify-between gap-4 p-3.5 bg-[#0b0e17] border border-white/5 rounded-2xl hover:border-[#60a5fa]/30 transition-all shadow-md"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          {coverImg ? (
                            <div className="relative w-12 h-16 rounded-xl overflow-hidden shrink-0 border border-white/10 shadow-md bg-zinc-950">
                              <Image src={coverImg} alt={bonus.name} fill className="object-cover" />
                            </div>
                          ) : (
                            <div className="p-2.5 bg-[#60a5fa]/10 text-[#60a5fa] rounded-xl border border-[#60a5fa]/20 shrink-0">
                              <FileText className="w-5 h-5" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-white leading-snug truncate">{bonus.name}</h4>
                            <span className="text-xs text-zinc-400 font-medium">{bonus.size || "PDF Document"}</span>
                          </div>
                        </div>

                        {isPurchased || product.price === 0 ? (
                          <a
                            href={bonus.url}
                            download={`${bonus.name.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`}
                            className="px-4 py-2 bg-[#60a5fa] text-black text-xs font-bold rounded-full hover:bg-[#60a5fa]/80 transition-colors shrink-0 flex items-center gap-1.5 shadow-md"
                          >
                            <Download size={14} />
                            Download
                          </a>
                        ) : (
                          <span className="px-3.5 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-semibold rounded-full shrink-0 flex items-center gap-1.5">
                            <Lock size={12} className="text-[#60a5fa]" />
                            Included
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Fit-For-Profit Volunteer Community Outreach Movement Banner */}
            {(product.id === 16 || product.name.includes("Fit-For-Profit")) && (
              <div className="mt-8 relative overflow-hidden rounded-2xl border border-[#60a5fa]/40 bg-gradient-to-r from-[#0b1424] via-[#0f1d38] to-[#122444] p-6 sm:p-8 shadow-2xl shadow-blue-950/40 space-y-4">
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#60a5fa]/20 border border-[#60a5fa]/40 rounded-full text-[10px] font-black text-[#60a5fa] uppercase tracking-wider">
                      <Heart className="w-3.5 h-3.5 text-[#60a5fa] fill-[#60a5fa]/30" />
                      <span>Free Community Outreach Movement</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      Volunteer for Fit-For-Profit Community Service
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed">
                      We stage free regional outreaches serving schools, education platforms, and local communities across different states. Join our team of dedicated volunteers!
                    </p>
                  </div>
                  <button
                    onClick={() => setIsVolunteerModalOpen(true)}
                    className="px-6 py-3.5 bg-[#60a5fa] hover:bg-[#3b82f6] text-black font-extrabold rounded-full text-sm transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-[#60a5fa]/20 cursor-pointer"
                  >
                    <Users className="w-4 h-4" />
                    <span>Join as Volunteer</span>
                  </button>
                </div>
              </div>
            )}

            {/* Related Products Recommendation */}
            <div className="mt-12 pt-8 border-t border-white/5">
              <h3 className="text-xl font-bold text-white mb-6">Related Programs & Resources</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {STORE_PRODUCTS.filter(p => p.id !== product.id && (p.category === product.category || p.id === 17 || p.id === 16)).slice(0, 2).map((relProduct) => (
                  <Link 
                    key={relProduct.id} 
                    href={`/store/${relProduct.id}`}
                    className="flex items-center gap-4 bg-[#141414] hover:bg-[#1a1a1a] transition-all p-4 rounded-xl border border-white/5 hover:border-[#60a5fa]/20 group"
                  >
                    <div className="relative w-16 h-20 bg-zinc-900 rounded-lg overflow-hidden shrink-0">
                      {relProduct.imageUrl ? (
                        <Image src={relProduct.imageUrl} alt={relProduct.name} fill className="object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-800">
                          <relProduct.icon className="text-[#60a5fa] w-8 h-8" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-white text-sm group-hover:text-[#60a5fa] transition-colors truncate">{relProduct.name}</h4>
                      <p className="text-xs text-[#9aa4b2] line-clamp-1 mt-0.5">{relProduct.description}</p>
                      <span className="text-xs font-bold text-[#60a5fa] block mt-2">
                        {relProduct.price > 0 ? `₦${(relProduct.priceNGN || Math.round(relProduct.price * 1375)).toLocaleString()}` : "FREE"}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Styled desc formatting to match raw html styling */}
      <style jsx global>{`
        .selar-raw-desc h1 {
          font-size: 1.75rem;
          font-weight: 800;
          color: white;
          margin-bottom: 1rem;
          line-height: 1.2;
        }
        .selar-raw-desc h2 {
          font-size: 1.35rem;
          font-weight: 700;
          color: white;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .selar-raw-desc h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: white;
          margin-top: 1.25rem;
          margin-bottom: 0.5rem;
        }
        .selar-raw-desc p {
          margin-bottom: 1rem;
        }
        .selar-raw-desc ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .selar-raw-desc li {
          margin-bottom: 0.35rem;
        }
        .selar-raw-desc blockquote {
          border-left: 4px solid #60a5fa;
          padding-left: 1rem;
          color: #9aa4b2;
          font-style: italic;
          margin: 1.5rem 0;
        }
      `}</style>

      {/* Volunteer Registration Modal */}
      <FitForProfitVolunteerModal
        isOpen={isVolunteerModalOpen}
        onClose={() => setIsVolunteerModalOpen(false)}
      />

      {/* Interactive E-Book Reader Modal */}
      <EBookReaderModal
        isOpen={isReaderOpen}
        onClose={() => setIsReaderOpen(false)}
      />
    </div>
  );
}
