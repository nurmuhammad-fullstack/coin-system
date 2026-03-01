// src/pages/student/StudentProfilePage.jsx
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Card, Avatar, Chip, SectionLabel } from "../../components/ui";

export default function StudentProfilePage() {
  const { currentUser, getStudentCoins, logout } = useApp();
  const navigate = useNavigate();

  const coins = getStudentCoins(currentUser._id);
  const rank = 1;

  const handleLogout = () => { logout(); navigate("/"); };

  const SETTINGS = [
    { icon: "⚙️", label: "Account Settings" },
    { icon: "🔔", label: "Notifications"    },
    { icon: "❓", label: "Help & Support"   },
    { icon: "📋", label: "Terms & Privacy"  },
  ];

  return (
    <div className="space-y-4 p-5">
      {/* Profile header */}
      <Card className="p-6 text-center">
        <div className="flex justify-center mb-3">
          <Avatar user={currentUser} size={72} />
        </div>
        <h2 className="mb-1 font-poppins font-black text-slate-800 text-2xl">{currentUser.name}</h2>
        <Chip color="green">Class {currentUser.class}</Chip>
      </Card>

      {/* Stats */}
      <div className="gap-3 grid grid-cols-2">
        <Card className="p-4 text-center">
          <SectionLabel>Total Coins</SectionLabel>
          <div className="flex justify-center items-center gap-1.5">
            <span className="text-xl">🪙</span>
            <span className="font-poppins font-black text-slate-800 text-2xl">{coins.toLocaleString()}</span>
          </div>
        </Card>
        <Card className="p-4 text-center">
          <SectionLabel>Rank</SectionLabel>
          <div className="flex justify-center items-center gap-1.5">
            <span className="text-xl">🏆</span>
            <span className="font-poppins font-black text-slate-800 text-2xl">#{rank}</span>
          </div>
        </Card>
      </div>

      {/* Achievement badges */}
      <Card className="p-4">
        <SectionLabel>Achievements</SectionLabel>
        <div className="flex flex-wrap gap-3">
          {[
            { icon: "🎯", label: "First Purchase" },
            { icon: "🔥", label: "7 Day Streak"   },
            { icon: "⭐", label: "Top Student"     },
          ].map(a => (
            <div key={a.label} className="flex flex-col items-center gap-1">
              <div className="flex justify-center items-center bg-amber-50 rounded-2xl w-12 h-12 text-2xl">{a.icon}</div>
              <span className="font-bold text-[10px] text-slate-500">{a.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Settings */}
      <Card className="p-4">
        <SectionLabel>Settings</SectionLabel>
        {SETTINGS.map((s, i) => (
          <div key={s.label} className={`flex items-center justify-between py-3 ${i < SETTINGS.length - 1 ? "border-b border-slate-50" : ""}`}>
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
