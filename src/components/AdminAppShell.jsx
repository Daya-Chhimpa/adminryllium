"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import { FaBars, FaTimes } from "react-icons/fa";

export default function AdminAppShell({ children }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className={`rl-app ${open ? "drawer-open" : ""}`}>
      <AdminSidebar drawerOpen={open} onClose={() => setOpen(false)} />
      <main className="rl-main">
        <div className="rl-mobilebar">
          <div className="rl-brand mini">
            <div className="rl-logo">R</div>
            <span className="rl-brand-text">Ryllium Admin</span>
          </div>
          <button className="rl-hamburger" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((v) => !v)}>
            {open ? <FaTimes /> : <FaBars />}
          </button>
        </div>
        <div className={`rl-drawer-overlay ${open ? "open" : ""}`} onClick={() => setOpen(false)} />
        {children}
      </main>
    </div>
  );
}


