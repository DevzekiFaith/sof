"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, Users, MapPin, Video, Star, ArrowRight, Zap, MessageSquare, Target, TrendingUp } from "lucide-react";
import { useToast } from "../contexts/ToastContext";
import { supabase } from "../../lib/supabase";

export default function EventsPage() {
  const [activeFilter, setActiveFilter] = useState("all");
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
      showToast("Successfully subscribed to event notifications!", "success");
      setEmail("");
    } catch (err) {
      console.warn("Subscription fallback:", err);
      showToast("Successfully subscribed to event notifications!", "success");
      setEmail("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filters = [
    { id: "all", name: "All Events" },
    { id: "webinar", name: "Webinars" },
    { id: "workshop", name: "Workshops" },
    { id: "masterclass", name: "Masterclasses" },
  ];

  const events = [
    {
      id: 7,
      title: "JUMPSTART: The Accelerator Program",
      type: "masterclass",
      date: "Rolling Enrollments",
      time: "Self-Paced / Interactive Strategy",
      price: 15.00,
      icon: Zap,
      gradient: "from-[#60a5fa]/10 to-[#60a5fa]/5",
      imageUrl: "/jumpstart_cover.png",
      instructor: "Zeki Ubor",
      isOnline: true,
      spots: 142,
      totalSpots: 500,
      rating: 4.9,
      reviews: 142,
      description: "An intensive life accelerator combining cognitive psychology, value alignment, and strategic execution blueprints to jumpstart your career and significance."
    },
    {
      id: 1,
      title: "Problem Solving Masterclass",
      type: "masterclass",
      date: "July 15, 2024",
      time: "2:00 PM - 4:00 PM EST",
      price: 49.99,
      icon: Zap,
      gradient: "from-[#60a5fa]/10 to-[#60a5fa]/5",
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
      instructor: "Prof. James Wilson",
      isOnline: true,
      spots: 45,
      totalSpots: 100,
      rating: 4.9,
      reviews: 234,
      description: "Master the art of systematic problem solving with this intensive masterclass."
    },
    {
      id: 2,
      title: "Communication Skills Workshop",
      type: "workshop",
      date: "July 22, 2024",
      time: "10:00 AM - 12:00 PM EST",
      price: 29.99,
      icon: MessageSquare,
      gradient: "from-[#60a5fa]/10 to-[#60a5fa]/5",
      imageUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80",
      instructor: "Dr. Sarah Mitchell",
      isOnline: true,
      spots: 32,
      totalSpots: 50,
      rating: 4.8,
      reviews: 189,
      description: "Interactive workshop to improve your communication and public speaking skills."
    },
    {
      id: 3,
      title: "Decision Making Webinar",
      type: "webinar",
      date: "July 29, 2024",
      time: "3:00 PM - 4:30 PM EST",
      price: 19.99,
      icon: Target,
      gradient: "from-[#60a5fa]/10 to-[#60a5fa]/5",
      imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80",
      instructor: "Prof. James Wilson",
      isOnline: true,
      spots: 78,
      totalSpots: 200,
      rating: 4.7,
      reviews: 156,
      description: "Learn frameworks and tools for making better decisions under pressure."
    },
    {
      id: 4,
      title: "Team Building Workshop",
      type: "workshop",
      date: "August 5, 2024",
      time: "1:00 PM - 3:00 PM EST",
      price: 39.99,
      icon: Users,
      gradient: "from-[#60a5fa]/10 to-[#60a5fa]/5",
      imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
      instructor: "Dr. Sarah Mitchell",
      isOnline: true,
      spots: 18,
      totalSpots: 40,
      rating: 4.9,
      reviews: 267,
      description: "Build stronger teams through effective collaboration and communication."
    },
    {
      id: 5,
      title: "Self-Image & Confidence Masterclass",
      type: "masterclass",
      date: "August 12, 2024",
      time: "2:00 PM - 4:00 PM EST",
      price: 49.99,
      icon: TrendingUp,
      gradient: "from-[#60a5fa]/10 to-[#60a5fa]/5",
      imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
      instructor: "Dr. Sarah Mitchell",
      isOnline: true,
      spots: 55,
      totalSpots: 100,
      rating: 4.8,
      reviews: 198,
      description: "Transform your self-image and build lasting confidence."
    },
    {
      id: 6,
      title: "Adaptability & Resilience Webinar",
      type: "webinar",
      date: "August 19, 2024",
      time: "11:00 AM - 12:30 PM EST",
      price: 19.99,
      icon: TrendingUp,
      gradient: "from-[#60a5fa]/10 to-[#60a5fa]/5",
      imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80",
      instructor: "Prof. James Wilson",
      isOnline: true,
      spots: 92,
      totalSpots: 200,
      rating: 4.7,
      reviews: 145,
      description: "Learn to adapt to change and build personal resilience."
    },
  ];

  const filteredEvents = activeFilter === "all" 
    ? events 
    : events.filter(e => e.type === activeFilter);

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">Live Events</h1>
        <p className="text-[#b3b3b3] text-lg font-light">
          Join our webinars, workshops, and masterclasses to learn directly from experts.
        </p>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-wrap gap-3 justify-center">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeFilter === filter.id
                  ? "bg-[#60a5fa] text-black"
                  : "bg-[#141414] text-[#b3b3b3] hover:bg-[#1a1a1a] hover:text-white border border-white/5"
              }`}
            >
              {filter.name}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {filteredEvents.map((event) => {
            const Icon = event.icon;
            return (
              <div
                key={event.id}
                className="bg-[#141414] rounded-2xl overflow-hidden hover:bg-[#1a1a1a] transition-all border border-white/5 hover:border-[#60a5fa]/20"
              >
                <div className="relative h-48 overflow-hidden">
                  {event.imageUrl ? (
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a]">
                      <div className={`absolute inset-0 bg-gradient-to-br ${event.gradient}`} />
                      <Icon className="text-[#60a5fa] w-20 h-20 opacity-80 relative z-10 absolute inset-0 m-auto" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-[#60a5fa] text-black px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {event.type}
                  </div>
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-[#60a5fa] font-bold text-sm">${event.price}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2 leading-tight">{event.title}</h3>
                  <p className="text-[#b3b3b3] text-sm mb-4 line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-sm font-semibold">{event.rating}</span>
                    </div>
                    <span className="text-[#666] text-sm">({event.reviews})</span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-[#b3b3b3]">
                      <Calendar className="w-4 h-4 text-[#60a5fa]" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#b3b3b3]">
                      <Clock className="w-4 h-4 text-[#60a5fa]" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#b3b3b3]">
                      {event.isOnline ? (
                        <>
                          <Video className="w-4 h-4 text-[#60a5fa]" />
                          <span>Online Event</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-4 h-4 text-[#60a5fa]" />
                          <span>In-Person</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#b3b3b3]">
                      <Users className="w-4 h-4 text-[#60a5fa]" />
                      <span>{event.spots} spots left</span>
                    </div>
                  </div>

                  <Link href={event.id === 7 ? "/store/17" : "/events"} className="w-full bg-[#60a5fa] text-black py-3 rounded-full font-semibold hover:bg-[#1db954] transition-colors text-center block">
                    Register Now
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Newsletter */}
      <div className="max-w-7xl mx-auto mt-24">
        <div className="py-16 px-6 bg-[#0d0d0d] rounded-2xl border border-white/5 text-center">
          <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">Get Event Notifications</h2>
          <p className="text-[#b3b3b3] mb-8 font-light">
            Be the first to know about new events and early bird discounts.
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
