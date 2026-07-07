"use client";

import { Gift, Crown, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../../contexts/CartContext";
import { courses } from "../../data/courses";

export default function MonetizationOptions() {
  const { addGiftToCart } = useCart();
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [giftMessage, setGiftMessage] = useState("");

  const handleGiftClick = (course: any) => {
    setSelectedCourse(course);
    setShowGiftModal(true);
  };

  const handleAddToCart = () => {
    if (selectedCourse && recipientEmail) {
      addGiftToCart(selectedCourse, recipientEmail, recipientName, giftMessage);
      setShowGiftModal(false);
      setRecipientEmail("");
      setRecipientName("");
      setGiftMessage("");
      setSelectedCourse(null);
    }
  };

  return (
    <div className="bg-[#181818] p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Crown className="w-5 h-5 text-[#60a5fa]" />
          Gift Courses
        </h3>
      </div>

      <div className="space-y-4">
        <div className="p-6 bg-[#282828] rounded-lg text-center">
          <Gift className="w-12 h-12 text-[#60a5fa] mx-auto mb-3" />
          <h4 className="text-lg font-bold text-white mb-2">Gift a Course</h4>
          <p className="text-sm text-[#b3b3b3] mb-4">Give the gift of learning to someone special</p>
          <button className="px-6 py-2 bg-[#60a5fa] text-black font-bold rounded-full hover:scale-105 transition-transform">
            Send as Gift
          </button>
        </div>

        <div className="space-y-3">
          {courses.slice(0, 3).map((course) => (
            <div
              key={course.id}
              className="p-4 bg-[#282828] rounded-lg flex items-center justify-between hover:bg-[#333] transition-colors cursor-pointer"
            >
              <div>
                <h4 className="text-sm font-bold text-white mb-1">{course.title}</h4>
                <p className="text-xs text-[#b3b3b3]">Perfect for gifting</p>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-sm font-bold text-[#60a5fa]">${course.priceUSD}</p>
                <button 
                  onClick={() => handleGiftClick(course)}
                  className="p-2 rounded-full bg-[#60a5fa]/20 text-[#60a5fa] hover:bg-[#60a5fa] hover:text-black transition-colors"
                >
                  <Gift className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gift Modal */}
      {showGiftModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#181818] rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-white">Gift {selectedCourse?.title}</h4>
              <button
                onClick={() => setShowGiftModal(false)}
                className="p-2 hover:bg-[#282828] rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Recipient Email *
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="recipient@example.com"
                  className="w-full px-4 py-2 bg-[#282828] text-white rounded-lg border border-[#333] focus:border-[#60a5fa] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Recipient Name
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2 bg-[#282828] text-white rounded-lg border border-[#333] focus:border-[#60a5fa] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Gift Message
                </label>
                <textarea
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  placeholder="Add a personal message..."
                  rows={3}
                  className="w-full px-4 py-2 bg-[#282828] text-white rounded-lg border border-[#333] focus:border-[#60a5fa] focus:outline-none resize-none"
                />
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-[#282828]">
                <p className="text-lg font-bold text-[#60a5fa]">${selectedCourse?.priceUSD}</p>
                <button
                  onClick={handleAddToCart}
                  disabled={!recipientEmail}
                  className="px-6 py-2 bg-[#60a5fa] text-black font-bold rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
