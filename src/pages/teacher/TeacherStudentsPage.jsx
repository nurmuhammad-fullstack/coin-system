// src/pages/teacher/TeacherStudentsPage.jsx
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Avatar, SectionLabel, Modal } from "../../components/ui";
import { Icon } from "../../components/Icons";
import {
  FaPlus,
  FaTrophy,
  FaUserPlus,
  FaCheck,
  FaExclamationTriangle,
} from "react-icons/fa";

const BLANK = {
  email: "",
  name: "",
  password: "",
  class: "",
  color: "#10b981", // Default professional emerald
  useExistingClass: "yes",
};

export default function TeacherStudentsPage() {
  const { students, getStudentCoins, getStudentTransactions, createStudent, createClass, showToast, classes } =
    useApp();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [classFilter, setClassFilter] = useState(() => {
    const classParam = searchParams.get("class");
    return classParam || "All";
  });
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...BLANK });
  const [loading, setLoading] = useState(false);
  const [createdInfo, setCreatedInfo] = useState(null);

  // Use classes from context (auto-updated when new class is added)
  const classOptions = ["All", ...classes.map((c) => c.name)];
  const filtered = students
    .filter((s) => classFilter === "All" || s.class === classFilter)
    .sort((a, b) => getStudentCoins(b._id) - getStudentCoins(a._id));

  // --- Advanced Metrics Calculations ---
  const totalQuizzesTaken = filtered.reduce((acc, s) => {
    const txs = getStudentTransactions(s._id);
    return acc + txs.filter(t => t.type === 'earn').length;
  }, 0);

  const totalSpent = filtered.reduce((acc, s) => {
    const txs = getStudentTransactions(s._id);
    return acc + txs.filter(t => t.type === 'spend').reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }, 0);

  const topStudent = filtered[0];
  const topCoins = topStudent ? getStudentCoins(topStudent._id) : 0;

  const handleCreate = async () => {
    // Trim whitespace
    const trimmedEmail = form.email?.trim() || "";
    const trimmedName = form.name?.trim() || "";
    const trimmedPassword = form.password?.trim() || "";
    const trimmedClassName = form.class?.trim() || "";

    if (!trimmedEmail || !trimmedName || !trimmedPassword) {
      showToast("❌ Fill in email, name and password", "error");
      return;
    }

    if (!trimmedClassName) {
      showToast("❌ Please select or enter a class", "error");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      showToast("❌ Please enter a valid email address", "error");
      return;
    }

    setLoading(true);
    try {
      // 1. If it's a new class, create it first
      if (form.useExistingClass === "no") {
        const classExists = classes.some(c => c.name.toLowerCase() === trimmedClassName.toLowerCase());
        if (!classExists) {
          try {
            await createClass({ name: trimmedClassName });
          } catch (e) {
            console.error("Class creation failed (might already exist):", e);
            // We continue anyway, maybe it exists but wasn't in our local list
          }
        }
      }

      // 2. Create the student
      const payload = {
        email: trimmedEmail,
        name: trimmedName,
        password: trimmedPassword,
        class: trimmedClassName,
        color: "#10b981", // Force professional emerald for all students
        avatar: trimmedName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2),
      };

      const result = await createStudent(payload);

      if (!result.ok) {
        showToast("❌ " + (result.message || "Failed"), "error");
        return;
      }

      setCreatedInfo({
        login: trimmedEmail,
        password: trimmedPassword,
        name: trimmedName,
      });
      setShowModal(false);
      setForm({ ...BLANK });
      showToast("✅ " + trimmedName + " added!");
    } catch (err) {
      showToast("❌ " + (err.message || "Failed to create student"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-5 mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-0 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-widest">
            Overview
          </p>
          <h2 className="font-poppins font-black text-slate-800 dark:text-white text-2xl md:text-3xl">
            My Students
          </h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 px-5 py-2.5 border-none rounded-full font-extrabold text-white text-sm transition-colors cursor-pointer"
        >
          <FaPlus /> Add Student
        </button>
      </div>

      {/* Stats Section */}
      <div className="gap-3 grid grid-cols-2 lg:grid-cols-4">
        <StatCard 
          label="Total Students" 
          value={filtered.length} 
          icon="users" 
          color="text-brand-500"
          bgColor="bg-brand-50 dark:bg-brand-500/10" 
        />
        <StatCard 
          label="Tests Completed" 
          value={totalQuizzesTaken.toLocaleString()} 
          icon="test" 
          color="text-amber-500"
          bgColor="bg-amber-50 dark:bg-amber-500/10" 
        />
        <StatCard 
          label="Reward Volume" 
          value={totalSpent.toLocaleString()} 
          icon="shop" 
          color="text-emerald-500"
          bgColor="bg-emerald-50 dark:bg-emerald-500/10" 
        />
        <StatCard 
          label={topStudent ? `Leader: ${topStudent.name.split(' ')[0]}` : "Top Performance"} 
          value={topCoins.toLocaleString()} 
          icon="award" 
          color="text-indigo-500"
          bgColor="bg-indigo-50 dark:bg-indigo-500/10"
        />
      </div>

      {/* Class filter */}
      <div
        className="flex gap-2 pb-1 overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        {classOptions.map((c) => (
          <button
            key={c}
            onClick={() => setClassFilter(c)}
            className={
              "px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap border-none cursor-pointer transition-all " +
              (classFilter === c
                ? "bg-slate-800 dark:bg-slate-600 text-white"
                : "bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300")
            }
          >
            {c === "All" ? "All Students" : c}
          </button>
        ))}
      </div>

      {/* Students list */}
      <div className="space-y-4">
        <div className="flex justify-between items-end">
          <SectionLabel className="mb-0">Leaderboard</SectionLabel>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">
            {filtered.length} students total
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 bg-white dark:bg-slate-800/50 border-2 border-dashed border-slate-100 dark:border-slate-700/50 rounded-3xl text-center">
            <div className="mb-4 flex justify-center">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center">
                <Icon name="users" size={32} className="text-slate-300 dark:text-slate-600" />
              </div>
            </div>
            <p className="font-black text-slate-800 dark:text-white text-lg">
              No students found
            </p>
            <p className="mt-1 text-slate-400 dark:text-slate-500 text-sm max-w-xs mx-auto">
              Start building your class by adding your first student today.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((s, i) => {
              const coins = getStudentCoins(s._id);
              const isTop3 = i < 3;
              const rankColors = [
                "border-amber-400 bg-amber-50/30 dark:bg-amber-900/10", // Gold
                "border-slate-300 bg-slate-50/50 dark:bg-slate-800/20", // Silver
                "border-orange-300 bg-orange-50/30 dark:bg-orange-900/10", // Bronze
              ];

              return (
                <div
                  key={s._id}
                  className={`relative flex flex-col p-5 rounded-3xl border-2 transition-all ${
                    isTop3 
                      ? rankColors[i] + " z-10" 
                      : "bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-700"
                  }`}
                >
                  {/* Rank Badge */}
                  <div className={`absolute -top-3 -left-2 w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shadow-sm transform -rotate-12 ${
                    i === 0 ? "bg-amber-400 text-white" :
                    i === 1 ? "bg-slate-400 text-white" :
                    i === 2 ? "bg-orange-400 text-white" :
                    "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                  }`}>
                    {i + 1}
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <Avatar user={s} size={56} />
                      {isTop3 && (
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm">
                          <Icon 
                            name={i === 0 ? "crown" : "award"} 
                            size={12} 
                            className={i === 0 ? "text-amber-500" : i === 1 ? "text-slate-400" : "text-orange-500"} 
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-slate-800 dark:text-white text-base truncate">
                        {s.name}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-[10px] font-extrabold uppercase tracking-tight">
                          {s.class}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">
                        Current Balance
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Icon name="coins" size={16} className="text-amber-500" />
                        <span className="font-poppins font-black text-slate-800 dark:text-white text-xl">
                          {coins.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => navigate("/teacher/students/" + s._id)}
                      className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center text-slate-300 dark:text-slate-600 hover:!bg-brand-500 hover:!text-white hover:scale-[1.05] active:scale-95 transition-all duration-200 cursor-pointer border-none shadow-sm"
                    >
                      <Icon name="chevronRight" size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {showModal && (
        <Modal
          onClose={() => {
            setShowModal(false);
            setForm({ ...BLANK });
          }}
        >
          <h3 className="flex items-center gap-2 mb-5 font-poppins font-black text-slate-800 dark:text-white text-xl">
            <FaUserPlus /> Add New Student
          </h3>
          <div className="space-y-3 mb-4">
            <input
              type="email"
              placeholder="Email address*"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              className="bg-slate-50 dark:bg-slate-700 px-4 py-3 border-2 border-transparent focus:border-brand-400 rounded-xl outline-none w-full font-medium text-slate-800 dark:text-slate-200 text-sm transition-all"
            />
            <input
              type="text"
              placeholder="Full name*"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="bg-slate-50 dark:bg-slate-700 px-4 py-3 border-2 border-transparent focus:border-brand-400 rounded-xl outline-none w-full font-medium text-slate-800 dark:text-slate-200 text-sm transition-all"
            />
            <input
              type="text"
              placeholder="Password* (e.g. student123)"
              value={form.password}
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              className="bg-slate-50 dark:bg-slate-700 px-4 py-3 border-2 border-transparent focus:border-brand-400 rounded-xl outline-none w-full font-medium text-slate-800 dark:text-slate-200 text-sm transition-all"
            />
            {classes.length > 0 && (
              <>
                <div className="flex gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({ ...f, useExistingClass: "yes" }))
                    }
                    className={`flex-1 py-2 rounded-lg text-xs font-bold border-none cursor-pointer transition-all ${form.useExistingClass === "yes" ? "bg-brand-500 text-white" : "bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300"}`}
                  >
                    Select Existing Class
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        useExistingClass: "no",
                        class: "",
                      }))
                    }
                    className={`flex-1 py-2 rounded-lg text-xs font-bold border-none cursor-pointer transition-all ${form.useExistingClass === "no" ? "bg-brand-500 text-white" : "bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300"}`}
                  >
                    Create New Class
                  </button>
                </div>
                {form.useExistingClass === "yes" ? (
                  <select
                    value={form.class}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, class: e.target.value }))
                    }
                    className="bg-slate-50 dark:bg-slate-700 px-4 py-3 border-2 border-transparent focus:border-brand-400 rounded-xl outline-none w-full font-medium text-slate-800 dark:text-slate-200 text-sm transition-all"
                  >
                    <option value="">Select a class</option>
                    {classes.map((c) => (
                      <option key={c._id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="New class name (e.g. 8-B)"
                    value={form.class}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, class: e.target.value }))
                    }
                    className="bg-slate-50 dark:bg-slate-700 px-4 py-3 border-2 border-transparent focus:border-brand-400 rounded-xl outline-none w-full font-medium text-slate-800 dark:text-slate-200 text-sm transition-all"
                  />
                )}
              </>
            )}
            {classes.length === 0 && (
              <input
                type="text"
                placeholder="Class (e.g. 8-B)"
                value={form.class}
                onChange={(e) =>
                  setForm((f) => ({ ...f, class: e.target.value }))
                }
                className="bg-slate-50 dark:bg-slate-700 px-4 py-3 border-2 border-transparent focus:border-brand-400 rounded-xl outline-none w-full font-medium text-slate-800 dark:text-slate-200 text-sm transition-all"
              />
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowModal(false);
                setForm({ ...BLANK });
              }}
              className="flex-1 bg-white dark:bg-slate-700 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-2xl font-extrabold text-slate-600 dark:text-slate-300 text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={loading}
              className="flex flex-[2] justify-center items-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 py-3 border-none rounded-2xl font-extrabold text-white text-sm cursor-pointer"
            >
              {loading ? (
                "Creating..."
              ) : (
                <>
                  Create Student <FaCheck />
                </>
              )}
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
            <h3 className="mb-1 font-poppins font-black dark:text-white text-xl">
              Student Created!
            </h3>
            <p className="mb-5 text-slate-500 dark:text-slate-400 text-sm">
              Share these with{" "}
              <b className="dark:text-white">{createdInfo.name}</b>
            </p>
            <div className="space-y-3 bg-slate-50 dark:bg-slate-700 mb-4 p-4 rounded-2xl text-left">
              <div className="flex justify-between">
                <span className="font-bold text-slate-400 dark:text-slate-500 text-xs">
                  EMAIL
                </span>
                <span className="font-extrabold dark:text-white text-sm">
                  {createdInfo.login}
                </span>
              </div>
              <div className="bg-slate-200 dark:bg-slate-600 h-px" />
              <div className="flex justify-between">
                <span className="font-bold text-slate-400 dark:text-slate-500 text-xs">
                  PASSWORD
                </span>
                <span className="font-extrabold dark:text-white text-sm">
                  {createdInfo.password}
                </span>
              </div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/30 mb-4 p-3 rounded-xl">
              <p className="flex justify-center items-center gap-2 font-bold text-amber-700 dark:text-amber-400 text-xs">
                <FaExclamationTriangle /> Save these! Password won't be shown
                again.
              </p>
            </div>
            <button
              onClick={() => setCreatedInfo(null)}
              className="flex justify-center items-center gap-2 bg-brand-500 hover:bg-brand-600 py-3 border-none rounded-2xl w-full font-extrabold text-white text-sm cursor-pointer"
            >
              Got it <FaCheck />
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

const StatCard = ({ label, value, icon, color, bgColor, className = "" }) => (
  <div className={`bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-start ${className}`}>
    <div className={`w-10 h-10 ${bgColor} rounded-2xl flex items-center justify-center ${color} mb-3`}>
      <Icon name={icon} size={18} />
    </div>
    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-1">
      {label}
    </p>
    <p className="font-poppins font-black text-2xl text-slate-800 dark:text-white leading-none">
      {value}
    </p>
  </div>
);
