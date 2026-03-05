// src/pages/teacher/TeacherLayout.jsx
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Toast, Avatar } from "../../components/ui";
import { FaUsers, FaClipboardList, FaStore, FaUser, FaCoins, FaChalkboardTeacher, FaSignOutAlt, FaBell, FaSchool, FaChartLine, FaQuestionCircle, FaCommentDots } from "react-icons/fa";

const TABS = [
  { id: "students", label: "Students", icon: FaUsers,  path: "/teacher/students" },
  { id: "classes", label: "Classes", icon: FaSchool,  path: "/teacher/classes" },
  { id: "quizzes",  label: "Quizzes",  icon: FaClipboardList,  path: "/teacher/quizzes"  },
  { id: "shop",     label: "Shop",     icon: FaStore,     path: "/teacher/shop"     },
  { id: "analytics", label: "Analytics", icon: FaChartLine, path: "/teacher/analytics" },
  { id: "chat", label: "Chat", icon: FaCommentDots, path: "/teacher/chat" },
  { id: "profile",  label: "Profile",  icon: FaUser, path: "/teacher/profile"  },
  { id: "help", label: "Help", icon: FaQuestionCircle, path: "/teacher/help" },
];

export default function TeacherLayout() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { currentUser, logout, unreadCount } = useApp();
  const active = TABS.find(t => location.pathname.startsWith(t.path))?.id;

  return (
    <>
      <Toast />

      {/* MOBILE - Full screen */}
      <div className="md:hidden flex flex-col bg-slate-50 dark:bg-slate-900 min-h-screen">
        <div className="flex-1 overflow-x-hidden overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <Outlet />
        </div>
        <nav className="bottom-0 z-50 sticky flex bg-white dark:bg-slate-800 pb-safe border-slate-100 dark:border-slate-700 border-t">
          {TABS.map(t => (
            <button key={t.id} onClick={() => navigate(t.path)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-extrabold border-none bg-transparent cursor-pointer transition-colors
                ${active === t.id ? "text-indigo-500" : "text-slate-400 dark:text-slate-500"}`}>
              <t.icon className="text-xl leading-tight" />
              {t.label}
              {active === t.id && <div className="bg-indigo-500 rounded-full w-1 h-1" />}
            </button>
          ))}
        </nav>
      </div>

      {/* DESKTOP */}
      <div className="hidden md:flex bg-gradient-to-br from-slate-50 dark:from-slate-900 dark:via-slate-900 to-indigo-50 dark:to-slate-900 min-h-screen">

        {/* Sidebar */}
        <aside className="top-0 sticky flex flex-col flex-shrink-0 bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 border-r w-56 lg:w-64 h-screen">
          {/* Logo */}
          <div className="flex-shrink-0 px-6 py-6 border-slate-100 dark:border-slate-700 border-b">
            <div className="flex justify-between items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="flex justify-center items-center bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl w-10 h-10">
                  <FaCoins className="text-white text-xl" />
                </div>
                <div>
                  <p className="font-black text-slate-900 dark:text-white text-sm leading-tight">CoinEd</p>
                  <p className="font-medium text-[10px] text-slate-400 dark:text-slate-400">Teacher Portal</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/notifications')}
                className="relative hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-xl transition-colors"
              >
                <FaBell className="text-slate-600 dark:text-slate-300 text-lg" />
                {unreadCount > 0 && (
                  <span className="-top-1 -right-1 absolute bg-red-500 px-1.5 py-0.5 rounded-full min-w-[18px] font-bold text-[10px] text-white text-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Nav items */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            {TABS.map(t => (
              <button key={t.id} onClick={() => navigate(t.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-extrabold text-left border-none cursor-pointer transition-all
                  ${active === t.id
                    ? "bg-indigo-500 text-white"
                    : "bg-transparent text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-indigo-600 dark:hover:text-white"
                  }`}>
                <t.icon className="text-lg" />
                {t.label}
              </button>
            ))}
          </nav>

          {/* User info + logout */}
          <div className="flex-shrink-0 px-3 pt-4 pb-4 border-slate-100 dark:border-slate-700 border-t">
            <div className="bg-indigo-50 dark:bg-slate-700 mb-3 p-3 rounded-2xl">
              <div className="flex items-center gap-3">
                <Avatar user={currentUser} size={36} />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-700 dark:text-white text-xs truncate">{currentUser?.name || "Teacher"}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-400 truncate">{currentUser?.email}</p>
                </div>
              </div>
            </div>
            <button onClick={logout}
              className="flex justify-center items-center gap-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/40 dark:hover:bg-red-900/60 py-2.5 border-none rounded-xl w-full font-bold text-red-500 hover:text-red-600 dark:hover:text-red-300 dark:text-red-400 text-xs transition-colors cursor-pointer">
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

