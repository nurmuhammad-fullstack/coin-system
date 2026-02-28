
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Avatar, SectionLabel } from "../../components/ui";

export default function TeacherStudentsPage() {
  const { students, getStudentCoins, refreshStudents } = useApp();
  const navigate = useNavigate();
  const [classFilter, setClassFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStudents = async () => {
      await refreshStudents();
      setLoading(false);
    };
    loadStudents();
  }, []);

  const classes = ["All", ...new Set(students.map(s => s.class))];
  const filtered = students
    .filter(s => classFilter === "All" || s.class === classFilter)
  .sort((a, b) => getStudentCoins(b._id) - getStudentCoins(a._id));

  const totalCoins = filtered.reduce((a, s) => a + getStudentCoins(s._id), 0);
  const avgCoins   = filtered.length ? Math.round(totalCoins / filtered.length) : 0;

  const medalColor = i => ["text-amber-400", "text-slate-400", "text-orange-600"][i] ?? "text-slate-300";

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-slate-500 text-xs">Teacher Dashboard</p>
          <h2 className="font-poppins font-black text-slate-800 text-2xl">My Students</h2>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full">
          <span>⭐</span>
          <span className="font-black text-amber-700 text-xs">Teacher</span>
        </div>
      </div>

      {/* Stats */}
      <div className="gap-3 grid grid-cols-2">
        <div className="bg-gradient-to-br from-brand-500 to-brand-700 shadow-brand-200 shadow-lg p-4 rounded-2xl text-white text-center">
          <p className="opacity-80 mb-1 font-bold text-xs uppercase tracking-wider">Students</p>
          <p className="font-poppins font-black text-3xl">{filtered.length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 shadow-blue-200 shadow-lg p-4 rounded-2xl text-white text-center">
          <p className="opacity-80 mb-1 font-bold text-xs uppercase tracking-wider">Avg. Coins</p>
          <p className="font-poppins font-black text-3xl">{avgCoins}</p>
        </div>
      </div>

      {/* Class filter */}
      <div className="flex gap-2 pb-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {classes.map(c => (
          <button
            key={c}
            onClick={() => setClassFilter(c)}
            className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap border-none cursor-pointer transition-all
              ${classFilter === c ? "bg-slate-800 text-white" : "bg-white text-slate-500 shadow-sm"}`}
          >
            {c === "All" ? "All Classes" : `Class ${c}`}
          </button>
        ))}
      </div>

      {/* Leaderboard */}
      <div>
        <SectionLabel>Leaderboard — tap to manage</SectionLabel>
        <div className="space-y-2">
          {filtered.map((s, i) => (
            <div
              key={s._id}
              onClick={() => navigate(`/teacher/students/${s._id}`)}
              className="flex items-center gap-3 bg-white shadow-sm hover:shadow-md p-3.5 rounded-2xl transition-all hover:translate-x-0.5 cursor-pointer"
            >
              <span className={`w-6 text-center font-black text-sm ${medalColor(i)}`}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i+1}`}
              </span>
              <Avatar user={s} size={40} />
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-slate-800 text-sm truncate">{s.name}</p>
                <p className="text-slate-400 text-xs">Class {s.class}</p>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-base">🪙</span>
                <span className="font-black text-slate-800 text-sm">{getStudentCoins(s._id).toLocaleString()}</span>
              </div>
              <span className="text-slate-300 text-sm">›</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}                                             