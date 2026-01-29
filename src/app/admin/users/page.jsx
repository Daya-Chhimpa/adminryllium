"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { adminListUsersThunk } from "@/store/slices/adminSlice";

export default function UsersPage() {
  const dispatch = useDispatch();
  const { users, usersPagination, status } = useSelector((s) => s.admin);
  
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on search change
    }, 400); // 400ms debounce
    return () => clearTimeout(handler);
  }, [search]);

  // Fetch users when dependencies change
  useEffect(() => {
    const params = new URLSearchParams();
    params.set("page", page);
    params.set("limit", limit);
    if (debouncedSearch) params.set("search", debouncedSearch);
    
    dispatch(adminListUsersThunk(params.toString()));
  }, [dispatch, page, limit, debouncedSearch]);

  return (
    <div className="rl-content">
      <h1 className="rl-page-title">User Management</h1>
      
      <div className="card" style={{padding: 16, marginBottom: 16}}>
        <input 
          className="auth-input" 
          placeholder="Search users..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          style={{maxWidth: 300}}
        />
      </div>

      <div className="card" style={{padding: 0, overflow: 'hidden'}}>
        <table className="rl-table" style={{width: '100%', borderCollapse: 'collapse'}}>
          <thead style={{background: 'var(--rl-bg-secondary)', borderBottom: '1px solid var(--rl-border)'}}>
            <tr>
              <th style={{padding: 12, textAlign: 'left'}}>ID</th>
              <th style={{padding: 12, textAlign: 'left'}}>Name</th>
              <th style={{padding: 12, textAlign: 'left'}}>Email</th>
              <th style={{padding: 12, textAlign: 'left'}}>Status</th>
              <th style={{padding: 12, textAlign: 'left'}}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {status === "loading" && (
              <tr><td colSpan={5} style={{padding: 16, textAlign: 'center'}}>Loading...</td></tr>
            )}
            {status === "succeeded" && users.length === 0 && (
              <tr><td colSpan={5} style={{padding: 16, textAlign: 'center'}}>No users found.</td></tr>
            )}
            {users.map(user => (
              <tr key={user.id} style={{borderBottom: '1px solid var(--rl-border)'}}>
                <td style={{padding: 12}}>{user.id}</td>
                <td style={{padding: 12}}>{user.firstName} {user.lastName}</td>
                <td style={{padding: 12}}>{user.email}</td>
                <td style={{padding: 12}}>
                  {user.is_block && (
                    <span style={{padding:'2px 8px', borderRadius:4, background:'#dc3545', color:'white', fontSize:12, marginRight: 4}}>Blocked</span>
                  )}
                  {user.isBanned && (
                    <span style={{padding:'2px 8px', borderRadius:4, background:'#343a40', color:'white', fontSize:12, marginRight: 4}}>Banned</span>
                  )}
                  {!user.is_block && !user.isBanned && (
                    <span style={{padding:'2px 8px', borderRadius:4, background:'#28a745', color:'white', fontSize:12, marginRight: 4}}>Active</span>
                  )}
                  {user.isEmailConfirmed && <span style={{padding:'2px 8px', borderRadius:4, background:'#17a2b8', color:'white', fontSize:12}}>Verified</span>}
                </td>
                <td style={{padding: 12}}>
                  <Link href={`/admin/users/${user.id}`} className="rl-btn rl-btn-secondary" style={{padding:'4px 12px', fontSize:14}}>
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {usersPagination && (
        <div style={{marginTop: 16, display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center'}}>
          <button 
            className="rl-btn rl-btn-secondary"
            disabled={page <= 1 || status === "loading"}
            onClick={() => setPage(p => p - 1)}
          >
            Previous
          </button>
          <span>Page {usersPagination.page} of {usersPagination.totalPages}</span>
          <button 
            className="rl-btn rl-btn-secondary"
            disabled={page >= usersPagination.totalPages || status === "loading"}
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
