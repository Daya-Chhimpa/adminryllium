"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "next/navigation";
import { adminGetUserThunk, adminBlockUserThunk, adminUnblockUserThunk } from "@/store/slices/adminSlice";

export default function UserDetailClient({ userId }) {
  const { id: routeId } = useParams();
  const searchParams = useSearchParams();
  const id = userId || routeId || searchParams.get("id");
  const dispatch = useDispatch();
  const status = useSelector((s) => s.admin.status);
  const error = useSelector((s) => s.admin.error);
  const user = useSelector((s) => s.admin.currentUser);

  // 1. Fetch User Data
  useEffect(() => {
    if (id) dispatch(adminGetUserThunk(id));
  }, [dispatch, id]);

  // 2. Button Handlers
  async function handleBlock() {
    if (!confirm("Are you sure you want to block this user?")) return;
    
    // Call API
    const res = await dispatch(adminBlockUserThunk({ userId: id }));
    
    // Refresh Data on Success
    if (res.meta.requestStatus === "fulfilled") {
      dispatch(adminGetUserThunk(id));
    }
  }

  async function handleUnblock() {
    if (!confirm("Are you sure you want to unblock this user?")) return;
    
    // Call API
    const res = await dispatch(adminUnblockUserThunk({ userId: id }));
    
    // Refresh Data on Success
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
                <li><strong>Status:</strong> {user.is_block ? "Blocked" : "Active"}</li>
                <li><strong>Last IP:</strong> {user.lastIp || "-"}</li>
                <li><strong>Last Login:</strong> {user.lastLogin || "-"}</li>
              </ul>
            </div>
            <div>
              <h3 style={{marginBottom:8}}>Block Management</h3>
              
              {!user.is_block ? (
                // SHOW BLOCK BUTTON
                <button 
                  className="rl-btn rl-btn-primary" // Using theme class instead of generic btn-danger
                  style={{backgroundColor: '#dc3545', borderColor: '#dc3545'}}
                  onClick={handleBlock} 
                  disabled={status === "loading"}
                >
                  Block User
                </button>
              ) : (
                // SHOW UNBLOCK BUTTON
                <button 
                  className="rl-btn rl-btn-primary" // Using theme class
                  style={{backgroundColor: '#28a745', borderColor: '#28a745'}}
                  onClick={handleUnblock} 
                  disabled={status === "loading"}
                >
                  Unblock User
                </button>
              )}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}


