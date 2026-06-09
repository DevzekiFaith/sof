import { Suspense } from "react";
import TracksContent from "./TracksContent";

export default function TracksPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">Loading...</div>}>
      <TracksContent />
    </Suspense>
  );
}
