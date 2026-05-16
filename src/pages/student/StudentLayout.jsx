// src/pages/student/StudentLayout.jsx
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Toast, Avatar } from "../../components/ui";
import {
  FaHome,
  FaWallet,
  FaGift,
  FaTrophy,
  FaEdit,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaBell,
} from "react-icons/fa";

const TABS = [
  { id: "home", label: "Home", icon: FaHome, path: "/student/home" },
  { id: "wallet", label: "Wallet", icon: FaWallet, path: "/student/wallet" },
  { id: "rewards", label: "Rewards", icon: FaGift, path: "/student/rewards" },
  {
    id: "leaderboard",
    label: "Leaderboard",
    icon: FaTrophy,
    path: "/student/leaderboard",
  },
  { id: "tests", label: "Tests", icon: FaEdit, path: "/student/tests" },
];

export default function StudentLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout, unreadCount } = useApp();
  const [sidebarCompact, setSidebarCompact] = useState(() => {
    return localStorage.getItem("coined_student_sidebar_compact") === "true";
  });
  const active = TABS.find((t) => location.pathname.startsWith(t.path))?.id;

  useEffect(() => {
    localStorage.setItem(
      "coined_student_sidebar_compact",
      String(sidebarCompact),
    );
  }, [sidebarCompact]);

  return (
    <>
      <Toast />

      {/* ── MOBILE (< md) — full screen ───────────────── */}
      <div className="md:hidden flex flex-col bg-slate-50 dark:bg-slate-900 min-h-screen">
        <div
          className="flex-1 overflow-x-hidden overflow-y-auto"
          style={{ scrollbarWidth: "none" }}
        >
          <Outlet />
        </div>
        <nav className="bottom-0 z-50 sticky flex bg-white dark:bg-slate-800 pb-safe border-slate-100 dark:border-slate-700 border-t">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => navigate(t.path)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-extrabold transition-colors border-none bg-transparent cursor-pointer
                ${active === t.id ? "text-brand-500" : "text-slate-400 dark:text-slate-500"}`}
            >
              <t.icon className="text-xl leading-tight" />
              {t.label}
              {active === t.id && (
                <div className="bg-brand-500 mt-0.5 rounded-full w-1 h-1" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* ── DESKTOP (≥ md) — full dashboard layout ────── */}
      <div className="hidden md:flex bg-gradient-to-br from-slate-100 dark:from-slate-900 to-brand-50 dark:to-slate-800 min-h-screen">
        {/* Sidebar */}
        <aside
          className={`flex flex-col flex-shrink-0 bg-white dark:bg-slate-800 shadow-sm border-slate-100 dark:border-slate-700 border-r transition-[width] duration-300 ${
            sidebarCompact ? "w-20" : "w-64"
          }`}
        >
          {/* Logo */}
          <div
            className={`relative border-slate-100 dark:border-slate-700 border-b transition-all duration-300 ${
              sidebarCompact ? "px-3 py-4" : "px-4 py-5"
            }`}
          >
            <div
              className={`relative flex justify-center items-center bg-slate-50/90 dark:bg-gradient-to-br dark:from-slate-50/95 dark:via-emerald-50/90 dark:to-slate-100/90 shadow-sm dark:shadow-[0_18px_36px_-24px_rgba(0,0,0,0.65)] backdrop-blur-sm border border-slate-200/70 dark:border-emerald-200/20 rounded-2xl w-full overflow-hidden transition-all duration-300 ${
                sidebarCompact ? "h-12 px-2 py-2" : "h-32 px-3 py-3"
              }`}
            >
              <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.82),inset_0_-16px_30px_rgba(15,23,42,0.035)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.88),inset_0_0_0_1px_rgba(34,197,94,0.08)] pointer-events-none" />
              <img
                src={sidebarCompact ? "/icon.png" : "/logo.png"}
                alt="Nurcode Academy logo"
                className={`z-10 relative h-auto object-contain drop-shadow-sm dark:brightness-95 dark:contrast-125 dark:saturate-110 dark:drop-shadow-[0_8px_18px_rgba(15,23,42,0.18)] transition-all duration-300 ${
                  sidebarCompact ? "w-9" : "w-full max-w-[192px]"
                }`}
              />
            </div>
            <button
              type="button"
              onClick={() => setSidebarCompact((value) => !value)}
              className="top-3 right-2 absolute flex justify-center items-center bg-white hover:bg-slate-50 dark:bg-slate-700 dark:hover:bg-slate-600 shadow-sm border border-slate-200 dark:border-slate-600 rounded-full w-7 h-7 text-slate-500 dark:text-slate-200 transition-colors cursor-pointer"
              aria-label={sidebarCompact ? "Expand sidebar" : "Collapse sidebar"}
              title={sidebarCompact ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCompact ? (
                <FaChevronRight className="text-[10px]" />
              ) : (
                <FaChevronLeft className="text-[10px]" />
              )}
            </button>
          </div>

          {/* Nav links */}
          <nav className={`flex-1 space-y-1 ${sidebarCompact ? "p-3" : "p-4"}`}>
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => navigate(t.path)}
                title={sidebarCompact ? t.label : undefined}
                className={`w-full flex items-center rounded-2xl text-sm font-extrabold transition-all border-none cursor-pointer
                  ${
                    active === t.id
                      ? "bg-brand-500 text-white"
                      : "text-slate-500 dark:text-slate-400 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white"
                  } ${sidebarCompact ? "justify-center px-0 py-3" : "gap-3 px-4 py-3 text-left"}`}
              >
                <t.icon className="text-lg" />
                <span className={sidebarCompact ? "sr-only" : ""}>
                  {t.label}
                </span>
              </button>
            ))}
          </nav>

          {/* User info + logout */}
          <div
            className={`flex-shrink-0 pt-4 pb-4 border-slate-100 dark:border-slate-700 border-t ${
              sidebarCompact ? "px-3" : "px-3"
            }`}
          >
            <div
              onClick={() => navigate("/student/profile")}
              className="bg-brand-50 hover:bg-brand-100 dark:bg-brand-900/30 dark:hover:bg-brand-900/45 mb-3 p-3 rounded-2xl transition-colors cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  navigate("/student/profile");
                }
              }}
            >
              <div
                className={`flex items-center ${
                  sidebarCompact ? "justify-center" : "gap-3"
                }`}
              >
                <Avatar user={currentUser} size={36} />
                <div className={`flex-1 min-w-0 ${sidebarCompact ? "hidden" : ""}`}>
                  <p className="font-bold text-slate-700 dark:text-slate-200 text-xs truncate">
                    {currentUser?.name || "Student"}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                    {currentUser?.email}
                  </p>
                </div>
                {!sidebarCompact && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/notifications");
                    }}
                    className="relative flex flex-shrink-0 justify-center items-center bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800 shadow-sm border border-brand-100/80 dark:border-brand-400/20 rounded-xl w-9 h-9 text-slate-500 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-300 transition-colors cursor-pointer"
                    aria-label="Notifications"
                    title="Notifications"
                  >
                    <FaBell className="text-sm" />
                    {unreadCount > 0 && (
                      <span className="-top-1 -right-1 absolute bg-red-500 px-1.5 py-0.5 rounded-full min-w-[18px] font-bold text-[10px] text-white text-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>
                )}
              </div>
              {sidebarCompact && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/notifications");
                  }}
                  className="relative flex justify-center items-center bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800 shadow-sm mt-3 border border-brand-100/80 dark:border-brand-400/20 rounded-xl w-full h-9 text-slate-500 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-300 transition-colors cursor-pointer"
                  aria-label="Notifications"
                  title="Notifications"
                >
                  <FaBell className="text-sm" />
                  {unreadCount > 0 && (
                    <span className="-top-1 -right-1 absolute bg-red-500 px-1.5 py-0.5 rounded-full min-w-[18px] font-bold text-[10px] text-white text-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
              )}
            </div>
            <button
              onClick={logout}
              title={sidebarCompact ? "Sign out" : undefined}
              className={`flex justify-center items-center bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 py-2.5 border-none rounded-xl w-full font-bold text-red-400 hover:text-red-600 dark:hover:text-red-300 dark:text-red-400 text-xs transition-colors cursor-pointer ${
                sidebarCompact ? "gap-0" : "gap-2"
              }`}
            >
              <FaSignOutAlt />
              <span className={sidebarCompact ? "sr-only" : ""}>Sign out</span>
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto p-8 max-w-4xl">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}
