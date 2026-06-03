"use client";

import { useEffect, useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useUser } from "../contexts/UserContext";
import { useToast } from "../contexts/ToastContext";

export function useNotifications() {
  const { cart, cartTimestamp, mounted } = useCart();
  const { enrolledCourses } = useUser();
  const { showToast } = useToast();
  const [hasShownNotifications, setHasShownNotifications] = useState(false);

  useEffect(() => {
    if (!mounted || hasShownNotifications) return;

    // Check for abandoned cart (items in cart for more than 24 hours)
    const checkAbandonedCart = () => {
      if (cart.length > 0 && cartTimestamp) {
        const hoursSinceLastUpdate = (Date.now() - cartTimestamp) / (1000 * 60 * 60);
        if (hoursSinceLastUpdate > 24) {
          showToast(
            `You have ${cart.length} item${cart.length > 1 ? 's' : ''} in your cart. Complete your purchase before prices change!`,
            "warning"
          );
        }
      }
    };

    // Check for incomplete courses
    const checkIncompleteCourses = () => {
      if (enrolledCourses.length > 0) {
        showToast(
          `You have ${enrolledCourses.length} enrolled course${enrolledCourses.length > 1 ? 's' : ''}. Continue your learning journey!`,
          "info"
        );
      }
    };

    // Run checks with a delay to avoid showing notifications immediately on page load
    const timeoutId = setTimeout(() => {
      checkAbandonedCart();
      checkIncompleteCourses();
      setHasShownNotifications(true);
    }, 3000); // 3 seconds delay

    return () => clearTimeout(timeoutId);
  }, [cart, cartTimestamp, enrolledCourses, mounted, showToast, hasShownNotifications]);
}
