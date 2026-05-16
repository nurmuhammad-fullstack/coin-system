// src/pages/teacher/TeacherLayout.jsx
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Toast, Avatar } from "../../components/ui";
import {
  FaUsers,
  FaClipboardList,
  FaStore,
  FaSignOutAlt,
  FaSchool,
  FaChartLine,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
  FaBell,
} from "react-icons/fa";

const TABS = [
  {
    id: "students",
    label: "Students",
    icon: FaUsers,
    path: "/teacher/students",
  },
  { id: "classes", label: "Classes", icon: FaSchool, path: "/teacher/classes" },
  {
    id: "schedule",
    label: "Schedule",
    icon: FaClock,
    path: "/teacher/schedule",
  },
  {
    id: "quizzes",
    label: "Quizzes",
    icon: FaClipboardList,
    path: "/teacher/quizzes",
  },
  { id: "shop", label: "Shop", icon: FaStore, path: "/teacher/shop" },
  {
    id: "analytics",
    label: "Analytics",
    icon: FaChartLine,
    path: "/teacher/analytics",
  },
];

export default function TeacherLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout, unreadCount } = useApp();
  const [sidebarCompact, setSidebarCompact] = useState(() => {
    return localStorage.getItem("coined_teacher_sidebar_compact") === "true";
  });
  const active = TABS.find((t) => location.pathname.startsWith(t.path))?.id;

  useEffect(() => {
    localStorage.setItem(
      "coined_teacher_sidebar_compact",
      String(sidebarCompact),
    );
  }, [sidebarCompact]);

  return (
    <>
      <Toast />

      {/* MOBILE - Full screen */}
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
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-extrabold border-none bg-transparent cursor-pointer transition-colors
                ${active === t.id ? "text-indigo-500" : "text-slate-400 dark:text-slate-500"}`}
            >
              <t.icon className="text-xl leading-tight" />
              {t.label}
              {active === t.id && (
                <div className="bg-indigo-500 rounded-full w-1 h-1" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:flex bg-gradient-to-br from-slate-50 dark:from-slate-900 dark:via-slate-900 to-indigo-50 dark:to-slate-900 min-h-screen">
        {/* Sidebar */}
        <aside
          className={`top-0 sticky flex flex-col flex-shrink-0 bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 border-r h-screen transition-[width] duration-300 ${
            sidebarCompact ? "w-20" : "w-56 lg:w-64"
          }`}
        >
          {/* Logo */}
          <div
            className={`relative flex-shrink-0 border-slate-100 dark:border-slate-700 border-b transition-all duration-300 ${
              sidebarCompact ? "px-3 py-4" : "px-4 py-5"
            }`}
          >
            <div
              className={`relative flex justify-center items-center bg-slate-50/90 dark:bg-gradient-to-br dark:from-slate-50/95 dark:via-indigo-50/90 dark:to-slate-100/90 shadow-sm dark:shadow-[0_18px_36px_-24px_rgba(0,0,0,0.65)] backdrop-blur-sm border border-slate-200/70 dark:border-indigo-200/20 rounded-2xl w-full overflow-hidden transition-all duration-300 ${
                sidebarCompact ? "h-12 px-2 py-2" : "h-32 px-3 py-3"
              }`}
            >
              <div className="absolute inset-0 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.82),inset_0_-16px_30px_rgba(15,23,42,0.035)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.88),inset_0_0_0_1px_rgba(99,102,241,0.08)] pointer-events-none" />
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

          {/* Nav items */}
          <nav
            className={`flex-1 space-y-1 py-4 overflow-y-auto ${
              sidebarCompact ? "px-3" : "px-3"
            }`}
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => navigate(t.path)}
                title={sidebarCompact ? t.label : undefined}
                className={`w-full flex items-center rounded-2xl text-sm font-extrabold border-none cursor-pointer transition-all
                  ${
                    active === t.id
                      ? "bg-indigo-500 text-white"
                      : "bg-transparent text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-white"
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
          <div className="flex-shrink-0 px-3 pt-4 pb-4 border-slate-100 dark:border-slate-700 border-t">
            <div
              onClick={() => navigate("/teacher/profile")}
              className="bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-700 dark:hover:bg-slate-600 mb-3 p-3 rounded-2xl transition-colors cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  navigate("/teacher/profile");
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
                  <p className="font-bold text-slate-700 dark:text-white text-xs truncate">
                    {currentUser?.name || "Teacher"}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-400 truncate">
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
                    className="relative flex flex-shrink-0 justify-center items-center bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800 shadow-sm border border-indigo-100/80 dark:border-indigo-400/20 rounded-xl w-9 h-9 text-slate-500 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-300 transition-colors cursor-pointer"
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
                  className="relative flex justify-center items-center bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800 shadow-sm mt-3 border border-indigo-100/80 dark:border-indigo-400/20 rounded-xl w-full h-9 text-slate-500 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-300 transition-colors cursor-pointer"
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
              className={`flex justify-center items-center bg-red-50 hover:bg-red-100 dark:bg-red-900/40 dark:hover:bg-red-900/60 py-2.5 border-none rounded-xl w-full font-bold text-red-500 hover:text-red-600 dark:hover:text-red-300 dark:text-red-400 text-xs transition-colors cursor-pointer ${
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
          <div className="mx-auto px-8 py-8 max-w-4xl">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}
