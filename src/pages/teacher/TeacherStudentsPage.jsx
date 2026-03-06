// src/pages/teacher/TeacherStudentsPage.jsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Avatar, SectionLabel, Modal } from "../../components/ui";
import { FaPlus, FaUsers, FaCoins, FaTrophy, FaMedal, FaUserPlus, FaCheck, FaExclamationTriangle } from "react-icons/fa";

const COLORS = ["#22c55e","#3b82f6","#f97316","#8b5cf6","#ef4444","#eab308","#06b6d4","#ec4899"];
const BLANK  = { email: "", name: "", password: "", class: "", color: "#22c55e", useExistingClass: "yes" };

export default function TeacherStudentsPage() {
  const { students, getStudentCoins, createStudent, showToast, classes } = useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [classFilter, setClassFilter] = useState(() => {
    const classParam = searchParams.get("class");
    return classParam || "All";
  });
  const [showModal, setShowModal]     = useState(false);
  const [form, setForm]               = useState({ ...BLANK });
  const [loading, setLoading]         = useState(false);
  const [createdInfo, setCreatedInfo] = useState(null);

  // Use classes from context (auto-updated when new class is added)
  const classOptions = ["All", ...classes.map(c => c.name)];
  const filtered = students
    .filter(s => classFilter === "All" || s.class === classFilter)
    .sort((a, b) => getStudentCoins(b._id) - getStudentCoins(a._id));

  const avgCoins = filtered.length
    ? Math.round(filtered.reduce((a, s) => a + getStudentCoins(s._id), 0) / filtered.length) : 0;
  const topCoins = filtered.length ? getStudentCoins(filtered[0]?._id) : 0;

  const handleCreate = async () => {
    // Trim whitespace
    const trimmedEmail = form.email?.trim() || '';
    const trimmedName = form.name?.trim() || '';
    const trimmedPassword = form.password?.trim() || '';
    
    console.log('Form data before create:', { ...form, password: '***' });
    
    if (!trimmedEmail || !trimmedName || !trimmedPassword) {
      showToast("❌ Fill in email, name and password", "error"); return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      showToast("❌ Please enter a valid email address", "error"); return;
    }
    
    setLoading(true);
    try {
      const { useExistingClass, ...studentData } = form;
      const payload = {
        ...studentData,
        email: trimmedEmail,
        name: trimmedName,
        password: trimmedPassword,
        avatar: trimmedName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2),
      };
      console.log('Sending create-student request:', { ...payload, password: '***' });
      
      const result = await createStudent(payload);
      
      if (!result.ok) {
        // Handle specific error cases with better messages
        let errorMessage = result.message || "Failed";
        
        if (errorMessage.toLowerCase().includes('email already registered') || errorMessage.includes('Email already registered')) {
          errorMessage = "❌ This email is already registered. Please use a different email.";
        } else if (errorMessage.toLowerCase().includes('email already in use') || errorMessage.includes('Email already in use')) {
          errorMessage = "❌ This email is already in use. Please try another one.";
        } else {
          errorMessage = "❌ " + errorMessage;
        }
        
        showToast(errorMessage, "error");
        return;
      }
      
      setCreatedInfo({ login: trimmedEmail, password: trimmedPassword, name: trimmedName });
      setShowModal(false);
      setForm({ ...BLANK });
      showToast("✅ " + form.name + " added!");
    } catch (err) {
      console.error('Create student error:', err);
      showToast("❌ " + (err.message || "Failed to create student"), "error");
    } finally {
      setLoading(false);
    }
  };

  const medals = [<FaMedal className="text-yellow-500" />, <FaMedal className="text-gray-400" />, <FaMedal className="text-amber-600" />];

  return (
    <div className="space-y-5 mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-0 max-w-7xl">

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-slate-500 dark:text-slate-400 text-xs">Teacher Dashboard</p>
          <h2 className="font-poppins font-black text-slate-800 dark:text-white text-2xl md:text-3xl">My Students</h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 px-5 py-2.5 border-none rounded-full font-extrabold text-white text-sm transition-colors cursor-pointer"
        >
          <FaPlus /> Add Student
        </button>
      </div>

      {/* Stats */}
      <div className="gap-3 grid grid-cols-2 md:grid-cols-3">
        <div className="bg-gradient-to-br from-brand-500 to-brand-700 p-5 rounded-2xl text-white text-center">
          <p className="opacity-80 mb-1 font-bold text-xs uppercase tracking-wider">Students</p>
          <p className="font-poppins font-black text-4xl">{filtered.length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-5 rounded-2xl text-white text-center">
          <p className="opacity-80 mb-1 font-bold text-xs uppercase tracking-wider">Avg. Coins</p>
          <p className="font-poppins font-black text-4xl">{avgCoins}</p>
        </div>
        <div className="hidden md:block bg-gradient-to-br from-amber-500 to-amber-600 p-5 rounded-2xl text-white text-center">
          <p className="opacity-80 mb-1 font-bold text-xs uppercase tracking-wider">Top Score</p>
          <p className="font-poppins font-black text-4xl">{topCoins}</p>
        </div>
      </div>

{/* Class filter */}
      <div className="flex gap-2 pb-1 overflow-x-auto" style={{scrollbarWidth:"none"}}>
        {classOptions.map(c => (
          <button key={c} onClick={() => setClassFilter(c)}
            className={"px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap border-none cursor-pointer transition-all " +
              (classFilter === c ? "bg-slate-800 dark:bg-slate-600 text-white" : "bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300")}>
            {c === "All" ? "All Classes" : "Class " + c}
          </button>
        ))}
      </div>

      {/* Students list */}
      <div>
        <SectionLabel>Leaderboard — tap to manage</SectionLabel>
        {filtered.length === 0 ? (
          <div className="py-12 text-slate-400 dark:text-slate-500 text-center">
            <div className="mb-3 text-5xl">
              <FaUsers className="inline-block text-slate-300 dark:text-slate-600" />
            </div>
            <p className="font-bold dark:text-slate-400 text-sm">No students yet</p>
            <p className="mt-1 text-xs">Tap "Add Student" to get started</p>
          </div>
        ) : (
          <div className="gap-3 grid grid-cols-1 md:grid-cols-2">
            {filtered.map((s, i) => (
              <div key={s._id} onClick={() => navigate("/teacher/students/" + s._id)}
                className="flex items-center gap-3 bg-white dark:bg-slate-800 p-4 border border-transparent hover:border-slate-100 dark:hover:border-slate-700 rounded-2xl transition-all cursor-pointer">
                <span className="w-7 font-black text-base text-center">{medals[i] || "#" + (i+1)}</span>
                <Avatar user={s} size={44} />
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-slate-800 dark:text-white text-sm truncate">{s.name}</p>
                  <p className="text-slate-400 dark:text-slate-500 text-xs">Class {s.class}</p>
                </div>
                <div className="flex items-center gap-1.5 bg-brand-50 dark:bg-brand-900/30 px-3 py-1 rounded-full">
                  <FaCoins className="text-amber-500 text-sm" />
                  <span className="font-black text-brand-700 dark:text-brand-400 text-sm">{getStudentCoins(s._id).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {showModal && (
        <Modal onClose={() => { setShowModal(false); setForm({...BLANK}); }}>
          <h3 className="flex items-center gap-2 mb-5 font-poppins font-black text-slate-800 dark:text-white text-xl">
            <FaUserPlus /> Add New Student
          </h3>
          <div className="space-y-3 mb-4">
            <input type="email" placeholder="Email address *" value={form.email}
              onChange={e => setForm(f => ({...f, email: e.target.value}))}
              className="bg-slate-50 dark:bg-slate-700 px-4 py-3 border-2 border-transparent focus:border-brand-400 rounded-xl outline-none w-full font-medium text-slate-800 dark:text-slate-200 text-sm transition-all" />
            <input type="text" placeholder="Full name *" value={form.name}
              onChange={e => setForm(f => ({...f, name: e.target.value}))}
              className="bg-slate-50 dark:bg-slate-700 px-4 py-3 border-2 border-transparent focus:border-brand-400 rounded-xl outline-none w-full font-medium text-slate-800 dark:text-slate-200 text-sm transition-all" />
            <input type="text" placeholder="Password * (e.g. student123)" value={form.password}
              onChange={e => setForm(f => ({...f, password: e.target.value}))}
              className="bg-slate-50 dark:bg-slate-700 px-4 py-3 border-2 border-transparent focus:border-brand-400 rounded-xl outline-none w-full font-medium text-slate-800 dark:text-slate-200 text-sm transition-all" />
            {classes.length > 0 && (
              <>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setForm(f => ({...f, useExistingClass: "yes"}))}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold border-none cursor-pointer transition-all ${form.useExistingClass === "yes" ? "bg-brand-500 text-white" : "bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300"}`}
                  >
                    Select Existing Class
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm(f => ({...f, useExistingClass: "no", class: ""}))}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold border-none cursor-pointer transition-all ${form.useExistingClass === "no" ? "bg-brand-500 text-white" : "bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300"}`}
                  >
                    Create New Class
                  </button>
                </div>
                {form.useExistingClass === "yes" ? (
                  <select
                    value={form.class}
                    onChange={e => setForm(f => ({...f, class: e.target.value}))}
                    className="bg-slate-50 dark:bg-slate-700 px-4 py-3 border-2 border-transparent focus:border-brand-400 rounded-xl outline-none w-full font-medium text-slate-800 dark:text-slate-200 text-sm transition-all"
                  >
                    <option value="">Select a class</option>
                    {classes.map(c => (
                      <option key={c._id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                ) : (
                  <input type="text" placeholder="New class name (e.g. 8-B)" value={form.class}
                    onChange={e => setForm(f => ({...f, class: e.target.value}))}
                    className="bg-slate-50 dark:bg-slate-700 px-4 py-3 border-2 border-transparent focus:border-brand-400 rounded-xl outline-none w-full font-medium text-slate-800 dark:text-slate-200 text-sm transition-all" />
                )}
              </>
            )}
            {classes.length === 0 && (
              <input type="text" placeholder="Class (e.g. 8-B)" value={form.class}
                onChange={e => setForm(f => ({...f, class: e.target.value}))}
                className="bg-slate-50 dark:bg-slate-700 px-4 py-3 border-2 border-transparent focus:border-brand-400 rounded-xl outline-none w-full font-medium text-slate-800 dark:text-slate-200 text-sm transition-all" />
            )}
            <div>
              <p className="mb-2 font-bold text-slate-500 dark:text-slate-400 text-xs">Avatar Color</p>
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
              className="flex-1 bg-white dark:bg-slate-700 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-2xl font-extrabold text-slate-600 dark:text-slate-300 text-sm cursor-pointer">
              Cancel
            </button>
            <button onClick={handleCreate} disabled={loading}
              className="flex flex-[2] justify-center items-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 py-3 border-none rounded-2xl font-extrabold text-white text-sm cursor-pointer">
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
            <h3 className="mb-1 font-poppins font-black dark:text-white text-xl">Student Created!</h3>
            <p className="mb-5 text-slate-500 dark:text-slate-400 text-sm">Share these with <b className="dark:text-white">{createdInfo.name}</b></p>
            <div className="space-y-3 bg-slate-50 dark:bg-slate-700 mb-4 p-4 rounded-2xl text-left">
              <div className="flex justify-between"><span className="font-bold text-slate-400 dark:text-slate-500 text-xs">EMAIL</span><span className="font-extrabold dark:text-white text-sm">{createdInfo.login}</span></div>
              <div className="bg-slate-200 dark:bg-slate-600 h-px" />
              <div className="flex justify-between"><span className="font-bold text-slate-400 dark:text-slate-500 text-xs">PASSWORD</span><span className="font-extrabold dark:text-white text-sm">{createdInfo.password}</span></div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/30 mb-4 p-3 rounded-xl">
              <p className="flex justify-center items-center gap-2 font-bold text-amber-700 dark:text-amber-400 text-xs">
                <FaExclamationTriangle /> Save these! Password won't be shown again.
              </p>
            </div>
            <button onClick={() => setCreatedInfo(null)}
              className="flex justify-center items-center gap-2 bg-brand-500 hover:bg-brand-600 py-3 border-none rounded-2xl w-full font-extrabold text-white text-sm cursor-pointer">
              Got it <FaCheck />
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

