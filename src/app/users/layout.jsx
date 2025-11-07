"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AdminAppShell from "@/components/AdminAppShell";

export default function UsersLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    try {
      const hasCookie = document.cookie.split("; ").some((c) => c.startsWith("admin_auth=1"));
      const hasToken = typeof window !== "undefined" && !!window.localStorage.getItem("adminAuthToken");
      if (!hasCookie && !hasToken) {
        const next = typeof window !== "undefined" ? window.location.pathname + window.location.search : "/users";
        router.replace(`/signin?next=${encodeURIComponent(next)}`);
      }
    } catch {}
  }, [router]);

  return (
    <AdminAppShell>
      {children}
    </AdminAppShell>
  );
}


