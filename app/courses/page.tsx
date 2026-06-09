import { Suspense } from "react";
import CoursesContent from "./CoursesContent";

export default function CoursesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">Loading...</div>}>
      <CoursesContent />
    </Suspense>
  );
}
