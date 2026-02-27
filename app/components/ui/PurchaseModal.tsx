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
        <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-gray-200 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {mode === "course" ? "Buy this course" : "Get School Pass (Quarterly)"}
              </h2>
              <p className="text-gray-600 mt-2">
                {mode === "course"
                  ? `Unlock the full structured experience for “${courseTitle}”.`
                  : "Unlock all courses + all module detail pages for 90 days."}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-5">
            {!currentUser ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <p className="text-yellow-900 font-semibold">Please sign in first.</p>
                <p className="text-yellow-800 text-sm mt-1">
                  Purchases are tied to your account (stored locally on this device).
                </p>
              </div>
            ) : alreadyHasAccess ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-amber-900 font-semibold">You already have access.</p>
                <p className="text-amber-800 text-sm mt-1">
                  {pass.isActive
                    ? `Your School Pass is active until ${new Date(pass.expiresAt!).toLocaleDateString()}.`
                    : "This course is already owned by your account."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">
                      {mode === "course" ? courseTitle : "School Pass (Quarterly)"}
                    </span>
                    <span className="font-bold text-gray-900">
                      ${mode === "course" ? coursePriceUSD.toFixed(2) : quarterlyPriceUSD.toFixed(2)}
                    </span>
                  </div>
                  <ul className="text-sm text-gray-700 mt-3 space-y-1">
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

