"use client";

import AdminAppShell from "@/components/AdminAppShell";

export default function AdminLayout({ children }) {
  return (
    <AdminAppShell>
      {children}
    </AdminAppShell>
  );
}


