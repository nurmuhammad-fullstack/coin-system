import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Toast } from "../../components/ui";

const TABS = [
  { id: "students", label: "Students", icon: "👥", path: "/teacher/students" },
  { id: "shop",     label: "Shop",     icon: "🏪", path: "/teacher/shop"     },
  { id: "profile",  label: "Profile",  icon: "👨‍🏫", path: "/teacher/profile"  },
];

export default function TeacherLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const active   = TABS.find(t => location.pathname.startsWith(t.path))?.id;

  return (
    <>
      <Toast />

      {/* ── MOBILE (< md) — full screen ───────────────── */}
      <div className="md:hidden flex flex-col bg-slate-50 min-h-screen">
        <div className="flex-1 overflow-x-hidden overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <Outlet />
        </div>
        <nav className="bottom-0 z-50 sticky flex bg-white border-slate-100 border-t">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => navigate(t.path)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 text-[10px] font-extrabold transition-colors border-none bg-transparent cursor-pointer
                ${active === t.id ? "text-blue-500" : "text-slate-400"}`}
            >
              <span className="text-xl leading-tight">{t.icon}</span>
              {t.label}
              {active === t.id && <div className="bg-blue-500 mt-0.5 rounded-full w-1 h-1" />}
            </button>
          ))}
        </nav>
      </div>

      {/* ── DESKTOP (≥ md) — full dashboard layout ────── */}
      <div className="hidden md:flex bg-gradient-to-br from-slate-100 to-blue-50 min-h-screen">

        {/* Sidebar */}
        <aside className="flex flex-col flex-shrink-0 bg-white shadow-sm border-slate-100 border-r w-64">
          {/* Logo */}
          <div className="px-6 py-8 border-slate-100 border-b">
            <div className="flex items-center gap-3">
              <div className="flex justify-center items-center bg-gradient-to-br from-blue-500 to-blue-700 shadow-blue-200 shadow-lg rounded-2xl w-10 h-10">
                <span className="text-xl">🏫</span>
              </div>
              <div>
                <p className="font-poppins font-black text-slate-800 text-lg leading-none">CoinEd</p>
                <p className="font-medium text-slate-400 text-xs">Teacher Portal</p>
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
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-200"
                    : "text-slate-500 bg-transparent hover:bg-slate-50 hover:text-slate-800"
                  }`}
              >
                <span className="text-lg">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </nav>

          {/* Bottom info */}
          <div className="p-4 border-slate-100 border-t">
            <div className="bg-blue-50 p-4 rounded-2xl text-center">
              <p className="mb-1 text-2xl">👨‍🏫</p>
              <p className="font-bold text-blue-700 text-xs">Teacher Account</p>
              <p className="mt-0.5 text-blue-500 text-xs">Manage your class</p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto p-8 max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
}
