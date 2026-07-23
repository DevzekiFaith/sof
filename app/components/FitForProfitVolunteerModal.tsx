"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Heart, Users, Send, CheckCircle2, ShieldCheck, ArrowRight, User, Phone, Mail, MapPin, Award, Sparkles } from "lucide-react";
import { useToast } from "../contexts/ToastContext";

interface FitForProfitVolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FitForProfitVolunteerModal({
  isOpen,
  onClose,
}: FitForProfitVolunteerModalProps) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    state: "",
    role: "Community Outreach Facilitator",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.email || !formData.state) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      showToast("Volunteer application submitted successfully!", "success");
    }, 700);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      state: "",
      role: "Community Outreach Facilitator",
      notes: "",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-hidden animate-fadeIn">
      {/* Glow Ambient Backdrop */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#60a5fa]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Modal Card Shell - Compact Height with max-h-[85vh] */}
      <div className="relative w-full max-w-lg bg-[#080c16] border border-[#60a5fa]/30 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(96,165,250,0.2)] transform transition-all max-h-[88vh] flex flex-col">
        
        {/* Top Floating Glow Border Accent */}
        <div className="h-1 w-full bg-gradient-to-r from-[#60a5fa] via-blue-500 to-indigo-500 shrink-0" />

        {/* Top-Right High Visibility Close Button */}
        <button
          onClick={handleResetAndClose}
          title="Close Modal"
          className="absolute top-3 right-3 z-30 px-3 py-1.5 bg-black/70 hover:bg-red-500 text-white rounded-full flex items-center gap-1.5 transition-all border border-white/20 shadow-lg backdrop-blur-md cursor-pointer text-xs font-bold"
        >
          <span>Close</span>
          <X className="w-4 h-4" />
        </button>

        {/* Compact Banner Header */}
        <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-gradient-to-br from-[#0a1122] via-[#0d172e] to-[#172545] shrink-0">
          <Image
            src="/fit_for_profit.jpg"
            alt="Fit For Profit Outreach Banner"
            fill
            className="object-cover opacity-35 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080c16] via-[#080c16]/50 to-transparent" />
          
          <div className="absolute bottom-3 left-5 right-5 z-10 space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#60a5fa]/20 border border-[#60a5fa]/40 rounded-full text-[9px] font-black text-[#60a5fa] uppercase tracking-wider backdrop-blur-md">
              <Heart className="w-3 h-3 text-[#60a5fa] fill-[#60a5fa]/40 animate-pulse" />
              <span>FREE COMMUNITY OUTREACH MOVEMENT</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
              Fit-For-Profit Volunteer Corps
            </h2>
          </div>
        </div>

        {/* Scrollable Form Body Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {isSubmitted ? (
            <div className="text-center space-y-4 py-2 animate-fadeIn">
              <div className="relative w-14 h-14 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-lg animate-pulse" />
                <div className="relative w-14 h-14 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-[10px] font-bold text-emerald-400">
                  <Sparkles className="w-3 h-3" />
                  <span>Registration Confirmed</span>
                </div>
                <h3 className="text-xl font-black text-white tracking-tight">Application Received!</h3>
                <p className="text-xs text-zinc-300 max-w-xs mx-auto leading-relaxed">
                  Thank you, <strong className="text-white">{formData.fullName}</strong>. You are enrolled in the <strong className="text-[#60a5fa]">Volunteer Corps</strong>.
                </p>
              </div>

              <div className="p-3 bg-[#0d1424] border border-white/10 rounded-xl text-left space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-zinc-400 font-bold uppercase">
                  <span>Assigned Role</span>
                  <span className="text-[#60a5fa]">{formData.role}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400 font-bold uppercase">
                  <span>Location</span>
                  <span className="text-zinc-200">{formData.state}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <a
                  href={`https://wa.me/2349119059859?text=Hello%20Fit-For-Profit%20Volunteer%20Coordinator,%20I%20am%20${encodeURIComponent(formData.fullName)}%20from%20${encodeURIComponent(formData.state)}.%20I%20just%20submitted%20my%20volunteer%20application!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-full text-xs transition-all flex items-center justify-center gap-1.5 shadow-md"
                >
                  <span>Connect on WhatsApp</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={handleResetAndClose}
                  className="px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-full text-xs transition-all border border-white/10"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-zinc-300 uppercase tracking-wider flex items-center gap-1">
                    <User className="w-3 h-3 text-[#60a5fa]" />
                    <span>Full Name</span>
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Samuel Okon"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#0d1424] border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#60a5fa] transition-all"
                  />
                </div>

                {/* WhatsApp / Phone */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-zinc-300 uppercase tracking-wider flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#60a5fa]" />
                    <span>WhatsApp / Phone</span>
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 08012345678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#0d1424] border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#60a5fa] transition-all"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                {/* Email Address */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-zinc-300 uppercase tracking-wider flex items-center gap-1">
                    <Mail className="w-3 h-3 text-[#60a5fa]" />
                    <span>Email Address</span>
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#0d1424] border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#60a5fa] transition-all"
                  />
                </div>

                {/* State / City */}
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-zinc-300 uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#60a5fa]" />
                    <span>State / Location</span>
                    <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lagos, Abuja, Uyo"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#0d1424] border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#60a5fa] transition-all"
                  />
                </div>
              </div>

              {/* Volunteer Contribution Role */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-zinc-300 uppercase tracking-wider flex items-center gap-1">
                  <Award className="w-3 h-3 text-[#60a5fa]" />
                  <span>Preferred Volunteer Area</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#0d1424] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#60a5fa] transition-all"
                >
                  <option value="Community Outreach Facilitator">Community Outreach Facilitator</option>
                  <option value="School & Education Mentor">School & Education Mentor</option>
                  <option value="Logistics & Event Setup">Logistics & Event Setup</option>
                  <option value="Media, Photography & Content">Media, Photography & Content</option>
                  <option value="General Outreach Volunteer">General Outreach Volunteer</option>
                </select>
              </div>

              {/* Action Buttons Row with explicit Close and Submit */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-extrabold rounded-full text-xs transition-all border border-white/10 cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-[#60a5fa] hover:bg-[#3b82f6] text-black font-extrabold rounded-full text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#60a5fa]/20 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? "Submitting..." : "Submit Volunteer Application"}</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-zinc-400 pt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>100% Free Participation • No Fees Required</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
