"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminGeneralStatsThunk } from "@/store/slices/adminSlice";

export default function AdminDashboardPage() {
  const dispatch = useDispatch();
  const status = useSelector((s) => s.admin.status);
  const error = useSelector((s) => s.admin.error);
  const stats = useSelector((s) => s.admin.generalStats);

  useEffect(() => {
    dispatch(adminGeneralStatsThunk());
  }, [dispatch]);

  return (
    <div className="rl-content">
      <h1 className="rl-page-title">Admin Dashboard</h1>
      {error && <p style={{color:'#e53e3e'}}>{error}</p>}
      <div className="card" style={{padding:16}}>
        <h2 style={{marginBottom:16}}>General Stats</h2>
        {status === "loading" && <p>Loading stats...</p>}
        {stats && (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16}}>
            <div className="card" style={{padding:16}}>
              <div style={{fontSize:12,color:'#718096'}}>Total Users</div>
              <div style={{fontSize:28,fontWeight:700}}>{stats.totalUsers}</div>
            </div>
            <div className="card" style={{padding:16}}>
              <div style={{fontSize:12,color:'#718096'}}>Registered Last 24h</div>
              <div style={{fontSize:28,fontWeight:700}}>{stats.usersRegisteredLast24Hours}</div>
            </div>
            <div className="card" style={{padding:16}}>
              <div style={{fontSize:12,color:'#718096'}}>Active Users</div>
              <div style={{fontSize:28,fontWeight:700}}>{stats.activeUsers}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


