"use client";

import { useState, useEffect, useRef, use, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Camera, QrCode, ShoppingCart, BookOpen, Volume2, VolumeX, CheckCircle2, AlertCircle, Sparkles, ShoppingBag, Eye } from "lucide-react";
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
  rawItem: any;
}

function ScannerContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const autoScanCode = searchParams.get("autoScan");

  const { addToCart, cart } = useCart();
  const { showToast } = useToast();
  const { currentUser, getOwnedCourses } = useUser();

  // Scanner States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<ScannedProduct | null>(null);
  const [nativeSupport, setNativeSupport] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

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
      osc.frequency.setValueAtTime(1200, ctx.currentTime); // High pitch check beep
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15); // Short decay
      
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
    if (typeof window !== "undefined" && "BarcodeDetector" in window) {
      setNativeSupport(true);
    }
  }, []);

  // Handle URL Auto-Scan parameters for instant testing
  useEffect(() => {
    if (autoScanCode) {
      const timer = setTimeout(() => {
        handleCodeDecoded(autoScanCode);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [autoScanCode]);

  // Decode codes and map them to Store Products or Courses
  const handleCodeDecoded = (rawValue: string) => {
    setIsScanning(true);
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
        setIsScanning(false);
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
        setIsScanning(false);
        stopCamera();
        return;
      }
    }

    // Invalid code scanned
    showToast(`Invalid scan code detected: "${rawValue}"`, "error");
    setIsScanning(false);
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
    } catch (err: any) {
      console.error("Camera access failed:", err);
      let errorMsg = "Could not access background camera. Fallback to manual scan simulation tools.";
      if (err.message === "SECURE_CONTEXT_REQUIRED") {
        errorMsg = "Camera access requires a secure connection (HTTPS) or localhost. Please use the simulated scanner tools below to test.";
      } else if (err.name === "NotAllowedError") {
        errorMsg = "Camera permission was denied. Please allow camera access in your browser settings.";
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
    const BarcodeDetectorClass = (window as any).BarcodeDetector;
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
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#60a5fa]/30 selection:text-white pb-20">
      
      {/* Top Header */}
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-4 flex items-center justify-between">
        <Link
          href="/store"
          className="inline-flex items-center gap-2 text-sm text-[#9aa4b2] hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Back to Store
        </Link>
        
        <button
          onClick={() => setIsSoundMuted(!isSoundMuted)}
          className="p-2 text-zinc-400 hover:text-white bg-zinc-900 border border-white/5 rounded-full transition-colors"
          title={isSoundMuted ? "Unmute Scanner Beep" : "Mute Scanner Beep"}
        >
          {isSoundMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      <main className="max-w-4xl mx-auto px-4 mt-4 space-y-8">
        
        {/* Title Description Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center justify-center gap-2">
            <QrCode className="text-[#60a5fa] w-8 h-8" />
            Origin Scanner
          </h1>
          <p className="text-sm text-[#9aa4b2] max-w-md mx-auto font-light leading-relaxed">
            Scan QR codes on course syllabus manuals or product tags to instantly enroll or add products to your cart.
          </p>
        </div>

        {/* Viewfinder Window */}
        <div className="relative aspect-video max-w-xl mx-auto rounded-3xl overflow-hidden border border-white/10 bg-zinc-950 shadow-2xl flex flex-col items-center justify-center">
          
          {isCameraActive ? (
            <>
              {/* Live Camera Video stream */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              
              {/* Target bracket viewfinder overlays */}
              <div className="absolute inset-0 border-[3px] border-transparent flex items-center justify-center pointer-events-none z-10">
                <div className="w-[60%] aspect-video border-[2px] border-dashed border-[#60a5fa]/60 relative rounded-xl flex items-center justify-center">
                  {/* Glowing Laser line */}
                  <div className="absolute inset-x-0 h-0.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse top-1/2 -translate-y-1/2" />
                  
                  {/* Viewfinder corner brackets */}
                  <div className="absolute -top-1.5 -left-1.5 w-6 h-6 border-t-4 border-l-4 border-[#60a5fa] rounded-tl-md" />
                  <div className="absolute -top-1.5 -right-1.5 w-6 h-6 border-t-4 border-r-4 border-[#60a5fa] rounded-tr-md" />
                  <div className="absolute -bottom-1.5 -left-1.5 w-6 h-6 border-b-4 border-l-4 border-[#60a5fa] rounded-bl-md" />
                  <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 border-b-4 border-r-4 border-[#60a5fa] rounded-br-md" />
                </div>
              </div>

              {/* Status HUD indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-xs font-semibold flex items-center gap-1.5 z-20">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[#9aa4b2]">Align code inside frame</span>
              </div>
            </>
          ) : (
            <div className="p-8 text-center space-y-6 z-10 max-w-sm">
              <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center mx-auto text-[#60a5fa]">
                <Camera size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-lg text-white">Camera Standby</h3>
                <p className="text-xs text-[#9aa4b2] leading-relaxed">
                  Start the camera stream to scan physical QR codes, or use the quick simulation options below to test.
                </p>
              </div>
              <button
                onClick={startCamera}
                className="px-6 py-2.5 bg-[#60a5fa] text-black font-bold rounded-full text-sm hover:bg-[#60a5fa]/80 transition-colors shadow-lg shadow-[#60a5fa]/10"
              >
                Access Device Camera
              </button>
            </div>
          )}

          {/* Camera Access error messages */}
          {cameraError && (
            <div className="absolute inset-0 bg-zinc-950 p-6 flex flex-col items-center justify-center text-center space-y-4 z-20">
              <AlertCircle className="text-red-500 w-12 h-12" />
              <div className="space-y-1">
                <h4 className="font-bold text-white text-base">Camera Connection Failed</h4>
                <p className="text-xs text-[#9aa4b2] max-w-xs mx-auto leading-relaxed">
                  {cameraError}
                </p>
              </div>
              <button
                onClick={() => setCameraError(null)}
                className="px-5 py-2 bg-zinc-900 border border-white/5 hover:bg-zinc-800 rounded-full text-xs font-bold transition-colors"
              >
                Dismiss Warning
              </button>
            </div>
          )}
        </div>

        {/* Dynamic Scan Result Modal (Shows when item is successfully matched) */}
        {scannedResult && (
          <div className="bg-[#141414] border border-white/5 rounded-3xl p-6 md:p-8 space-y-6 max-w-xl mx-auto shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#60a5fa]/5 rounded-bl-full pointer-events-none" />
            
            {/* Header info */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-20 relative rounded-lg overflow-hidden border border-white/10 shrink-0 bg-zinc-900 flex items-center justify-center text-[#60a5fa]">
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
                  <span className="px-2.5 py-0.5 bg-[#60a5fa]/10 border border-[#60a5fa]/20 text-[#60a5fa] text-[10px] font-bold uppercase rounded-full tracking-wider">
                    {scannedResult.type}
                  </span>
                  {scannedResult.price === 0 && (
                    <span className="px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded-full">
                      FREE
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold leading-snug text-white">{scannedResult.name}</h3>
                <p className="text-xs text-[#9aa4b2] line-clamp-2 leading-relaxed">{scannedResult.description}</p>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="pt-4 border-t border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div>
                <span className="text-xs text-[#666] block uppercase tracking-wider font-bold mb-1">Pricing</span>
                <span className="text-2xl font-black text-white">
                  {scannedResult.price > 0 ? `$${scannedResult.price.toFixed(2)}` : "Free Access"}
                </span>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setScannedResult(null)}
                  className="flex-1 sm:flex-none px-5 py-3 bg-zinc-900 border border-white/5 hover:bg-zinc-800 rounded-full font-bold text-sm transition-colors text-[#b3b3b3] hover:text-white"
                >
                  Scan Again
                </button>
                
                {isOwned ? (
                  <Link
                    href={scannedResult.type === "product" ? `/store/${scannedResult.id.replace("store-", "")}` : `/courses/${scannedResult.id}`}
                    className="flex-1 sm:flex-none px-6 py-3 bg-emerald-500 text-black font-bold rounded-full text-sm hover:bg-emerald-400 transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/10"
                  >
                    <CheckCircle2 size={16} />
                    View Purchased
                  </Link>
                ) : (
                  <>
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 sm:flex-none px-5 py-3 bg-transparent border border-white/20 text-white font-bold rounded-full text-sm hover:border-white hover:bg-white/5 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ShoppingCart size={16} />
                      Cart
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="flex-1 sm:flex-none px-6 py-3 bg-[#60a5fa] text-black font-bold rounded-full text-sm hover:bg-[#60a5fa]/80 transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-[#60a5fa]/10"
                    >
                      <ShoppingBag size={16} />
                      Buy Now
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Scanner Simulation Suite */}
        <div className="bg-[#141414] border border-white/5 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/5">
            <Sparkles className="text-[#60a5fa] w-5 h-5 shrink-0" />
            <div>
              <h3 className="font-bold text-white text-base">Quick Scan Simulator</h3>
              <p className="text-xs text-[#9aa4b2] font-light">
                No camera? No problem. Click any mock QR code below to simulate scanning it instantly.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            
            <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">eBook Product Codes</span>
                <h4 className="font-bold text-sm text-white">MONEY FARMING eBook</h4>
                <p className="text-xs text-zinc-400 line-clamp-1">Code: ORIGIN-STORE-7</p>
              </div>
              <button
                onClick={() => handleCodeDecoded("ORIGIN-STORE-7")}
                className="w-full bg-[#60a5fa]/10 border border-[#60a5fa]/20 hover:bg-[#60a5fa]/20 text-[#60a5fa] py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Eye size={12} /> Scan Money Farming eBook
              </button>
            </div>

            <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">eBook Product Codes</span>
                <h4 className="font-bold text-sm text-white">8 Q&A TO SELLING eBook</h4>
                <p className="text-xs text-zinc-400 line-clamp-1">Code: ORIGIN-STORE-8</p>
              </div>
              <button
                onClick={() => handleCodeDecoded("ORIGIN-STORE-8")}
                className="w-full bg-[#60a5fa]/10 border border-[#60a5fa]/20 hover:bg-[#60a5fa]/20 text-[#60a5fa] py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Eye size={12} /> Scan 8 Q&A To Selling eBook
              </button>
            </div>

            <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Course Enrollment Codes</span>
                <h4 className="font-bold text-sm text-white">Solution Mindset Course</h4>
                <p className="text-xs text-zinc-400 line-clamp-1">Code: ORIGIN-COURSE-problem-solving</p>
              </div>
              <button
                onClick={() => handleCodeDecoded("ORIGIN-COURSE-problem-solving")}
                className="w-full bg-[#60a5fa]/10 border border-[#60a5fa]/20 hover:bg-[#60a5fa]/20 text-[#60a5fa] py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Eye size={12} /> Scan Solution Mindset
              </button>
            </div>

            <div className="bg-zinc-900 border border-white/5 rounded-2xl p-4 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Course Enrollment Codes</span>
                <h4 className="font-bold text-sm text-white">Classical Thinking Course</h4>
                <p className="text-xs text-zinc-400 line-clamp-1">Code: ORIGIN-COURSE-classical-thinking</p>
              </div>
              <button
                onClick={() => handleCodeDecoded("ORIGIN-COURSE-classical-thinking")}
                className="w-full bg-[#60a5fa]/10 border border-[#60a5fa]/20 hover:bg-[#60a5fa]/20 text-[#60a5fa] py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Eye size={12} /> Scan Classical Thinking
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
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#60a5fa]" />
      </div>
    }>
      <ScannerContent />
    </Suspense>
  );
}
