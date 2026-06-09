"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (!supabase) {
        router.push("/?error=supabase_not_configured");
        return;
      }

      const { data, error } = await supabase.auth.getSession();

      if (error) {
        router.push("/?error=auth_failed");
        return;
      }

      if (data.session) {
        router.push("/?auth=success");
      } else {
        router.push("/?auth=no_session");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212]">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#1ed760] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white">Signing you in...</p>
      </div>
    </div>
  );
}
