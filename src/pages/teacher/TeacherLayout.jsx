// src/pages/teacher/TeacherLayout.jsx
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Toast } from "../../components/ui";
import { FaUsers, FaClipboardList, FaStore, FaUser, FaCoins, FaChalkboardTeacher, FaSignOutAlt } from "react-icons/fa";

const TABS = [
  { id: "students", label: "Students", icon: FaUsers,  path: "/teacher/students" },
  { id: "quizzes",  label: "Quizzes",  icon: FaClipboardList,  path: "/teacher/quizzes"  },
  { id: "shop",     label: "Shop",     icon: FaStore,     path: "/teacher/shop"     },
  { id: "profile",  label: "Profile",  icon: FaUser, path: "/teacher/profile"  },
];

export default function TeacherLayout() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { currentUser, logout } = useApp();
  const active = TABS.find(t => location.pathname.startsWith(t.path))?.id;

  return (
    <>
      <Toast />

      {/* MOBILE */}
      <div className="md:hidden flex justify-center items-center bg-slate-50 p-4 min-h-screen">
        <div className="flex flex-col bg-white shadow-2xl shadow-slate-300 border border-slate-100 rounded-[2.5rem] w-full max-w-sm h-[780px] overflow-hidden">
          <div className="flex flex-shrink-0 justify-between items-center px-6 pt-3 pb-1 font-bold text-slate-400 text-xs">
            <span>9:41</span>
            <div className="flex items-center gap-1"><span>●●●</span><span>WiFi</span><span>🔋</span></div>
          </div>
          <div className="flex-1 overflow-x-hidden overflow-y-auto" style={{ scrollbarWidth: "none" }}>
            <Outlet />
          </div>
          <nav className="flex flex-shrink-0 bg-white border-slate-100 border-t">
            {TABS.map(t => (
              <button key={t.id} onClick={() => navigate(t.path)}
                className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-extrabold border-none bg-transparent cursor-pointer transition-colors
                  ${active === t.id ? "text-indigo-500" : "text-slate-400"}`}>
                <t.icon className="text-xl leading-tight" />
                {t.label}
                {active === t.id && <div className="bg-indigo-500 rounded-full w-1 h-1" />}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:flex bg-gradient-to-br from-slate-50 to-indigo-50 min-h-screen">

        {/* Sidebar */}
        <aside className="top-0 sticky flex flex-col flex-shrink-0 bg-white shadow-sm border-slate-100 border-r w-56 lg:w-64 h-screen">
          {/* Logo */}
          <div className="flex-shrink-0 px-6 py-6 border-slate-100 border-b">
            <div className="flex items-center gap-3">
              <div className="flex justify-center items-center bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-200 shadow-lg rounded-xl w-10 h-10">
                <FaCoins className="text-white text-xl" />
              </div>
              <div>
                <p className="font-black text-slate-900 text-sm leading-tight">CoinEd</p>
                <p className="font-medium text-[10px] text-slate-400">Teacher Portal</p>
              </div>
            </div>
          </div>

          {/* Nav items */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {TABS.map(t => (
              <button key={t.id} onClick={() => navigate(t.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold text-left border-none cursor-pointer transition-all
                  ${active === t.id
                    ? "bg-indigo-500 text-white shadow-lg shadow-indigo-200"
                    : "bg-transparent text-slate-500 hover:bg-indigo-50 hover:text-indigo-700"
                  }`}>
                <t.icon className="text-lg" />
                {t.label}
              </button>
            ))}
          </nav>

          {/* User info + logout */}
          <div className="flex-shrink-0 px-3 pt-4 pb-4 border-slate-100 border-t">
            <div className="bg-indigo-50 mb-3 p-3 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className="flex justify-center items-center bg-indigo-100 rounded-xl w-9 h-9 text-lg">
                  <FaChalkboardTeacher className="text-indigo-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-700 text-xs truncate">{currentUser?.name || "Teacher"}</p>
                  <p className="text-[10px] text-slate-400 truncate">{currentUser?.email}</p>
                </div>
              </div>
            </div>
            <button onClick={logout}
              className="flex justify-center items-center gap-2 bg-red-50 hover:bg-red-100 py-2.5 border-none rounded-xl w-full font-bold text-red-400 hover:text-red-600 text-xs transition-colors cursor-pointer">
              <FaSignOutAlt /> Sign out
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

