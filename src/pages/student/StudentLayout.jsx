// src/pages/student/StudentLayout.jsx
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Toast } from "../../components/ui";

const TABS = [
  { id: "home",    label: "Home",    icon: "🏠", path: "/student/home"    },
  { id: "wallet",  label: "Wallet",  icon: "💳", path: "/student/wallet"  },
  { id: "rewards", label: "Rewards", icon: "🎁", path: "/student/rewards" },
  { id: "profile", label: "Profile", icon: "👤", path: "/student/profile" },
];

export default function StudentLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const active   = TABS.find(t => location.pathname.startsWith(t.path))?.id;

  return (
    <>
      <Toast />

      {/* ── MOBILE (< md) — full screen ───────────────── */}
      <div className="md:hidden min-h-screen bg-slate-50 flex flex-col">
        <div className="flex-1 overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: "none" }}>
          <Outlet />
        </div>
        <nav className="flex bg-white border-t border-slate-100 pb-safe sticky bottom-0 z-50">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => navigate(t.path)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-extrabold transition-colors border-none bg-transparent cursor-pointer
                ${active === t.id ? "text-brand-500" : "text-slate-400"}`}
            >
              <span className="text-xl leading-tight">{t.icon}</span>
              {t.label}
              {active === t.id && <div className="w-1 h-1 rounded-full bg-brand-500 mt-0.5" />}
            </button>
          ))}
        </nav>
      </div>

      {/* ── DESKTOP (≥ md) — full dashboard layout ────── */}
      <div className="hidden md:flex min-h-screen bg-gradient-to-br from-slate-100 to-brand-50">

        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-slate-100 flex flex-col shadow-sm flex-shrink-0">
          {/* Logo */}
          <div className="px-6 py-8 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-200">
                <span className="text-xl">🪙</span>
              </div>
              <div>
                <p className="font-poppins font-black text-lg text-slate-800 leading-none">CoinEd</p>
                <p className="text-xs text-slate-400 font-medium">Student Portal</p>
              </div>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex-1 p-4 space-y-1">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => navigate(t.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold transition-all border-none cursor-pointer text-left
                  ${active === t.id
                    ? "bg-brand-500 text-white shadow-lg shadow-brand-200"
                    : "text-slate-500 bg-transparent hover:bg-slate-50 hover:text-slate-800"
                  }`}
              >
                <span className="text-lg">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </nav>

          {/* Bottom info */}
          <div className="p-4 border-t border-slate-100">
            <div className="bg-brand-50 rounded-2xl p-4 text-center">
              <p className="text-2xl mb-1">🎓</p>
              <p className="text-xs font-bold text-brand-700">Student Account</p>
              <p className="text-xs text-brand-500 mt-0.5">Keep earning coins!</p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}
