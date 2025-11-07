"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminLoginThunk } from "@/store/slices/adminSlice";

function AdminSignInContent() {
  const router = useRouter();
  const dispatch = useDispatch();
  const status = useSelector((s) => s.admin.status);
  const error = useSelector((s) => s.admin.error);

  useEffect(() => {
    try {
      const hasCookie = document.cookie.split("; ").some((c) => c.startsWith("admin_auth=1"));
      const token = typeof window !== "undefined" ? window.localStorage.getItem("adminAuthToken") : "";
      if (hasCookie && token) {
        const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
        const next = params.get("next");
        router.replace(next || "/admin");
      }
    } catch {}
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      email: form.get("email"),
      password: form.get("password"),
    };
    const res = await dispatch(adminLoginThunk(payload));
    if (res.meta.requestStatus === "fulfilled") {
      router.push("/admin");
    }
  }

  return (
    <>
      <link rel="stylesheet" href="/custom-style.css" />
      <div className="auth-wrap">
        <div className="auth-side">
          <div className="auth-brand"><span className="logo">R</span><div className="Tag">Ryllium</div></div>
          <div className="auth-title">Admin Sign in</div>
          <p className="auth-sub">Admin access for platform management.</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <input name="email" className="auth-input" type="email" placeholder="Email" required />
            <input name="password" className="auth-input" type="password" placeholder="Password" required />
            <button className="auth-btn" type="submit">Continue</button>
          </form>
          {status === "loading" && <p style={{marginTop:8}}>Signing in...</p>}
          {error && <p style={{marginTop:8,color:'red'}}>{error}</p>}
          <div className="auth-alt">
            <Link href="/">Back to site</Link>
          </div>
        </div>
        <div className="auth-hero">
          <div className="auth-hero-inner">
            <div className="auth-brand" style={{justifyContent:'center'}}><span className="logo">R</span><div className="Tag">Ryllium</div></div>
            <h2>Admin Console</h2>
            <p>Monitor stats, manage users, and ensure smooth operations.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AdminSignInPage() {
  return (
    <Suspense fallback={<div className="auth-wrap"><div className="auth-side"><div className="auth-title">Admin Sign in</div><p>Loading...</p></div></div>}>
      <AdminSignInContent />
    </Suspense>
  );
}


