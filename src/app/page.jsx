"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    try {
      const token = typeof window !== "undefined" ? window.localStorage.getItem("adminAuthToken") : "";
      if (token) {
        document.cookie = `admin_auth=1; path=/; max-age=${60 * 60 * 24 * 7}`;
        router.replace("/admin");
      } else {
        router.replace("/signin");
      }
    } catch {
      router.replace("/signin");
    }
  }, [router]);
  return null;
}



