// src/pages/teacher/TeacherStudentsPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Avatar, SectionLabel, Modal } from "../../components/ui";
import { FaPlus, FaUsers, FaCoins, FaTrophy, FaMedal, FaUserPlus, FaCheck, FaExclamationTriangle } from "react-icons/fa";

const COLORS = ["#22c55e","#3b82f6","#f97316","#8b5cf6","#ef4444","#eab308","#06b6d4","#ec4899"];
const BLANK  = { login: "", name: "", email: "", password: "", class: "", color: "#22c55e" };

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
    if (!form.login || !form.name || !form.password) {
      showToast("❌ Fill in login, name and password", "error"); return;
    }
    setLoading(true);
    try {
      await createStudent({
        ...form,
        avatar: form.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
      });
      setCreatedInfo({ login: form.login, password: form.password, name: form.name });
      setShowModal(false);
      setForm({ ...BLANK });
      showToast("✅ " + form.name + " added!");
    } catch (err) {
      showToast("❌ " + (err.message || "Failed"), "error");
    } finally {
      setLoading(false);
    }
  };

  const medals = [<FaMedal className="text-yellow-500" />, <FaMedal className="text-gray-400" />, <FaMedal className="text-amber-600" />];

  return (
    <div className="space-y-5 p-5 md:p-0">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-slate-500 text-xs">Teacher Dashboard</p>
          <h2 className="font-poppins font-black text-slate-800 text-2xl md:text-3xl">My Students</h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 shadow-brand-200 shadow-lg hover:shadow-xl px-5 py-2.5 border-none rounded-full font-extrabold text-white text-sm transition-all cursor-pointer"
        >
          <FaPlus /> Add Student
        </button>
      </div>

      {/* Stats */}
      <div className="gap-3 grid grid-cols-2 md:grid-cols-3">
        <div className="bg-gradient-to-br from-brand-500 to-brand-700 shadow-brand-200 shadow-lg p-5 rounded-2xl text-white text-center">
          <p className="opacity-80 mb-1 font-bold text-xs uppercase tracking-wider">Students</p>
          <p className="font-poppins font-black text-4xl">{filtered.length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 shadow-blue-200 shadow-lg p-5 rounded-2xl text-white text-center">
          <p className="opacity-80 mb-1 font-bold text-xs uppercase tracking-wider">Avg. Coins</p>
          <p className="font-poppins font-black text-4xl">{avgCoins}</p>
        </div>
        <div className="hidden md:block bg-gradient-to-br from-amber-500 to-amber-600 shadow-amber-200 shadow-lg p-5 rounded-2xl text-white text-center">
          <p className="opacity-80 mb-1 font-bold text-xs uppercase tracking-wider">Top Score</p>
          <p className="font-poppins font-black text-4xl">{topCoins}</p>
        </div>
      </div>

      {/* Class filter */}
      <div className="flex gap-2 pb-1 overflow-x-auto" style={{scrollbarWidth:"none"}}>
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
          <div className="py-12 text-slate-400 text-center">
            <div className="mb-3 text-5xl">
              <FaUsers className="inline-block text-slate-300" />
            </div>
            <p className="font-bold text-sm">No students yet</p>
            <p className="mt-1 text-xs">Tap "Add Student" to get started</p>
          </div>
        ) : (
          <div className="gap-3 grid grid-cols-1 md:grid-cols-2">
            {filtered.map((s, i) => (
              <div key={s._id} onClick={() => navigate("/teacher/students/" + s._id)}
                className="flex items-center gap-3 bg-white shadow-sm hover:shadow-lg p-4 border border-transparent hover:border-slate-100 rounded-2xl transition-all cursor-pointer">
                <span className="w-7 font-black text-base text-center">{medals[i] || "#" + (i+1)}</span>
                <Avatar user={s} size={44} />
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-slate-800 text-sm truncate">{s.name}</p>
                  <p className="text-slate-400 text-xs">Class {s.class}</p>
                </div>
                <div className="flex items-center gap-1.5 bg-brand-50 px-3 py-1 rounded-full">
                  <FaCoins className="text-amber-500 text-sm" />
                  <span className="font-black text-brand-700 text-sm">{getStudentCoins(s._id).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {showModal && (
        <Modal onClose={() => { setShowModal(false); setForm({...BLANK}); }}>
          <h3 className="flex items-center gap-2 mb-5 font-poppins font-black text-slate-800 text-xl">
            <FaUserPlus /> Add New Student
          </h3>
          <div className="space-y-3 mb-4">
            <input type="text" placeholder="Login (username) *" value={form.login}
              onChange={e => setForm(f => ({...f, login: e.target.value}))}
              className="bg-slate-50 px-4 py-3 border-2 border-transparent focus:border-brand-400 rounded-xl outline-none w-full font-medium text-sm transition-all" />
            <input type="text" placeholder="Full name *" value={form.name}
              onChange={e => setForm(f => ({...f, name: e.target.value}))}
              className="bg-slate-50 px-4 py-3 border-2 border-transparent focus:border-brand-400 rounded-xl outline-none w-full font-medium text-sm transition-all" />
            <input type="email" placeholder="Email address (optional)" value={form.email}
              onChange={e => setForm(f => ({...f, email: e.target.value}))}
              className="bg-slate-50 px-4 py-3 border-2 border-transparent focus:border-brand-400 rounded-xl outline-none w-full font-medium text-sm transition-all" />
            <input type="text" placeholder="Password * (e.g. student123)" value={form.password}
              onChange={e => setForm(f => ({...f, password: e.target.value}))}
              className="bg-slate-50 px-4 py-3 border-2 border-transparent focus:border-brand-400 rounded-xl outline-none w-full font-medium text-sm transition-all" />
            <input type="text" placeholder="Class (e.g. 8-B)" value={form.class}
              onChange={e => setForm(f => ({...f, class: e.target.value}))}
              className="bg-slate-50 px-4 py-3 border-2 border-transparent focus:border-brand-400 rounded-xl outline-none w-full font-medium text-sm transition-all" />
            <div>
              <p className="mb-2 font-bold text-slate-500 text-xs">Avatar Color</p>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(c => (
                  <button key={c} onClick={() => setForm(f => ({...f, color: c}))}
                    className="border-2 rounded-full w-8 h-8 transition-all cursor-pointer"
                    style={{background: c, borderColor: form.color===c?"#1e293b":"transparent", transform: form.color===c?"scale(1.2)":"scale(1)"}} />
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setShowModal(false); setForm({...BLANK}); }}
              className="flex-1 bg-white py-3 border-2 border-slate-200 rounded-2xl font-extrabold text-slate-600 text-sm cursor-pointer">
              Cancel
            </button>
            <button onClick={handleCreate} disabled={loading}
              className="flex flex-[2] justify-center items-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 disabled:opacity-60 py-3 border-none rounded-2xl font-extrabold text-white text-sm cursor-pointer">
              {loading ? "Creating..." : <>Create Student <FaCheck /></>}
            </button>
          </div>
        </Modal>
      )}

      {/* Credentials modal */}
      {createdInfo && (
        <Modal onClose={() => setCreatedInfo(null)}>
          <div className="text-center">
            <div className="mb-3 text-5xl">
              <FaTrophy className="inline-block text-amber-500" />
            </div>
            <h3 className="mb-1 font-poppins font-black text-xl">Student Created!</h3>
            <p className="mb-5 text-slate-500 text-sm">Share these with <b>{createdInfo.name}</b></p>
            <div className="space-y-3 bg-slate-50 mb-4 p-4 rounded-2xl text-left">
              <div className="flex justify-between"><span className="font-bold text-slate-400 text-xs">LOGIN</span><span className="font-extrabold text-sm">{createdInfo.login}</span></div>
              <div className="bg-slate-200 h-px" />
              <div className="flex justify-between"><span className="font-bold text-slate-400 text-xs">PASSWORD</span><span className="font-extrabold text-sm">{createdInfo.password}</span></div>
            </div>
            <div className="bg-amber-50 mb-4 p-3 rounded-xl">
              <p className="flex justify-center items-center gap-2 font-bold text-amber-700 text-xs">
                <FaExclamationTriangle /> Save these! Password won't be shown again.
              </p>
            </div>
            <button onClick={() => setCreatedInfo(null)}
              className="flex justify-center items-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 py-3 border-none rounded-2xl w-full font-extrabold text-white text-sm cursor-pointer">
              Got it <FaCheck />
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

