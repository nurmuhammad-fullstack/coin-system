// src/pages/teacher/TeacherStudentDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Avatar, SectionLabel, Modal, Chip } from "../../components/ui";

const QUICK_ACTIONS = [
  { label: "+50 Homework",   amount:  50, type: "add", reason: "Homework completed"  },
  { label: "+100 Behavior",  amount: 100, type: "add", reason: "Good behavior"        },
  { label: "+200 Project",   amount: 200, type: "add", reason: "Project completed"    },
  { label: "+150 Quiz",      amount: 150, type: "add", reason: "Quiz bonus"           },
  { label: "-30 Late HW",    amount:  30, type: "sub", reason: "Late homework"        },
  { label: "-50 Rule break", amount:  50, type: "sub", reason: "Rule violation"       },
];

export default function TeacherStudentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    students, getStudentCoins, loadTransactions,
    getStudentTransactions, addCoins, removeCoins,
    deleteStudent, showToast
  } = useApp();

  const [modal, setModal]         = useState(null); // "add" | "sub" | "delete"
  const [amount, setAmount]       = useState("");
  const [reason, setReason]       = useState("");
  const [delLoading, setDelLoading] = useState(false);

  // Find student by _id
  const student = students.find(s => s._id === id);

  // Load transactions on mount
  useEffect(() => {
    if (id && id !== "undefined") loadTransactions(id);
  }, [id]);

  if (!id || id === "undefined") {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-slate-400">
        <div className="mb-3 text-5xl">⚠️</div>
        <p className="font-bold">Invalid student link</p>
        <button onClick={() => navigate("/teacher/students")}
          className="bg-blue-500 mt-4 px-5 py-2 border-none rounded-full font-bold text-white text-sm cursor-pointer">
          ← Back to Students
        </button>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-slate-400">
        <div className="mb-3 text-5xl">👤</div>
        <p className="font-bold">Student not found</p>
        <button onClick={() => navigate("/teacher/students")}
          className="bg-blue-500 mt-4 px-5 py-2 border-none rounded-full font-bold text-white text-sm cursor-pointer">
          ← Back to Students
        </button>
      </div>
    );
  }

  const coins = getStudentCoins(student._id);
  const txs   = getStudentTransactions(student._id);

  const handleManual = async () => {
    const n = parseInt(amount);
    if (!n || n <= 0) { showToast("❌ Enter a valid amount", "error"); return; }
    if (modal === "add") {
      await addCoins(student._id, n, reason || "Teacher Bonus");
      showToast(`✅ +${n} coins added!`);
    } else {
      await removeCoins(student._id, n, reason || "Teacher Deduction");
      showToast(`✅ -${n} coins deducted!`);
    }
    setModal(null); setAmount(""); setReason("");
  };

  const handleQuick = async (qa) => {
    if (qa.type === "add") {
      await addCoins(student._id, qa.amount, qa.reason);
      showToast(`✅ +${qa.amount} coins!`);
    } else {
      await removeCoins(student._id, qa.amount, qa.reason);
      showToast(`✅ -${qa.amount} coins deducted!`);
    }
  };

  const handleDelete = async () => {
    setDelLoading(true);
    try {
      await deleteStudent(student._id);
      showToast(`🗑️ ${student.name} removed`);
      navigate("/teacher/students");
    } catch (err) {
      showToast("❌ " + (err.message || "Failed to delete"), "error");
    } finally {
      setDelLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-5 md:p-0">
      {/* Back button */}
      <button onClick={() => navigate("/teacher/students")}
        className="flex items-center gap-2 bg-transparent border-none font-bold text-slate-500 hover:text-slate-800 text-sm transition-colors cursor-pointer">
        ← All Students
      </button>

      {/* Desktop layout: 2 columns */}
      <div className="md:gap-6 space-y-4 md:space-y-0 md:grid md:grid-cols-3">

        {/* Left column — student info */}
        <div className="space-y-4 md:col-span-1">

          {/* Student card */}
          <div className="bg-white shadow-sm p-6 border border-slate-100 rounded-3xl text-center">
            <div className="flex justify-center mb-3">
              <Avatar user={student} size={72} />
            </div>
            <h2 className="mb-2 font-poppins font-black text-slate-800 text-xl">{student.name}</h2>
            <Chip color="blue">Class {student.class}</Chip>

            {/* Balance */}
            <div className="bg-gradient-to-br from-brand-500 to-brand-700 mt-5 p-4 rounded-2xl text-white">
              <p className="opacity-80 mb-1 font-bold text-xs uppercase tracking-wider">Balance</p>
              <div className="flex justify-center items-center gap-2">
                <span className="text-2xl">🪙</span>
                <span className="font-poppins font-black text-4xl">{coins.toLocaleString()}</span>
              </div>
            </div>

            {/* Email */}
            <p className="mt-3 font-medium text-slate-400 text-xs">{student.email}</p>
          </div>

          {/* Action buttons */}
          <div className="gap-3 grid grid-cols-2">
            <button onClick={() => setModal("add")}
              className="bg-gradient-to-r from-brand-500 to-brand-600 shadow-brand-200 shadow-lg hover:shadow-xl py-3.5 border-none rounded-2xl font-extrabold text-white text-sm transition-all cursor-pointer">
              ➕ Add
            </button>
            <button onClick={() => setModal("sub")}
              className="bg-gradient-to-r from-red-500 to-red-600 shadow-lg shadow-red-200 hover:shadow-xl py-3.5 border-none rounded-2xl font-extrabold text-white text-sm transition-all cursor-pointer">
              ➖ Remove
            </button>
          </div>

          {/* Quick actions */}
          <div className="bg-white shadow-sm p-4 border border-slate-100 rounded-2xl">
            <SectionLabel>Quick Actions</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {QUICK_ACTIONS.map(qa => (
                <button key={qa.label} onClick={() => handleQuick(qa)}
                  className={"px-3 py-1.5 rounded-full text-xs font-extrabold border-none cursor-pointer transition-all " +
                    (qa.type === "add" ? "bg-brand-50 text-brand-700 hover:bg-brand-100" : "bg-red-50 text-red-600 hover:bg-red-100")}>
                  {qa.label}
                </button>
              ))}
            </div>
          </div>

          {/* Delete student */}
          <button onClick={() => setModal("delete")}
            className="bg-red-50 hover:bg-red-100 py-3 border-2 border-red-100 rounded-2xl w-full font-extrabold text-red-500 text-sm transition-colors cursor-pointer">
            🗑️ Delete Student
          </button>
        </div>

        {/* Right column — transactions */}
        <div className="md:col-span-2">
          <div className="bg-white shadow-sm p-5 border border-slate-100 rounded-3xl">
            <div className="flex justify-between items-center mb-4">
              <SectionLabel>Transaction History</SectionLabel>
              <span className="font-bold text-slate-400 text-xs">{txs.length} transactions</span>
            </div>
            {txs.length === 0 ? (
              <div className="py-10 text-slate-400 text-center">
                <div className="mb-2 text-4xl">📭</div>
                <p className="font-bold text-sm">No transactions yet</p>
              </div>
            ) : (
              <div className="space-y-0 max-h-[500px] overflow-y-auto">
                {txs.map(tx => {
                  const earn = tx.type === "earn";
                  return (
                    <div key={tx._id || tx.id} className="flex items-center gap-3 py-3 border-slate-50 last:border-0 border-b">
                      <div className={"w-10 h-10 rounded-full flex items-center justify-center text-sm flex-shrink-0 " +
                        (earn ? "bg-brand-50 text-brand-600" : "bg-red-50 text-red-500")}>
                        {earn ? "↑" : "↓"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-800 text-sm truncate">{tx.label}</p>
                        <p className="text-slate-400 text-xs">{tx.date || new Date(tx.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={"text-sm font-black " + (earn ? "text-brand-600" : "text-red-500")}>
                        {earn ? "+" : ""}{tx.amount}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add / Remove Coins Modal */}
      {(modal === "add" || modal === "sub") && (
        <Modal onClose={() => { setModal(null); setAmount(""); setReason(""); }}>
          <h3 className="mb-5 font-poppins font-black text-slate-800 text-xl">
            {modal === "add" ? "➕ Add Coins" : "➖ Remove Coins"}
          </h3>
          <div className="space-y-3 mb-5">
            <div className="flex items-center gap-3 bg-slate-50 focus-within:bg-white px-4 py-3 border-2 border-transparent focus-within:border-brand-400 rounded-xl transition-all">
              <span>🪙</span>
              <input type="number" placeholder="Amount" value={amount} min="1"
                onChange={e => setAmount(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none font-bold text-slate-800 text-sm placeholder-slate-400" />
            </div>
            <div className="flex items-center gap-3 bg-slate-50 focus-within:bg-white px-4 py-3 border-2 border-transparent focus-within:border-brand-400 rounded-xl transition-all">
              <span>📝</span>
              <input type="text" placeholder="Reason (optional)" value={reason}
                onChange={e => setReason(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none font-bold text-slate-800 text-sm placeholder-slate-400" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setModal(null); setAmount(""); setReason(""); }}
              className="flex-1 bg-white py-3 border-2 border-slate-200 rounded-2xl font-extrabold text-slate-600 text-sm cursor-pointer">
              Cancel
            </button>
            <button onClick={handleManual}
              className={"flex-[2] py-3 rounded-2xl font-extrabold text-sm text-white border-none cursor-pointer shadow-lg " +
                (modal === "add"
                  ? "bg-gradient-to-r from-brand-500 to-brand-600 shadow-brand-200"
                  : "bg-gradient-to-r from-red-500 to-red-600 shadow-red-200")}>
              Confirm
            </button>
          </div>
        </Modal>
      )}

      {/* Delete confirm modal */}
      {modal === "delete" && (
        <Modal onClose={() => setModal(null)}>
          <div className="text-center">
            <div className="mb-3 text-5xl">🗑️</div>
            <h3 className="mb-2 font-poppins font-black text-slate-800 text-xl">Delete Student?</h3>
            <p className="mb-2 text-slate-500 text-sm">
              Are you sure you want to delete <b>{student.name}</b>?
            </p>
            <p className="mb-6 font-bold text-red-400 text-xs">⚠️ This action cannot be undone!</p>
            <div className="flex gap-3">
              <button onClick={() => setModal(null)}
                className="flex-1 bg-white py-3 border-2 border-slate-200 rounded-2xl font-extrabold text-slate-600 text-sm cursor-pointer">
                Cancel
              </button>
              <button onClick={handleDelete} disabled={delLoading}
                className="flex-[2] bg-gradient-to-r from-red-500 to-red-600 disabled:opacity-60 py-3 border-none rounded-2xl font-extrabold text-white text-sm cursor-pointer">
                {delLoading ? "Deleting..." : "Yes, Delete 🗑️"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
