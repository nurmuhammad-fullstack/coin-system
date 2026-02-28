// src/pages/teacher/TeacherProfilePage.jsx
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Card, SectionLabel } from "../../components/ui";

export default function TeacherProfilePage() {
  const { currentUser, students, shopItems, getStudentTransactions, logout } = useApp();
  const navigate = useNavigate();

  const totalTxs = students.reduce((a, s) => a + getStudentTransactions(s._id).length, 0);

  const handleLogout = () => { logout(); navigate("/"); };

  const SETTINGS = [
    { icon: "⚙️", label: "Account Settings"  },
    { icon: "🏫", label: "Class Management"  },
    { icon: "📊", label: "Analytics"          },
    { icon: "🔔", label: "Notifications"      },
    { icon: "❓", label: "Help & Support"     },
  ];

  return (
    <div className="space-y-4 p-5">
      {/* Profile */}
      <Card className="p-6 text-center">
        <div className="flex justify-center items-center bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-200 shadow-lg mx-auto mb-3 rounded-3xl w-20 h-20 text-4xl">
          👨‍🏫
        </div>
        <h2 className="mb-1 font-poppins font-black text-slate-800 text-2xl">{currentUser.name}</h2>
        <span className="inline-flex items-center gap-1 bg-amber-50 px-3 py-1 rounded-full font-bold text-amber-700 text-xs">
          ⭐ Class Teacher
        </span>
      </Card>

      {/* Stats */}
      <div className="gap-2 grid grid-cols-3">
        {[
          { label: "Students",     value: students.length,  icon: "👥" },
          { label: "Transactions", value: totalTxs,         icon: "🪙" },
          { label: "Shop Items",   value: shopItems.length, icon: "🏪" },
        ].map(s => (
          <Card key={s.label} className="p-3 text-center">
            <span className="text-xl">{s.icon}</span>
            <p className="mt-1 font-poppins font-black text-slate-800 text-xl">{s.value}</p>
            <p className="font-bold text-[10px] text-slate-400">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Settings */}
      <Card className="p-4">
        <SectionLabel>Settings</SectionLabel>
        {SETTINGS.map((s, i) => (
          <div
            key={s.label}
            className={`flex items-center justify-between py-3 cursor-pointer hover:bg-slate-50 rounded-xl px-1 transition-colors
              ${i < SETTINGS.length - 1 ? "border-b border-slate-50" : ""}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{s.icon}</span>
              <span className="font-bold text-slate-700 text-sm">{s.label}</span>
            </div>
            <span className="text-slate-300 text-sm">›</span>
          </div>
        ))}
        <button
          onClick={handleLogout}
          className="bg-red-50 hover:bg-red-100 mt-3 py-2.5 border-none rounded-xl w-full font-extrabold text-red-500 text-sm transition-colors cursor-pointer"
        >
          🚪 Log Out
        </button>
      </Card>
    </div>
  );
}
