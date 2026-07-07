"use client";

import { useMemo } from "react";
import Button from "./Button";
import AnimatedSection from "./AnimatedSection";
import { useUser } from "../../contexts/UserContext";

type PurchaseMode = "course" | "quarterly";

export default function PurchaseModal({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  coursePriceUSD,
  quarterlyPriceUSD,
  mode,
}: {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseTitle: string;
  coursePriceUSD: number;
  quarterlyPriceUSD: number;
  mode: PurchaseMode;
}) {
  const { currentUser, purchaseCourse, purchaseQuarterlyPass, hasCourseAccess, getQuarterlyPass } = useUser();

  const pass = getQuarterlyPass();
  const alreadyHasAccess = useMemo(() => hasCourseAccess(courseId), [hasCourseAccess, courseId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <AnimatedSection>
        <div className="bg-[#181818] rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#282828]">
          <div className="p-6 sm:p-8 border-b border-[#282828] flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                {mode === "course" ? "Buy this course" : "Get School Pass (Quarterly)"}
              </h2>
              <p className="text-[#b3b3b3] mt-2">
                {mode === "course"
                  ? `Unlock the full structured experience for “${courseTitle}”.`
                  : "Unlock all courses + all module detail pages for 90 days."}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-[#b3b3b3] hover:text-white text-2xl leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-5">
            {!currentUser ? (
              <div className="p-4 bg-[#60a5fa]/10 border border-[#60a5fa]/20 rounded-xl">
                <p className="text-[#60a5fa] font-semibold">Please sign in first.</p>
                <p className="text-[#b3b3b3] text-sm mt-1">
                  Purchases are tied to your account (stored locally on this device).
                </p>
              </div>
            ) : alreadyHasAccess ? (
              <div className="p-4 bg-[#60a5fa]/10 border border-[#60a5fa]/20 rounded-xl">
                <p className="text-[#60a5fa] font-semibold">You already have access.</p>
                <p className="text-[#b3b3b3] text-sm mt-1">
                  {pass.isActive
                    ? `Your School Pass is active until ${new Date(pass.expiresAt!).toLocaleDateString()}.`
                    : "This course is already owned by your account."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 bg-[#121212] border border-[#282828] rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">
                      {mode === "course" ? courseTitle : "School Pass (Quarterly)"}
                    </span>
                    <span className="font-bold text-[#60a5fa]">
                      ${mode === "course" ? coursePriceUSD.toFixed(2) : quarterlyPriceUSD.toFixed(2)}
                    </span>
                  </div>
                  <ul className="text-sm text-[#b3b3b3] mt-3 space-y-1">
                    <li>- Module detail pages (notes + activities + resources)</li>
                    <li>- Structured learning path</li>
                    <li>- Future: certificates (optional)</li>
                  </ul>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => {
                  if (!currentUser) return;
                  if (alreadyHasAccess) {
                    onClose();
                    return;
                  }
                  if (mode === "course") purchaseCourse(courseId);
                  if (mode === "quarterly") purchaseQuarterlyPass();
                  onClose();
                }}
              >
                {mode === "course" ? "Confirm purchase" : "Activate quarterly pass"}
              </Button>
              <Button variant="secondary" size="md" className="w-full" onClick={onClose}>
                Cancel
              </Button>
            </div>

            <p className="text-xs text-gray-500">
              Note: This is a simple local checkout (no payment gateway yet). It’s ideal for testing the product flow.
            </p>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}

