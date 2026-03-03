// src/pages/student/StudentLeaderboardPage.jsx
import { useState } from "react";
import { useApp } from "../../context/AppContext";

export default function StudentLeaderboardPage() {
  const { students, currentUser } = useApp();
  const [filter, setFilter] = useState("All");

  const sorted   = [...students].sort((a, b) => (b.coins || 0) - (a.coins || 0));
  const filtered = filter === "All" ? sorted : sorted.filter(s => s.class === filter);
  const classes  = [...new Set(students.map(s => s.class).filter(Boolean))];
  const userRank = sorted.findIndex(s => s._id === currentUser?._id) + 1;
  const top3     = filtered.slice(0, 3);
  const rest     = filtered.slice(3);

  const initials = (name = "") =>
    name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  const podium = [
    { student: top3[1], medal: "🥈", barH: "h-14", size: "w-14 h-14", bg: "bg-slate-200 dark:bg-slate-600" },
    { student: top3[0], medal: "🥇", barH: "h-20", size: "w-16 h-16", bg: "bg-amber-300" },
    { student: top3[2], medal: "🥉", barH: "h-10", size: "w-12 h-12", bg: "bg-orange-200 dark:bg-orange-400" },
  ];

  return (
    <div className="space-y-5 p-5 pb-10">
      <div className="pt-2 text-center">
        <p className="mb-1 font-bold text-amber-400 text-xs uppercase tracking-widest">CoinEd</p>
        <h1 className="font-black text-slate-800 dark:text-white text-3xl">Leaderboard 🏆</h1>
      </div>

      {userRank > 0 && (
        <div className="flex justify-between items-center bg-brand-500 px-5 py-4 rounded-2xl">
          <div>
            <p className="mb-0.5 font-bold text-brand-100 text-xs">Sizning o'rningiz</p>
            <p className="font-black text-white text-3xl">#{userRank}</p>
          </div>
          <div className="text-right">
            <p className="mb-0.5 font-bold text-brand-100 text-xs">Coinlar</p>
            <p className="font-black text-white text-2xl">🪙 {currentUser?.coins || 0}</p>
          </div>
        </div>
      )}

      {classes.length > 0 && (
        <div className="flex gap-2 pb-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
          {["All", ...classes].map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className={"px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap border-none cursor-pointer transition-all " +
                (filter === c ? "bg-brand-500 text-white" : "bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300")}>
              {c === "All" ? "Barchasi" : "Sinf " + c}
            </button>
          ))}
        </div>
      )}

      {top3.length > 0 && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl">
          <div className="flex justify-center items-end gap-3">
            {podium.map(({ student: s, medal, barH, size, bg }, i) => {
              if (!s) return <div key={i} className="w-20" />;
              const isMe = s._id === currentUser?._id;
              return (
                <div key={s._id} className="flex flex-col items-center gap-1.5">
                  <div className={`${size} rounded-2xl flex items-center justify-center font-black text-white text-base ${isMe ? "ring-2 ring-amber-400 ring-offset-2" : ""}`}
                    style={{ background: s.color || "#6366f1" }}>
                    {initials(s.name)}
                  </div>
                  <p className="max-w-[64px] font-bold text-slate-700 dark:text-slate-300 text-xs text-center truncate">{s.name?.split(" ")[0]}</p>
                  <p className="font-black text-[11px] text-slate-500 dark:text-slate-400">🪙 {s.coins || 0}</p>
                  <div className={`w-16 ${barH} ${bg} rounded-t-xl flex items-start justify-center pt-1.5`}>
                    <span className="text-xl">{medal}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-2">
        {rest.map((s, i) => {
          const isMe = s._id === currentUser?._id;
          return (
            <div key={s._id} className={"flex items-center gap-3 p-4 rounded-2xl " + (isMe ? "bg-amber-50 dark:bg-amber-900/30 border-2 border-amber-300 dark:border-amber-600" : "bg-white dark:bg-slate-800")}>
              <div className="w-7 font-black text-slate-300 dark:text-slate-600 text-sm text-center">#{i + 4}</div>
              <div className="flex flex-shrink-0 justify-center items-center rounded-xl w-10 h-10 font-black text-white text-sm"
                style={{ background: s.color || "#6366f1" }}>
                {initials(s.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={"font-bold text-sm truncate " + (isMe ? "text-amber-600 dark:text-amber-400" : "text-slate-700 dark:text-white")}>
                  {s.name} {isMe && "⭐"}
                </p>
                <p className="text-slate-400 dark:text-slate-500 text-xs">Sinf {s.class}</p>
              </div>
              <div className={"px-3 py-1.5 rounded-xl font-black text-sm " + (isMe ? "bg-amber-400 text-white" : "bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300")}>
                🪙 {s.coins || 0}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

