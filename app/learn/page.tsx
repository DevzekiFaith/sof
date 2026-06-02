"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../contexts/UserContext";

export default function LearnPage() {
  const router = useRouter();
  const { currentUser, enrolledCourses } = useUser();

  useEffect(() => {
    if (!currentUser) {
      router.push("/checkout?plan=free");
      return;
    }

    // If user has enrolled courses, redirect to the first one
    if (enrolledCourses.length > 0) {
      router.push(`/learn/${enrolledCourses[0]}`);
    } else {
      // If no enrolled courses, redirect to courses page
      router.push("/courses");
    }
  }, [currentUser, enrolledCourses, router]);

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-[#1ed760] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[#b3b3b3]">Loading...</p>
      </div>
    </div>
  );
}
