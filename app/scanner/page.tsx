"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ArrowLeft, 
  Camera, 
  QrCode, 
  ShoppingCart, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ShoppingBag, 
  Eye,
  Send,
  Share2,
  Search,
  Check,
  Globe,
  Phone,
  Info
} from "lucide-react";

// Inline fallback social icons to support older lucide-react versions
function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="inline-block">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="inline-block">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
import { useCart } from "../contexts/CartContext";
import { useToast } from "../contexts/ToastContext";
import { useUser } from "../contexts/UserContext";
import { getProductById } from "../data/store-products";
import { courses } from "../data/courses";

interface ScannedProduct {
  type: "product" | "course";
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rawItem: any;
}

function ScannerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoScanCode = searchParams.get("autoScan");

  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { getOwnedCourses } = useUser();

  // Scanner & UI States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scannedResult, setScannedResult] = useState<ScannedProduct | null>(null);

  // QR Code Generation States
  const [qrDestination, setQrDestination] = useState<"home" | "register" | "store">("home");
  const [dynamicOrigin, setDynamicOrigin] = useState("https://origin-skills.com");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Retrieve window location origin in useEffect for SSR safety
  useEffect(() => {
    if (typeof window !== "undefined") {
      setDynamicOrigin(window.location.origin);
    }
  }, []);

  // Determine QR URL based on target selection
  const getQrUrl = () => {
    if (qrDestination === "register") return `${dynamicOrigin}/courses`; // courses is the main funnel
    if (qrDestination === "store") return `${dynamicOrigin}/store`;
    return `${dynamicOrigin}`;
  };

  // Play synthetic checkout beep
  const playBeep = () => {
    if (isSoundMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      console.warn("Audio Context beep failed:", e);
    }
  };

  // Check native browser BarcodeDetector support on mount
  useEffect(() => {
    // Check barcode detector support silently
  }, []);

  // Handle URL Auto-Scan parameters for instant testing
  useEffect(() => {
    if (autoScanCode) {
      const timer = setTimeout(() => {
        handleCodeDecoded(autoScanCode);
      }, 600);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoScanCode]);

  // Decode codes and map them to Store Products or Courses
  const handleCodeDecoded = (rawValue: string) => {
    playBeep();
    
    // Check if code matches ORIGIN-STORE-[ID]
    if (rawValue.startsWith("ORIGIN-STORE-")) {
      const prodId = parseInt(rawValue.replace("ORIGIN-STORE-", ""));
      const product = getProductById(prodId);
      if (product) {
        setScannedResult({
          type: "product",
          id: `store-${product.id}`,
          name: product.name,
          description: product.description,
          price: product.price,
          imageUrl: product.imageUrl,
          category: product.category,
          rawItem: product
        });
        showToast(`Scanned product: ${product.name}`, "success");
        stopCamera();
        return;
      }
    } 
    
    // Check if code matches ORIGIN-COURSE-[ID]
    if (rawValue.startsWith("ORIGIN-COURSE-")) {
      const courseId = rawValue.replace("ORIGIN-COURSE-", "");
      const course = courses.find((c) => c.id === courseId);
      if (course) {
        setScannedResult({
          type: "course",
          id: course.id,
          name: course.title,
          description: course.description,
          price: course.priceUSD || 14,
          imageUrl: course.imageUrl,
          category: "course",
          rawItem: course
        });
        showToast(`Scanned course: ${course.title}`, "success");
        stopCamera();
        return;
      }
    }

    // Invalid code scanned
    showToast(`Invalid scan code detected: "${rawValue}"`, "error");
  };

  // Start Live Camera
  const startCamera = async () => {
    setCameraError(null);
    setScannedResult(null);
    setIsCameraActive(true);
    try {
      if (typeof window === "undefined" || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("SECURE_CONTEXT_REQUIRED");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Start processing loops
      if ("BarcodeDetector" in window) {
        startNativeScannerLoop();
      }
    } catch (err: unknown) {
      console.error("Camera access failed:", err);
      let errorMsg = "Could not access background camera. Please use Simulated triggers below to test.";
      if (err instanceof Error) {
        if (err.message === "SECURE_CONTEXT_REQUIRED") {
          errorMsg = "Camera access requires HTTPS or localhost. Please use the simulated scanner tools below to test.";
        } else if (err.name === "NotAllowedError") {
          errorMsg = "Camera permission was denied. Please allow camera access in browser settings.";
        }
      }
      setCameraError(errorMsg);
      setIsCameraActive(false);
    }
  };

  // Stop Camera
  const stopCamera = () => {
    setIsCameraActive(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Native Barcode Detector scan loop on camera frames
  const startNativeScannerLoop = () => {
    const BarcodeDetectorClass = (window as unknown as { BarcodeDetector?: any }).BarcodeDetector;
    if (!BarcodeDetectorClass) return;

    const detector = new BarcodeDetectorClass({
      formats: ["qr_code", "code_128", "ean_13", "upc_a"]
    });

    const checkFrame = async () => {
      if (!videoRef.current || !isCameraActive || scannedResult) return;
      
      try {
        if (videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
          const barcodes = await detector.detect(videoRef.current);
          if (barcodes.length > 0) {
            handleCodeDecoded(barcodes[0].rawValue);
            return;
          }
        }
      } catch (err) {
        console.error("Barcode detection frame error:", err);
      }
      
      if (isCameraActive && !scannedResult) {
        animationFrameRef.current = requestAnimationFrame(checkFrame);
      }
    };

    animationFrameRef.current = requestAnimationFrame(checkFrame);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Action Handling
  const handleAddToCart = () => {
    if (!scannedResult) return;
    
    if (scannedResult.type === "product") {
      addToCart({
        id: scannedResult.id,
        title: scannedResult.name,
        description: scannedResult.description,
        fullDescription: scannedResult.description,
        priceUSD: scannedResult.price,
        imageUrl: scannedResult.imageUrl,
        bgGradient: scannedResult.rawItem.gradient || "from-[#60a5fa]/10 to-[#60a5fa]/5",
        icon: scannedResult.rawItem.icon,
        iconColor: "text-[#60a5fa]",
        ageRange: "All Ages",
      });
      showToast(`${scannedResult.name} added to cart!`, "success");
    } else {
      addToCart({
        id: scannedResult.id,
        title: scannedResult.name,
        description: scannedResult.description,
        fullDescription: scannedResult.description,
        priceUSD: scannedResult.price,
        imageUrl: scannedResult.imageUrl,
        bgGradient: scannedResult.rawItem.bgGradient || "from-[#60a5fa]/30 to-[#121212]",
        icon: scannedResult.rawItem.icon || BookOpen,
        iconColor: "text-[#60a5fa]",
        ageRange: scannedResult.rawItem.ageRange || "All Ages",
      });
      showToast(`${scannedResult.name} added to cart!`, "success");
    }
  };

  const handleBuyNow = () => {
    if (!scannedResult) return;
    handleAddToCart();
    router.push("/checkout");
  };

  // Check if user already owns this scanned item
  const ownedIds = getOwnedCourses();
  const isOwned = scannedResult ? ownedIds.includes(scannedResult.id) : false;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#021f18] via-[#043327] to-[#01140f] text-white font-sans selection:bg-emerald-500/30 selection:text-white pb-24">
      
      {/* Top Header */}
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-4 flex items-center justify-between">
        <Link
          href="/store"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950/40 border border-emerald-500/20 text-xs font-semibold text-[#a7f3d0] hover:text-white hover:bg-emerald-900/60 transition-all"
        >
          <ArrowLeft size={14} /> Back to Store
        </Link>
        
        <button
          onClick={() => setIsSoundMuted(!isSoundMuted)}
          className="p-2.5 text-emerald-400 hover:text-white bg-emerald-950/60 border border-emerald-500/20 rounded-full transition-colors"
          title={isSoundMuted ? "Unmute Scanner Beep" : "Mute Scanner Beep"}
        >
          {isSoundMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      <main className="max-w-6xl mx-auto px-4 mt-2 space-y-10">
        
        {/* Dynamic Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-[10px] font-bold uppercase rounded-full tracking-widest animate-pulse">
            <Sparkles size={12} /> Interactive App Flyer & Scanner
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white flex items-center justify-center gap-3">
            <QrCode className="text-emerald-400 w-9 h-9" />
            Origin Portal
          </h1>
          <p className="text-sm text-emerald-200/60 max-w-lg mx-auto font-light leading-relaxed">
            Scan local codes to enroll in courses instantly, or share the dynamic app QR code with other students to sign up.
          </p>
        </div>

        {/* Dynamic Selector for QR Link Destination */}
        <div className="max-w-md mx-auto bg-emerald-950/60 border border-emerald-500/20 p-1.5 rounded-2xl flex gap-1 shadow-inner">
          <button
            onClick={() => setQrDestination("home")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              qrDestination === "home"
                ? "bg-[#d4fc34] text-black shadow-md"
                : "text-emerald-300 hover:text-white hover:bg-white/5"
            }`}
          >
            Open Homepage
          </button>
          <button
            onClick={() => setQrDestination("register")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              qrDestination === "register"
                ? "bg-[#d4fc34] text-black shadow-md"
                : "text-emerald-300 hover:text-white hover:bg-white/5"
            }`}
          >
            Open Registration
          </button>
          <button
            onClick={() => setQrDestination("store")}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
              qrDestination === "store"
                ? "bg-[#d4fc34] text-black shadow-md"
                : "text-emerald-300 hover:text-white hover:bg-white/5"
            }`}
          >
            Open Product Store
          </button>
        </div>

        {/* Main Flyer Wrapper */}
        <div className="max-w-4xl mx-auto bg-[#004d3d] rounded-[3rem] border-8 border-emerald-950 overflow-hidden relative shadow-[0_30px_60px_rgba(0,0,0,0.6)] flex flex-col justify-between">
          
          {/* Top Curved Banner (Cream White) */}
          <div className="bg-[#fafafa] pt-8 pb-10 px-8 rounded-b-[3.5rem] border-b-4 border-emerald-950 relative flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left space-y-2">
              <span className="text-emerald-800 font-extrabold tracking-widest text-xs uppercase block">
                Yuk Gabung Origin Community!
              </span>
              <h2 className="text-3xl font-black text-emerald-950 tracking-tight leading-none">
                Scan the QR Code to Start!
              </h2>
              <p className="text-xs text-emerald-700 max-w-sm font-medium">
                Enroll in six premium courses or purchase materials instantly.
              </p>
            </div>

            {/* Logo details resembling top-right icon from image */}
            <div className="flex items-center gap-3 bg-emerald-950 text-white py-2 px-4 rounded-2xl shadow-lg">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center font-bold text-black text-sm">
                O
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold leading-none">Origin Hub</span>
                <span className="text-[8px] text-emerald-400 tracking-wider">origin.com</span>
              </div>
            </div>
          </div>

          {/* Core Flyer Body - Grid of Info and smartphone mockup */}
          <div className="p-8 md:p-12 grid md:grid-cols-12 gap-8 items-center relative z-20">
            
            {/* Left Section: Information Card OR Scan Results */}
            <div className="md:col-span-6 space-y-6">
              
              {scannedResult ? (
                /* REDESIGNED SCANNED RESULT DISPLAY */
                <div className="bg-emerald-950/80 border-2 border-yellow-400/40 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-bl-full pointer-events-none" />
                  
                  {/* Header info */}
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-20 relative rounded-xl overflow-hidden border border-white/10 shrink-0 bg-emerald-900 flex items-center justify-center text-yellow-400">
                      {scannedResult.imageUrl ? (
                        <Image
                          src={scannedResult.imageUrl}
                          alt={scannedResult.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <QrCode size={24} />
                      )}
                    </div>
                    
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-[#d4fc34] text-[9px] font-extrabold uppercase rounded-full tracking-wider">
                          {scannedResult.type}
                        </span>
                        {scannedResult.price === 0 && (
                          <span className="px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[9px] font-bold rounded-full">
                            FREE
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold leading-snug text-white">{scannedResult.name}</h3>
                      <p className="text-xs text-emerald-200/60 line-clamp-2 leading-relaxed">{scannedResult.description}</p>
                    </div>
                  </div>

                  {/* Actions Panel */}
                  <div className="pt-4 border-t border-emerald-500/20 flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div>
                      <span className="text-[10px] text-emerald-400 block uppercase tracking-wider font-extrabold mb-0.5">Price</span>
                      <span className="text-2xl font-black text-[#d4fc34]">
                        {scannedResult.price > 0 ? `$${scannedResult.price.toFixed(2)}` : "Free Access"}
                      </span>
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => setScannedResult(null)}
                        className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-900/60 hover:bg-emerald-800 text-xs font-bold rounded-xl transition-colors text-white"
                      >
                        Reset
                      </button>
                      
                      {isOwned ? (
                        <Link
                          href={scannedResult.type === "product" ? `/store/${scannedResult.id.replace("store-", "")}` : `/courses/${scannedResult.id}`}
                          className="flex-1 sm:flex-none px-5 py-2.5 bg-emerald-500 text-black font-extrabold rounded-xl text-xs hover:bg-emerald-400 transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10"
                        >
                          <CheckCircle2 size={14} />
                          Open
                        </Link>
                      ) : (
                        <>
                          <button
                            onClick={handleAddToCart}
                            className="flex-1 sm:flex-none px-4 py-2.5 bg-transparent border border-white/20 text-white font-extrabold rounded-xl text-xs hover:border-white hover:bg-white/5 transition-colors flex items-center justify-center gap-1.5"
                          >
                            <ShoppingCart size={14} />
                            +Cart
                          </button>
                          <button
                            onClick={handleBuyNow}
                            className="flex-1 sm:flex-none px-5 py-2.5 bg-[#d4fc34] text-black font-extrabold rounded-xl text-xs hover:bg-[#c3e830] transition-colors flex items-center justify-center gap-1.5 shadow-lg"
                          >
                            <ShoppingBag size={14} />
                            Buy
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* ORIGINAL DETAILS INFO CARD (Yellow styling based on flyer) */
                <div className="bg-[#d9f99d] text-emerald-950 p-6 md:p-8 rounded-[2rem] border-4 border-emerald-950 shadow-[6px_6px_0px_rgba(0,0,0,0.8)] space-y-5">
                  <div className="flex items-center gap-2">
                    <div className="bg-emerald-950 text-white rounded-full p-1.5">
                      <Info size={16} />
                    </div>
                    <h3 className="text-lg font-black uppercase tracking-wider">
                      Dapatkan Informasi:
                    </h3>
                  </div>

                  <ul className="space-y-4 text-xs font-bold text-emerald-900">
                    <li className="flex items-center gap-3.5 bg-[#cbfa6c]/50 p-2.5 rounded-xl border border-emerald-900/10">
                      <div className="w-6 h-6 rounded-full bg-emerald-900 text-[#d9f99d] flex items-center justify-center font-extrabold">
                        👤
                      </div>
                      <div>
                        <span className="block text-emerald-950 font-extrabold">PSB / Student registration</span>
                        <span className="text-[10px] text-emerald-800/80 font-medium">Join the platform to access your personal dashboard</span>
                      </div>
                    </li>
                    <li className="flex items-center gap-3.5 bg-[#cbfa6c]/50 p-2.5 rounded-xl border border-emerald-900/10">
                      <div className="w-6 h-6 rounded-full bg-emerald-900 text-[#d9f99d] flex items-center justify-center font-extrabold">
                        📚
                      </div>
                      <div>
                        <span className="block text-emerald-950 font-extrabold">Purchase Materials</span>
                        <span className="text-[10px] text-emerald-800/80 font-medium">Get eBooks like &quot;Money Farming&quot; &amp; &quot;8 Q&amp;A to Selling&quot;</span>
                      </div>
                    </li>
                    <li className="flex items-center gap-3.5 bg-[#cbfa6c]/50 p-2.5 rounded-xl border border-emerald-900/10">
                      <div className="w-6 h-6 rounded-full bg-emerald-900 text-[#d9f99d] flex items-center justify-center font-extrabold">
                        💬
                      </div>
                      <div>
                        <span className="block text-emerald-950 font-extrabold">Interactive Community</span>
                        <span className="text-[10px] text-emerald-800/80 font-medium">Engage in cohort learning and build networks</span>
                      </div>
                    </li>
                    <li className="flex items-center gap-3.5 bg-[#cbfa6c]/50 p-2.5 rounded-xl border border-emerald-900/10">
                      <div className="w-6 h-6 rounded-full bg-emerald-900 text-[#d9f99d] flex items-center justify-center font-extrabold">
                        🏆
                      </div>
                      <div>
                        <span className="block text-emerald-950 font-extrabold">Certifications & Milestones</span>
                        <span className="text-[10px] text-emerald-800/80 font-medium">Earn professional credits on completing modules</span>
                      </div>
                    </li>
                  </ul>
                </div>
              )}

              {/* Dynamic scan alert */}
              <div className="bg-emerald-950/40 border border-emerald-500/20 p-4 rounded-2xl flex items-start gap-3">
                <Sparkles className="text-yellow-400 shrink-0 mt-0.5" size={16} />
                <p className="text-[11px] text-emerald-200/80 leading-relaxed">
                  Use the <strong className="text-white">Quick Scan Simulator</strong> below if your browser doesn&apos;t support webcam permissions or if you are running in a local secure context.
                </p>
              </div>

            </div>

            {/* Right Section: Smartphone Mockup housing Scanner Viewport or App QR Code */}
            <div className="md:col-span-6 flex justify-center">
              
              {/* Smartphone Outer Shell */}
              <div className="relative w-[300px] h-[580px] bg-black rounded-[45px] border-[10px] border-zinc-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col justify-between select-none">
                
                {/* Dynamic Camera Notch / Island */}
                <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-zinc-900 rounded-full z-40 flex items-center justify-between px-3 border border-zinc-800/50">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-950/80 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-[#10b981] animate-pulse" />
                  </div>
                  <div className="w-10 h-1 bg-zinc-800 rounded-full" />
                </div>

                {/* Device Screen Container */}
                <div className="relative flex-1 bg-[#fcfbfa] flex flex-col pt-12 pb-4 px-4 overflow-hidden text-zinc-900 justify-between">
                  
                  {/* Status Bar */}
                  <div className="absolute top-2.5 inset-x-6 flex justify-between items-center text-[10px] font-extrabold text-zinc-800 z-30">
                    <span>9:41</span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-2 border border-zinc-800 rounded-xs inline-block relative">
                        <span className="absolute top-0.5 left-0.5 bottom-0.5 right-0.5 bg-zinc-800 rounded-2xs block" />
                      </span>
                    </div>
                  </div>

                  {/* Top Header - App Domain Display */}
                  <div className="text-center space-y-2 mt-2">
                    <div className="w-9 h-9 rounded-full bg-emerald-950 mx-auto flex items-center justify-center text-[#d4fc34] font-black text-xs shadow-md border-2 border-white">
                      O
                    </div>
                    <div className="font-extrabold text-xs text-zinc-950 tracking-tight select-all">
                      {qrDestination === "home" ? "origin-skills.com" : qrDestination === "register" ? "origin-skills.com/register" : "origin-skills.com/store"}
                    </div>

                    {/* Quick navigation tags inside phone */}
                    <div className="flex justify-center gap-1.5 pt-1.5 border-t border-zinc-200">
                      <div className="flex flex-col items-center gap-0.5 cursor-pointer hover:opacity-80">
                        <div className="w-7 h-7 rounded-full bg-[#faf9f5] border border-zinc-200 flex items-center justify-center text-emerald-600 text-xs">
                          <Check size={12} strokeWidth={3} />
                        </div>
                        <span className="text-[8px] font-bold text-zinc-500">Mengikuti</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5 cursor-pointer hover:opacity-80">
                        <div className="w-7 h-7 rounded-full bg-[#faf9f5] border border-zinc-200 flex items-center justify-center text-zinc-600 text-xs">
                          <Send size={11} />
                        </div>
                        <span className="text-[8px] font-bold text-zinc-500">Teruskan</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5 cursor-pointer hover:opacity-80">
                        <div className="w-7 h-7 rounded-full bg-[#faf9f5] border border-zinc-200 flex items-center justify-center text-zinc-600 text-xs">
                          <Share2 size={11} />
                        </div>
                        <span className="text-[8px] font-bold text-zinc-500">Bagikan</span>
                      </div>
                      <div className="flex flex-col items-center gap-0.5 cursor-pointer hover:opacity-80">
                        <div className="w-7 h-7 rounded-full bg-[#faf9f5] border border-zinc-200 flex items-center justify-center text-zinc-600 text-xs">
                          <Search size={11} />
                        </div>
                        <span className="text-[8px] font-bold text-zinc-500">Cari</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle Area: Viewfinder (if camera is active) OR Dynamic QR Code with Yellow Glow */}
                  <div className="flex-1 my-3 flex items-center justify-center relative overflow-hidden rounded-2xl">
                    
                    {isCameraActive ? (
                      /* Live Camera Viewfinder Overlay */
                      <div className="absolute inset-0 bg-black rounded-2xl overflow-hidden border-2 border-emerald-500/40">
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                        />
                        {/* Target bracket viewfinder overlays */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                          <div className="w-[70%] aspect-square border-2 border-dashed border-emerald-400/60 relative rounded-xl flex items-center justify-center">
                            
                            {/* Glowing Laser line */}
                            <div className="absolute inset-x-0 h-0.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-bounce top-1/2" />
                            
                            {/* Viewfinder corner brackets */}
                            <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-3 border-l-3 border-[#d4fc34] rounded-tl-md" />
                            <div className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-3 border-r-3 border-[#d4fc34] rounded-tr-md" />
                            <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-3 border-l-3 border-[#d4fc34] rounded-bl-md" />
                            <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-3 border-r-3 border-[#d4fc34] rounded-br-md" />
                          </div>
                        </div>

                        {/* Status HUD indicator inside screen */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/80 px-3 py-1 rounded-full border border-white/10 text-[9px] font-bold flex items-center gap-1.5 z-20 text-white">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                          <span>Align QR Code</span>
                        </div>
                      </div>
                    ) : (
                      /* Scannable Dynamic QR Code Card with Glowing Shadow */
                      <div className="relative group transition-transform duration-300">
                        {/* Neon Glow backdrops */}
                        <div className="absolute -inset-2 bg-yellow-400/70 rounded-3xl blur-xl opacity-80 group-hover:opacity-100 transition-opacity" />
                        
                        <div className="relative bg-white p-5 rounded-[2rem] border-[4px] border-emerald-950 shadow-[5px_5px_0px_rgba(4,51,39,1)] flex items-center justify-center w-40 h-40">
                          <Image
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(getQrUrl())}`}
                            alt="Dynamic Registration QR Code"
                            width={160}
                            height={160}
                            className="w-full h-full object-contain"
                            priority
                            unoptimized
                          />
                        </div>
                      </div>
                    )}

                    {/* Camera Access error messages overlay inside screen */}
                    {cameraError && (
                      <div className="absolute inset-0 bg-zinc-950 p-4 flex flex-col items-center justify-center text-center space-y-3 z-30 rounded-2xl text-white">
                        <AlertCircle className="text-red-500 w-10 h-10" />
                        <div className="space-y-1">
                          <h4 className="font-bold text-xs text-white">Connection Failed</h4>
                          <p className="text-[10px] text-[#9aa4b2] max-w-xs mx-auto leading-relaxed">
                            {cameraError}
                          </p>
                        </div>
                        <button
                          onClick={() => setCameraError(null)}
                          className="px-4 py-1.5 bg-zinc-900 border border-white/10 hover:bg-zinc-800 rounded-lg text-[9px] font-bold transition-colors"
                        >
                          Dismiss
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Below Area: Dynamic Interactive Scan Action Button */}
                  <div className="pb-2">
                    <button
                      onClick={isCameraActive ? stopCamera : startCamera}
                      className={`w-full py-3 px-6 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-300 transform hover:scale-[1.03] shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center justify-center gap-2 ${
                        isCameraActive
                          ? "bg-red-500 hover:bg-red-600 text-white"
                          : "bg-yellow-400 hover:bg-yellow-300 text-emerald-950"
                      }`}
                    >
                      {isCameraActive ? (
                        <>
                          <VolumeX size={14} /> Stop Scanner
                        </>
                      ) : (
                        <>
                          <Camera size={14} /> Scan Sekarang
                        </>
                      )}
                    </button>
                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* Footer Bar (Socials, Dynamic Address, Contact details) */}
          <div className="bg-emerald-950 py-5 px-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-emerald-900 z-10">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-yellow-400 text-emerald-950 text-[10px] font-extrabold uppercase rounded-full tracking-wider">
                Enrollment Open
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-emerald-300/80 font-bold">
              <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                <Globe size={13} /> origin.com
              </span>
              <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                <InstagramIcon size={13} /> @origin.edu
              </span>
              <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                <FacebookIcon size={13} /> origin.fb
              </span>
              <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer">
                <Phone size={13} /> +1 800 555 0190
              </span>
            </div>
          </div>

        </div>

        {/* Dashboard Simulator suite */}
        <div className="max-w-4xl mx-auto bg-emerald-950/40 border border-emerald-500/10 p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-emerald-500/10">
            <Sparkles className="text-yellow-400 w-5 h-5 shrink-0" />
            <div>
              <h3 className="font-extrabold text-white text-base">Quick Simulator Suite</h3>
              <p className="text-xs text-emerald-200/50 font-light">
                Click any mock code to simulate scanning it instantly and display the scanned item options on the flyer.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            
            <div className="bg-emerald-950/80 border border-emerald-500/10 hover:border-emerald-500/20 rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-colors">
              <div>
                <span className="text-[9px] text-[#d4fc34] font-extrabold uppercase tracking-wider block mb-1">eBook Product</span>
                <h4 className="font-bold text-xs text-white line-clamp-1">MONEY FARMING</h4>
                <p className="text-[10px] text-emerald-300/40">Code: ORIGIN-STORE-7</p>
              </div>
              <button
                onClick={() => handleCodeDecoded("ORIGIN-STORE-7")}
                className="w-full bg-[#d4fc34]/10 border border-[#d4fc34]/20 hover:bg-[#d4fc34]/20 text-[#d4fc34] py-1.5 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Eye size={11} /> Simulate Scan
              </button>
            </div>

            <div className="bg-emerald-950/80 border border-emerald-500/10 hover:border-emerald-500/20 rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-colors">
              <div>
                <span className="text-[9px] text-[#d4fc34] font-extrabold uppercase tracking-wider block mb-1">eBook Product</span>
                <h4 className="font-bold text-xs text-white line-clamp-1">8 Q&A TO SELLING</h4>
                <p className="text-[10px] text-emerald-300/40">Code: ORIGIN-STORE-8</p>
              </div>
              <button
                onClick={() => handleCodeDecoded("ORIGIN-STORE-8")}
                className="w-full bg-[#d4fc34]/10 border border-[#d4fc34]/20 hover:bg-[#d4fc34]/20 text-[#d4fc34] py-1.5 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Eye size={11} /> Simulate Scan
              </button>
            </div>

            <div className="bg-emerald-950/80 border border-emerald-500/10 hover:border-emerald-500/20 rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-colors">
              <div>
                <span className="text-[9px] text-[#d4fc34] font-extrabold uppercase tracking-wider block mb-1">Course Details</span>
                <h4 className="font-bold text-xs text-white line-clamp-1">Solution Mindset</h4>
                <p className="text-[10px] text-emerald-300/40">Code: ORIGIN-COURSE-problem-solving</p>
              </div>
              <button
                onClick={() => handleCodeDecoded("ORIGIN-COURSE-problem-solving")}
                className="w-full bg-[#d4fc34]/10 border border-[#d4fc34]/20 hover:bg-[#d4fc34]/20 text-[#d4fc34] py-1.5 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Eye size={11} /> Simulate Scan
              </button>
            </div>

            <div className="bg-emerald-950/80 border border-emerald-500/10 hover:border-emerald-500/20 rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-colors">
              <div>
                <span className="text-[9px] text-[#d4fc34] font-extrabold uppercase tracking-wider block mb-1">Course Details</span>
                <h4 className="font-bold text-xs text-white line-clamp-1">Classical Thinking</h4>
                <p className="text-[10px] text-emerald-300/40">Code: ORIGIN-COURSE-classical-thinking</p>
              </div>
              <button
                onClick={() => handleCodeDecoded("ORIGIN-COURSE-classical-thinking")}
                className="w-full bg-[#d4fc34]/10 border border-[#d4fc34]/20 hover:bg-[#d4fc34]/20 text-[#d4fc34] py-1.5 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Eye size={11} /> Simulate Scan
              </button>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}

export default function ScannerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#021f18] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400" />
      </div>
    }>
      <ScannerContent />
    </Suspense>
  );
}
