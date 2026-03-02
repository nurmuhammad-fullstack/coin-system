// src/pages/student/StudentLayout.jsx
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Toast, Avatar } from "../../components/ui";
import { FaHome, FaWallet, FaGift, FaTrophy, FaEdit, FaUser, FaCoins, FaGraduationCap, FaSignOutAlt } from "react-icons/fa";

const TABS = [
  { id: "home",    label: "Home",    icon: FaHome,    path: "/student/home"    },
  { id: "wallet",  label: "Wallet",  icon: FaWallet,  path: "/student/wallet"  },
  { id: "rewards", label: "Rewards", icon: FaGift,    path: "/student/rewards" },
  { id: "leaderboard", label: "Leaderboard", icon: FaTrophy, path: "/student/leaderboard" },
  { id: "tests",   label: "Tests",   icon: FaEdit,    path: "/student/tests"   },
  { id: "profile", label: "Profile", icon: FaUser,    path: "/student/profile" },
];

export default function StudentLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout } = useApp();
  const active   = TABS.find(t => location.pathname.startsWith(t.path))?.id;

  return (
    <>
      <Toast />

{/* ── MOBILE (< md) — full screen ───────────────── */}
      <div className="md:hidden flex flex-col bg-slate-50 dark:bg-slate-900 min-h-screen">
        <div className="flex-1 overflow-x-hidden overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <Outlet />
        </div>
        <nav className="bottom-0 z-50 sticky flex bg-white dark:bg-slate-800 pb-safe border-slate-100 dark:border-slate-700 border-t">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => navigate(t.path)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-extrabold transition-colors border-none bg-transparent cursor-pointer
                ${active === t.id ? "text-brand-500" : "text-slate-400 dark:text-slate-500"}`}
            >
              <t.icon className="text-xl leading-tight" />
              {t.label}
              {active === t.id && <div className="bg-brand-500 mt-0.5 rounded-full w-1 h-1" />}
            </button>
          ))}
        </nav>
      </div>

      {/* ── DESKTOP (≥ md) — full dashboard layout ────── */}
      <div className="hidden md:flex bg-gradient-to-br from-slate-100 dark:from-slate-900 to-brand-50 dark:to-slate-800 min-h-screen">

        {/* Sidebar */}
        <aside className="flex flex-col flex-shrink-0 bg-white dark:bg-slate-800 shadow-sm border-slate-100 dark:border-slate-700 border-r w-64">
          {/* Logo */}
          <div className="px-6 py-8 border-slate-100 dark:border-slate-700 border-b">
            <div className="flex items-center gap-3">
              <div className="flex justify-center items-center bg-gradient-to-br from-brand-500 to-brand-700 shadow-brand-200 shadow-lg dark:shadow-brand-900 rounded-2xl w-10 h-10">
                <FaCoins className="text-white text-xl" />
              </div>
              <div>
                <p className="font-poppins font-black text-slate-800 dark:text-white text-lg leading-none">CoinEd</p>
                <p className="font-medium text-slate-400 dark:text-slate-500 text-xs">Student Portal</p>
              </div>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex-1 space-y-1 p-4">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => navigate(t.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all border-none cursor-pointer text-left
                  ${active === t.id
                    ? "bg-brand-500 text-white shadow-lg shadow-brand-200 dark:shadow-brand-900"
                    : "text-slate-500 dark:text-slate-400 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-800 dark:hover:text-white"
                  }`}
              >
                <t.icon className="text-lg" />
                {t.label}
              </button>
            ))}
          </nav>

          {/* User info + logout */}
          <div className="flex-shrink-0 px-3 pt-4 pb-4 border-slate-100 dark:border-slate-700 border-t">
            <div className="bg-brand-50 dark:bg-brand-900/30 mb-3 p-3 rounded-2xl">
              <div className="flex items-center gap-3">
                <Avatar user={currentUser} size={36} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-700 dark:text-slate-200 text-xs truncate">{currentUser?.name || "Student"}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{currentUser?.email}</p>
                </div>
              </div>
            </div>
            <button onClick={logout}
              className="flex justify-center items-center gap-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 py-2.5 border-none rounded-xl w-full font-bold text-red-400 hover:text-red-600 dark:hover:text-red-300 dark:text-red-400 text-xs transition-colors cursor-pointer">
              <FaSignOutAlt /> Sign out
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

