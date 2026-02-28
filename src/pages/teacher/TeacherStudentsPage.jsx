// src/pages/teacher/TeacherStudentsPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Avatar, SectionLabel, Modal } from "../../components/ui";

const COLORS = ["#22c55e","#3b82f6","#f97316","#8b5cf6","#ef4444","#eab308","#06b6d4","#ec4899"];
const BLANK  = { name: "", email: "", password: "", class: "", color: "#22c55e" };

export default function TeacherStudentsPage() {
  const { students, getStudentCoins, createStudent, showToast } = useApp();
  const navigate = useNavigate();
  const [classFilter, setClassFilter] = useState("All");
  const [showModal, setShowModal]     = useState(false);
  const [form, setForm]               = useState({ ...BLANK });
  const [loading, setLoading]         = useState(false);
  const [createdInfo, setCreatedInfo] = useState(null);

  const classes  = ["All", ...new Set(students.map(s => s.class).filter(Boolean))];
  const filtered = students
    .filter(s => classFilter === "All" || s.class === classFilter)
    .sort((a, b) => getStudentCoins(b._id) - getStudentCoins(a._id));

  const avgCoins = filtered.length
    ? Math.round(filtered.reduce((a, s) => a + getStudentCoins(s._id), 0) / filtered.length) : 0;
  const topCoins = filtered.length ? getStudentCoins(filtered[0]?._id) : 0;

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) {
      showToast("❌ Fill in all required fields", "error"); return;
    }
    setLoading(true);
    try {
      await createStudent({
        ...form,
        avatar: form.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
      });
      setCreatedInfo({ email: form.email, password: form.password, name: form.name });
      setShowModal(false);
      setForm({ ...BLANK });
      showToast("✅ " + form.name + " added!");
    } catch (err) {
      showToast("❌ " + (err.message || "Failed"), "error");
    } finally {
      setLoading(false);
    }
  };

  const medals = ["🥇","🥈","🥉"];

  return (
    <div className="p-5 md:p-0 space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 font-semibold">Teacher Dashboard</p>
          <h2 className="font-poppins font-black text-2xl md:text-3xl text-slate-800">My Students</h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-extrabold text-sm px-5 py-2.5 rounded-full border-none cursor-pointer shadow-lg shadow-brand-200 hover:shadow-xl transition-all"
        >
          ➕ Add Student
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl p-5 text-white text-center shadow-lg shadow-brand-200">
          <p className="text-xs font-bold opacity-80 uppercase tracking-wider mb-1">Students</p>
          <p className="font-poppins font-black text-4xl">{filtered.length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-5 text-white text-center shadow-lg shadow-blue-200">
          <p className="text-xs font-bold opacity-80 uppercase tracking-wider mb-1">Avg. Coins</p>
          <p className="font-poppins font-black text-4xl">{avgCoins}</p>
        </div>
        <div className="hidden md:block bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white text-center shadow-lg shadow-amber-200">
          <p className="text-xs font-bold opacity-80 uppercase tracking-wider mb-1">Top Score</p>
          <p className="font-poppins font-black text-4xl">{topCoins}</p>
        </div>
      </div>

      {/* Class filter */}
      <div className="flex gap-2 overflow-x-auto pb-1" style={{scrollbarWidth:"none"}}>
        {classes.map(c => (
          <button key={c} onClick={() => setClassFilter(c)}
            className={"px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap border-none cursor-pointer transition-all " +
              (classFilter === c ? "bg-slate-800 text-white" : "bg-white text-slate-500 shadow-sm")}>
            {c === "All" ? "All Classes" : "Class " + c}
          </button>
        ))}
      </div>

      {/* Students list */}
      <div>
        <SectionLabel>Leaderboard — tap to manage</SectionLabel>
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <div className="text-5xl mb-3">👥</div>
            <p className="text-sm font-bold">No students yet</p>
            <p className="text-xs mt-1">Tap "Add Student" to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map((s, i) => (
              <div key={s._id} onClick={() => navigate("/teacher/students/" + s._id)}
                className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm cursor-pointer hover:shadow-lg transition-all border border-transparent hover:border-slate-100">
                <span className="w-7 text-center font-black text-base">{medals[i] || "#" + (i+1)}</span>
                <Avatar user={s} size={44} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold text-slate-800 truncate">{s.name}</p>
                  <p className="text-xs text-slate-400">Class {s.class}</p>
                </div>
                <div className="flex items-center gap-1.5 bg-brand-50 rounded-full px-3 py-1">
                  <span className="text-sm">🪙</span>
                  <span className="font-black text-sm text-brand-700">{getStudentCoins(s._id).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {showModal && (
        <Modal onClose={() => { setShowModal(false); setForm({...BLANK}); }}>
          <h3 className="font-poppins font-black text-xl text-slate-800 mb-5">➕ Add New Student</h3>
          <div className="space-y-3 mb-4">
            <input type="text" placeholder="Full name *" value={form.name}
              onChange={e => setForm(f => ({...f, name: e.target.value}))}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-400 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all" />
            <input type="email" placeholder="Email address *" value={form.email}
              onChange={e => setForm(f => ({...f, email: e.target.value}))}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-400 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all" />
            <input type="text" placeholder="Password * (e.g. student123)" value={form.password}
              onChange={e => setForm(f => ({...f, password: e.target.value}))}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-400 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all" />
            <input type="text" placeholder="Class (e.g. 8-B)" value={form.class}
              onChange={e => setForm(f => ({...f, class: e.target.value}))}
              className="w-full bg-slate-50 border-2 border-transparent focus:border-brand-400 rounded-xl px-4 py-3 text-sm font-medium outline-none transition-all" />
            <div>
              <p className="text-xs font-bold text-slate-500 mb-2">Avatar Color</p>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map(c => (
                  <button key={c} onClick={() => setForm(f => ({...f, color: c}))}
                    className="w-8 h-8 rounded-full border-2 cursor-pointer transition-all"
                    style={{background: c, borderColor: form.color===c?"#1e293b":"transparent", transform: form.color===c?"scale(1.2)":"scale(1)"}} />
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setShowModal(false); setForm({...BLANK}); }}
              className="flex-1 py-3 rounded-2xl border-2 border-slate-200 text-slate-600 font-extrabold text-sm bg-white cursor-pointer">
              Cancel
            </button>
            <button onClick={handleCreate} disabled={loading}
              className="flex-[2] py-3 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-extrabold text-sm border-none cursor-pointer disabled:opacity-60">
              {loading ? "Creating..." : "Create Student ✅"}
            </button>
          </div>
        </Modal>
      )}

      {/* Credentials modal */}
      {createdInfo && (
        <Modal onClose={() => setCreatedInfo(null)}>
          <div className="text-center">
            <div className="text-5xl mb-3">🎉</div>
            <h3 className="font-poppins font-black text-xl mb-1">Student Created!</h3>
            <p className="text-sm text-slate-500 mb-5">Share these with <b>{createdInfo.name}</b></p>
            <div className="bg-slate-50 rounded-2xl p-4 mb-4 text-left space-y-3">
              <div className="flex justify-between"><span className="text-xs text-slate-400 font-bold">EMAIL</span><span className="text-sm font-extrabold">{createdInfo.email}</span></div>
              <div className="h-px bg-slate-200" />
              <div className="flex justify-between"><span className="text-xs text-slate-400 font-bold">PASSWORD</span><span className="text-sm font-extrabold">{createdInfo.password}</span></div>
            </div>
            <div className="bg-amber-50 rounded-xl p-3 mb-4">
              <p className="text-xs text-amber-700 font-bold">⚠️ Save these! Password won't be shown again.</p>
            </div>
            <button onClick={() => setCreatedInfo(null)}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-500 to-brand-600 text-white font-extrabold text-sm border-none cursor-pointer">
              Got it ✅
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
