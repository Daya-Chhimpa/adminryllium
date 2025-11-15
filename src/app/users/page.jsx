"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminListUsersThunk } from "@/store/slices/adminSlice";
import Link from "next/link";

export default function UsersPage() {
  const dispatch = useDispatch();
  const status = useSelector((s) => s.admin.status);
  const error = useSelector((s) => s.admin.error);
  const users = useSelector((s) => s.admin.users);
  const pagination = useSelector((s) => s.admin.usersPagination);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (search) params.set("search", search);
    dispatch(adminListUsersThunk(params.toString()));
  }, [dispatch, page, limit, search]);

  const canPrev = useMemo(() => {
    if (pagination?.page != null) return pagination.page > 1;
    return page > 1;
  }, [pagination, page]);

  const canNext = useMemo(() => {
    if (pagination?.totalPages != null && pagination?.page != null) return pagination.page < pagination.totalPages;
    return (users?.length || 0) === limit;
  }, [pagination, users, limit]);

  return (
    <div className="rl-content">
      <h1 className="rl-page-title">Users Management</h1>
      <section className="card" style={{padding:16}}>
        <div style={{display:'flex',gap:12,alignItems:'center',justifyContent:'space-between',marginBottom:12,flexWrap:'wrap'}}>
          <div style={{display:'flex',gap:8,alignItems:'center'}}>
            <input className="auth-input" placeholder="Search users" value={searchInput} onChange={(e)=>setSearchInput(e.target.value)} />
            <select className="auth-input" value={limit} onChange={(e)=>{ setLimit(Number(e.target.value)||10); setPage(1); }}>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
          <div style={{fontSize:12,color:'#718096'}}>
            Page {pagination?.page ?? page}{pagination?.totalPages ? ` of ${pagination.totalPages}` : ""}
          </div>
        </div>

        {status === "loading" && <p>Loading users...</p>}
        {error && <p style={{color:'#e53e3e'}}>{error}</p>}
        <div style={{overflowX:'auto'}}>
          <table className="rl-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Email Confirmed</th>
                <th>Banned</th>
                <th>Registered</th>
              </tr>
            </thead>
            <tbody>
              {users?.map?.((u) => {
                const emailBadgeStyle = {
                  display:'inline-block',padding:'2px 8px',borderRadius:12,fontSize:12,
                  backgroundColor: u.isEmailConfirmed ? '#16a34a' : '#eab308', color: '#ffffff'
                };
                const banBadgeStyle = {
                  display:'inline-block',padding:'2px 8px',borderRadius:12,fontSize:12,
                  backgroundColor: u.isBanned ? '#dc2626' : '#16a34a', color: '#ffffff'
                };
                return (
                  <tr key={u.id}>
                    <td><Link href={{ pathname: "/users/view", query: { id: u.id } }}>{u.id}</Link></td>
                    <td>{u.firstName || '-'}</td>
                    <td>{u.lastName || '-'}</td>
                    <td>{u.email}</td>
                    <td><span style={emailBadgeStyle}>{u.isEmailConfirmed ? 'Confirmed' : 'Unconfirmed'}</span></td>
                    <td><span style={banBadgeStyle}>{u.isBanned ? 'Banned' : 'Active'}</span></td>
                    <td>{u.createdAt || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginTop:12,flexWrap:'wrap',gap:8}}>
          <div style={{fontSize:12,color:'#718096'}}>
            Showing {users?.length || 0} items
          </div>
          <div style={{display:'flex',gap:8}}>
            <button className="rl-btn rl-btn-outline" disabled={!canPrev || status === 'loading'} onClick={()=> setPage((p)=> Math.max(1, p-1))}>Prev</button>
            <button className="rl-btn rl-btn-outline" disabled={!canNext || status === 'loading'} onClick={()=> setPage((p)=> p+1)}>Next</button>
          </div>
        </div>
      </section>
    </div>
  );
}


