// src/pages/student/StudentHomePage.jsx
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { Card, SectionLabel } from "../../components/ui";
import { FaWallet, FaGift, FaTrophy, FaEdit, FaUser, FaCoins, FaBell, FaArrowUp, FaArrowDown, FaEnvelopeOpen } from "react-icons/fa";

export default function StudentHomePage() {
  const { currentUser, getStudentCoins, getStudentTransactions, loadTransactions } = useApp();
  const navigate = useNavigate();

  // Load transactions on mount
  useEffect(() => {
    if (currentUser?._id) {
      loadTransactions(currentUser._id);
    }
  }, [currentUser?._id, loadTransactions]);

  const coins = getStudentCoins(currentUser?._id);
  const txs   = getStudentTransactions(currentUser?._id).slice(0, 5);
  const fn    = currentUser?.name?.split(" ")[0] || "Student";

  const QUICK = [
    { label: "My Wallet",    icon: FaWallet, bg: "bg-blue-50",   color: "text-blue-600",   path: "/student/wallet"  },
    { label: "Rewards Shop", icon: FaGift, bg: "bg-brand-50",  color: "text-brand-600",  path: "/student/rewards" },
    { label: "Leaderboard",  icon: FaTrophy, bg: "bg-amber-50",  color: "text-amber-600",  path: "/student/leaderboard" },
    { label: "Tests",        icon: FaEdit, bg: "bg-green-50",  color: "text-green-600",  path: "/student/tests"   },
    { label: "Profile",      icon: FaUser, bg: "bg-purple-50", color: "text-purple-600", path: "/student/profile" },
  ];

  return (
    <div className="space-y-5 p-5 md:p-0">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-slate-500 text-xs">Welcome back,</p>
          <h2 className="font-poppins font-black text-slate-800 text-2xl md:text-3xl">Hi, {fn} 👋</h2>
        </div>
        <button className="flex justify-center items-center bg-white shadow-sm border-none rounded-full w-10 h-10 text-lg cursor-pointer">
          <FaBell className="text-slate-600" />
        </button>
      </div>

      {/* Balance card */}
      <div className="bg-gradient-to-br from-brand-500 to-brand-700 shadow-brand-200 shadow-xl p-6 rounded-3xl text-white">
        <p className="opacity-80 mb-3 font-bold text-xs uppercase tracking-widest">Total Balance</p>
        <div className="flex items-center gap-3 mb-4">
          <FaCoins className="text-4xl" />
          <span className="font-poppins font-black text-5xl md:text-6xl">{coins.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full w-fit">
          <FaArrowUp className="text-sm" />
          <span className="font-bold text-sm">coins balance</span>
        </div>
      </div>

      {/* Quick actions — 2 col mobile, 5 col desktop */}
      <div className="gap-3 grid grid-cols-2 md:grid-cols-5">
        {QUICK.map(q => (
          <button
            key={q.label}
            onClick={() => q.path && navigate(q.path)}
            className={`${q.bg} rounded-2xl p-4 md:p-5 text-center cursor-pointer border-none transition-all hover:scale-105 hover:shadow-md`}
          >
            <div className="flex justify-center items-center bg-white shadow-sm mx-auto mb-3 rounded-2xl w-12 h-12 text-2xl">
              <q.icon className={q.color} />
            </div>
            <p className={`text-sm font-extrabold ${q.color}`}>{q.label}</p>
          </button>
        ))}
      </div>

      {/* Recent transactions */}
      <Card className="p-5">
        <div className="flex justify-between items-center mb-4">
          <SectionLabel>Recent Transactions</SectionLabel>
          <button onClick={() => navigate("/student/wallet")} className="bg-transparent border-none font-bold text-brand-500 text-xs cursor-pointer">View all →</button>
        </div>
        {txs.length === 0 ? (
          <div className="py-8 text-slate-400 text-center">
            <p className="mb-2 text-3xl">
              <FaEnvelopeOpen className="inline-block text-slate-300" />
            </p>
            <p className="font-bold text-sm">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {txs.map(tx => {
              const earn = tx.type === "earn";
              return (
                <div key={tx._id || tx.id} className="flex items-center gap-3 py-3 border-slate-50 last:border-0 border-b">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${earn ? "bg-brand-50 text-brand-600" : "bg-red-50 text-red-500"}`}>
                    {earn ? <FaArrowUp /> : <FaArrowDown />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-800 text-sm truncate">{tx.label}</p>
                    <p className="text-slate-400 text-xs">{tx.date || new Date(tx.createdAt).toLocaleDateString()}</p>
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

