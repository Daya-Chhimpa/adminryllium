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
      // Check for either the specific admin token or a generic authToken
      const adminToken = typeof window !== "undefined" ? window.localStorage.getItem("adminAuthToken") : "";
      const authToken = typeof window !== "undefined" ? window.localStorage.getItem("authToken") : "";
      
      const hasToken = adminToken || authToken;
      const hasCookie = document.cookie.split("; ").some((c) => c.startsWith("admin_auth=1"));

      if (hasToken) {
        if (!hasCookie) {
          // Set the cookie so middleware allows access
          document.cookie = `admin_auth=1; path=/; max-age=${60 * 60 * 24 * 7}`;
        }
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
    try {
      const res = await dispatch(adminLoginThunk(payload));
      if (res.meta.requestStatus === "fulfilled") {
        router.push("/admin");
      }
    } catch (err) {
      console.error("Login exception:", err);
    }
  }

  return (
    <>
      <link rel="stylesheet" href="/custom-style.css" />
      <div className="auth-wrap">
        <div className="auth-side">
          <div className="auth-brand"><span className="logo">PP</span><div className="Tag">PPrince</div></div>
          <div className="auth-title">PPrince Admin</div>
          <p className="auth-sub">Welcome back! Access your admin account.</p>
          <form className="auth-form" onSubmit={handleSubmit}>
            <input name="email" className="auth-input" type="email" placeholder="Email" required />
            <input name="password" className="auth-input" type="password" placeholder="Password" required />
            <button className="auth-btn" type="submit">Continue</button>
          </form>
          {status === "loading" && <p style={{marginTop:8}}>Signing in...</p>}
          {error && <p style={{marginTop:8,color:'#e53e3e'}}>{error}</p>}
          <div className="auth-alt">
            <Link href="/">Forgot password?</Link>
            <Link href="/">Create account</Link>
          </div>
        </div>
        <div className="auth-hero">
          <div className="auth-hero-inner">
            <div className="auth-brand" style={{justifyContent:'center'}}><span className="logo">PP</span><div className="Tag">PPrince</div></div>
            <h2>Trade smarter with PPrince</h2>
            <p>Bank-grade security, lightning-fast execution, and powerful analytics in one modern platform.</p>
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


