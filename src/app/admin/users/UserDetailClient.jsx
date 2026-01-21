"use client";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "next/navigation";
import { adminGetUserThunk, adminBlockUserThunk, adminUnblockUserThunk, adminLockUserThunk } from "@/store/slices/adminSlice";

export default function UserDetailClient({ userId }) {
  const { id: routeId } = useParams();
  const searchParams = useSearchParams();
  const id = userId || routeId || searchParams.get("id");
  const dispatch = useDispatch();
  const status = useSelector((s) => s.admin.status);
  const error = useSelector((s) => s.admin.error);
  const user = useSelector((s) => s.admin.currentUser);

  const [isLocked, setIsLocked] = useState(false);
  const [lockDuration, setLockDuration] = useState(0);

  useEffect(() => {
    if (id) dispatch(adminGetUserThunk(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (user && String(user.id) === String(id)) {
      const lockedUntilTime = user?.lockedUntil ? new Date(user.lockedUntil).getTime() : 0;
      const isLockedNow = Boolean(user.isLocked) || (lockedUntilTime > Date.now());
      setIsLocked(isLockedNow);
    }
  }, [user, id]);

  async function handleBlock() {
    if (!confirm("Are you sure you want to block this user?")) return;
    const res = await dispatch(adminBlockUserThunk({ userId: id }));
    if (res.meta.requestStatus === "fulfilled") {
      dispatch(adminGetUserThunk(id));
    }
  }

  async function handleUnblock() {
    if (!confirm("Are you sure you want to unblock this user?")) return;
    const res = await dispatch(adminUnblockUserThunk({ userId: id }));
    if (res.meta.requestStatus === "fulfilled") {
      dispatch(adminGetUserThunk(id));
    }
  }

  async function applyLock(e) {
    e.preventDefault();
    const res = await dispatch(adminLockUserThunk({ userId: id, isLocked, lockDuration: Number(lockDuration) || 0 }));
    if (res.meta.requestStatus === "fulfilled") {
      dispatch(adminGetUserThunk(id));
    }
  }

  return (
    <div className="rl-content">
      <h1 className="rl-page-title">User {id}</h1>
      <section className="card" style={{padding:16}}>
        {status === "loading" && <p>Loading...</p>}
        {error && <p style={{color:'red'}}>{error}</p>}
        {user && (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
            <div>
              <h3 style={{marginBottom:8}}>Profile</h3>
              <ul>
                <li><strong>ID:</strong> {user.id}</li>
                <li><strong>Name:</strong> {[user.firstName, user.lastName].filter(Boolean).join(" ") || "-"}</li>
                <li><strong>Email:</strong> {user.email}</li>
                <li><strong>Phone:</strong> {user.phone || "-"}</li>
                <li><strong>Created:</strong> {user.createdAt}</li>
                <li><strong>Email Confirmed:</strong> {String(user.isEmailConfirmed)}</li>
                <li><strong>2FA:</strong> {String(user.is2FaEnabled)}</li>
                <li><strong>Banned:</strong> {String(user.isBanned)}</li>
                <li><strong>Last IP:</strong> {user.lastIp || "-"}</li>
                <li><strong>Last Login:</strong> {user.lastLogin || "-"}</li>
                <li><strong>Locked Until:</strong> {user.lockedUntil || "-"}</li>
              </ul>
            </div>
            <div>
              <h3 style={{marginBottom:8}}>Actions</h3>
              
              <div style={{marginBottom: 24}}>
                 <h4 style={{marginBottom:8, fontSize:'14px', color:'#555'}}>Block / Unblock</h4>
                 <div style={{display:'flex', gap:10}}>
                   {!user.is_block
 ? (
                     <button className="rl-btn rl-btn-danger" onClick={handleBlock} disabled={status === "loading"}>
                       Block User
                     </button>
                   ) : (
                     <button className="rl-btn rl-btn-success" onClick={handleUnblock} disabled={status === "loading"}>
                       Unblock User
                     </button>
                   )}
                 </div>
              </div>

              {/* <h3 style={{marginBottom:8}}>Lock/Unlock</h3>
              <form onSubmit={applyLock}>
                <label style={{display:'block',marginBottom:8}}>
                  <input type="checkbox" checked={isLocked} onChange={(e)=>setIsLocked(e.target.checked)} /> Locked
                </label>
                {isLocked && (
                  <input className="auth-input" type="number" min={0} placeholder="Lock duration (minutes)" value={lockDuration} onChange={(e)=>setLockDuration(e.target.value)} />
                )}
                <button className="rl-btn rl-btn-primary" type="submit" disabled={status === "loading"} style={{marginTop:8}}>Apply</button>
              </form> */}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}


