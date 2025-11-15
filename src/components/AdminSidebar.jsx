"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { adminLogout } from "@/store/slices/adminSlice";
import { FaTachometerAlt, FaUsers, FaSignOutAlt } from "react-icons/fa";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: FaTachometerAlt },
  { href: "/users", label: "Users", icon: FaUsers },
];

export default function AdminSidebar({ drawerOpen = false, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(adminLogout());
    router.push("/signin");
  }

  return (
    <aside className={`rl-sidebar ${drawerOpen ? "open" : ""}`}>
      <div className="rl-brand">
        <div className="rl-logo">F</div>
        <span className="rl-brand-text">Fortario Administration</span>
      </div>
      <nav className="rl-nav">
        {NAV.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`rl-nav-item ${isActive ? "active" : ""}`}
              onClick={onClose}
            >
              <span className="rl-nav-icon" aria-hidden>
                <Icon />
              </span>
              <span className="rl-nav-label">{label}</span>
            </Link>
          );
        })}
      </nav>
      <nav className="rl-nav rl-nav-bottom">
        <button className="rl-nav-item" onClick={() => { onClose?.(); handleLogout(); }}>
          <span className="rl-nav-icon" aria-hidden>
            <FaSignOutAlt />
          </span>
          <span className="rl-nav-label">Log Out</span>
        </button>
      </nav>
    </aside>
  );
}


