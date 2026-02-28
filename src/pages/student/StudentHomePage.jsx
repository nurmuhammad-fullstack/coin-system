// src/pages/student/StudentHomePage.jsx
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Card, SectionLabel } from "../../components/ui";

export default function StudentHomePage() {
  const { currentUser, getStudentCoins, getStudentTransactions } = useApp();
  const navigate = useNavigate();

  const coins = getStudentCoins(currentUser?._id);
  const txs   = getStudentTransactions(currentUser?._id).slice(0, 5);
  const fn    = currentUser?.name?.split(" ")[0] || "Student";

  const QUICK = [
    { label: "My Wallet",    icon: "💳", bg: "bg-blue-50",   color: "text-blue-600",   path: "/student/wallet"  },
    { label: "Rewards Shop", icon: "🎁", bg: "bg-brand-50",  color: "text-brand-600",  path: "/student/rewards" },
    { label: "Leaderboard",  icon: "🏆", bg: "bg-amber-50",  color: "text-amber-600",  path: null               },
    { label: "Profile",      icon: "👤", bg: "bg-purple-50", color: "text-purple-600", path: "/student/profile" },
  ];

  return (
    <div className="p-5 md:p-0 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 font-semibold">Welcome back,</p>
          <h2 className="font-poppins font-black text-2xl md:text-3xl text-slate-800">Hi, {fn} 👋</h2>
        </div>
        <button className="w-10 h-10 rounded-full bg-white shadow-sm border-none cursor-pointer text-lg flex items-center justify-center">🔔</button>
      </div>

      {/* Balance card */}
      <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-3xl p-6 text-white shadow-xl shadow-brand-200">
        <p className="text-xs font-bold opacity-80 uppercase tracking-widest mb-3">Total Balance</p>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">🪙</span>
          <span className="font-poppins font-black text-5xl md:text-6xl">{coins.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 w-fit">
          <span className="text-sm">↑</span>
          <span className="text-sm font-bold">coins balance</span>
        </div>
      </div>

      {/* Quick actions — 2 col mobile, 4 col desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {QUICK.map(q => (
          <button
            key={q.label}
            onClick={() => q.path && navigate(q.path)}
            className={`${q.bg} rounded-2xl p-4 md:p-5 text-center cursor-pointer border-none transition-all hover:scale-105 hover:shadow-md`}
          >
            <div className={`w-12 h-12 rounded-2xl bg-white flex items-center justify-center mx-auto mb-3 shadow-sm text-2xl`}>
              {q.icon}
            </div>
            <p className={`text-sm font-extrabold ${q.color}`}>{q.label}</p>
          </button>
        ))}
      </div>

      {/* Recent transactions */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <SectionLabel>Recent Transactions</SectionLabel>
          <button onClick={() => navigate("/student/wallet")} className="text-xs font-bold text-brand-500 border-none bg-transparent cursor-pointer">View all →</button>
        </div>
        {txs.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <p className="text-3xl mb-2">📭</p>
            <p className="text-sm font-bold">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {txs.map(tx => {
              const earn = tx.type === "earn";
              return (
                <div key={tx._id || tx.id} className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${earn ? "bg-brand-50 text-brand-600" : "bg-red-50 text-red-500"}`}>
                    {earn ? "↑" : "↓"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 truncate">{tx.label}</p>
                    <p className="text-xs text-slate-400">{tx.date || new Date(tx.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`text-sm font-black ${earn ? "text-brand-600" : "text-red-500"}`}>
                    {earn ? "+" : ""}{tx.amount}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
