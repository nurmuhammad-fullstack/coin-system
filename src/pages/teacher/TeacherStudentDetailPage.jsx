// src/pages/teacher/TeacherStudentDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Avatar, SectionLabel, Modal, Chip } from "../../components/ui";
import { Icon } from "../../components/Icons";

const QUICK_ACTIONS = [
  {
    label: "+50 Homework",
    amount: 50,
    type: "add",
    reason: "Homework completed",
  },
  { label: "+100 Behavior", amount: 100, type: "add", reason: "Good behavior" },
  {
    label: "+200 Project",
    amount: 200,
    type: "add",
    reason: "Project completed",
  },
  { label: "+150 Quiz", amount: 150, type: "add", reason: "Quiz bonus" },
  { label: "-30 Late HW", amount: 30, type: "sub", reason: "Late homework" },
  {
    label: "-50 Rule break",
    amount: 50,
    type: "sub",
    reason: "Rule violation",
  },
];

export default function TeacherStudentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    students,
    getStudentCoins,
    loadTransactions,
    getStudentTransactions,
    addCoins,
    removeCoins,
    updateStudent,
    deleteStudent,
    showToast,
    classes,
  } = useApp();

  const [modal, setModal] = useState(null); // "add" | "sub" | "class" | "delete"
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [delLoading, setDelLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");
  const [classLoading, setClassLoading] = useState(false);

  // Find student by _id
  const student = students.find((s) => s._id === id);

  // Load transactions on mount
  useEffect(() => {
    if (id && id !== "undefined") loadTransactions(id);
  }, [id, loadTransactions]);

  if (!id || id === "undefined") {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-slate-400 dark:text-slate-500">
        <div className="mb-3">
          <Icon name="warning" size={48} />
        </div>
        <p className="font-bold dark:text-white">Invalid student link</p>
        <button
          onClick={() => navigate("/teacher/students")}
          className="flex items-center gap-2 bg-brand-500 mt-4 px-5 py-2 border-none rounded-full font-bold text-white text-sm cursor-pointer"
        >
          <Icon name="chevronLeft" size={14} /> Back to Students
        </button>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-slate-400 dark:text-slate-500">
        <div className="mb-3">
          <Icon name="user" size={48} />
        </div>
        <p className="font-bold dark:text-white">Student not found</p>
        <button
          onClick={() => navigate("/teacher/students")}
          className="flex items-center gap-2 bg-brand-500 mt-4 px-5 py-2 border-none rounded-full font-bold text-white text-sm cursor-pointer"
        >
          <Icon name="chevronLeft" size={14} /> Back to Students
        </button>
      </div>
    );
  }

  const coins = getStudentCoins(student._id);
  const txs = getStudentTransactions(student._id);
  const otherClasses = classes.filter((c) => c.name !== student.class);

  const openClassModal = () => {
    setSelectedClass(otherClasses[0]?.name || "");
    setModal("class");
  };

  const handleManual = async () => {
    const n = parseInt(amount);
    if (!n || n <= 0) {
      showToast("❌ Enter a valid amount", "error");
      return;
    }
    if (modal === "add") {
      const result = await addCoins(student._id, n, reason || "Teacher Bonus");
      if (!result.ok) {
        showToast("❌ " + (result.message || "Failed to add coins"), "error");
        return;
      }
      showToast(`✅ +${n} coins added!`);
    } else {
      const result = await removeCoins(
        student._id,
        n,
        reason || "Teacher Deduction",
      );
      if (!result.ok) {
        showToast(
          "❌ " + (result.message || "Failed to remove coins"),
          "error",
        );
        return;
      }
      showToast(`✅ -${n} coins deducted!`);
    }
    setModal(null);
    setAmount("");
    setReason("");
  };

  const handleQuick = async (qa) => {
    if (qa.type === "add") {
      const result = await addCoins(student._id, qa.amount, qa.reason);
      if (!result.ok) {
        showToast("❌ " + (result.message || "Failed to add coins"), "error");
        return;
      }
      showToast(`✅ +${qa.amount} coins!`);
    } else {
      const result = await removeCoins(student._id, qa.amount, qa.reason);
      if (!result.ok) {
        showToast(
          "❌ " + (result.message || "Failed to remove coins"),
          "error",
        );
        return;
      }
      showToast(`✅ -${qa.amount} coins deducted!`);
    }
  };

  const handleClassChange = async () => {
    if (!selectedClass) {
      showToast("❌ Select a class", "error");
      return;
    }

    if (selectedClass === student.class) {
      setModal(null);
      return;
    }

    setClassLoading(true);
    const result = await updateStudent(student._id, { class: selectedClass });
    setClassLoading(false);

    if (!result.ok) {
      showToast("❌ " + (result.message || "Failed to move student"), "error");
      return;
    }

    showToast(`✅ Moved to ${selectedClass}`);
    setModal(null);
  };

  const handleDelete = async () => {
    setDelLoading(true);
    try {
      const result = await deleteStudent(student._id);
      if (!result.ok) {
        showToast(
          "❌ " + (result.message || "Failed to delete student"),
          "error",
        );
        return;
      }
      showToast(`🗑️ ${student.name} removed`);
      navigate("/teacher/students");
    } catch (err) {
      showToast("❌ " + (err.message || "Failed to delete student"), "error");
    } finally {
      setDelLoading(false);
    }
  };

  return (
    <div className="space-y-4 mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-0 max-w-7xl">
      {/* Back button */}
      <button
        onClick={() => navigate("/teacher/students")}
        className="group flex items-center gap-1.5 bg-transparent border-none font-black text-slate-400 hover:text-brand-500 transition-colors cursor-pointer p-0"
      >
        <div className="flex items-center justify-center h-full">
          <Icon name="chevronLeft" size={14} className="group-hover:-translate-x-0.5 transition-transform" />
        </div>
        <span className="text-sm leading-none pt-0.5">All Students</span>
      </button>

      {/* Desktop layout: 2 columns */}
      <div className="md:gap-6 space-y-4 md:space-y-0 md:grid md:grid-cols-3">
        {/* Left column — student info */}
        <div className="space-y-4 md:col-span-1">
          {/* Student card */}
          <div className="bg-white dark:bg-slate-800 p-6 border border-slate-100 dark:border-slate-700 rounded-3xl text-center shadow-sm">
            <div className="flex justify-center mb-3">
              <Avatar user={student} size={80} />
            </div>
            <h2 className="mb-2 font-poppins font-black text-slate-800 dark:text-white text-xl">
              {student.name}
            </h2>
            <div className="flex justify-center items-center gap-2">
              <Chip color="blue">{student.class}</Chip>
              <button
                onClick={openClassModal}
                disabled={otherClasses.length === 0}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 dark:bg-slate-700 dark:hover:bg-slate-600 px-2.5 py-1 border-none rounded-full font-black text-[10px] text-slate-500 dark:text-slate-300 uppercase tracking-tight transition-colors cursor-pointer disabled:cursor-not-allowed"
                title={
                  otherClasses.length === 0
                    ? "No other classes available"
                    : "Move to another class"
                }
              >
                <Icon name="exchange" size={10} />
                Move
              </button>
            </div>

            {/* Balance */}
            <div className="bg-slate-50 dark:bg-slate-900/50 mt-6 p-5 rounded-2xl border border-slate-100 dark:border-slate-700">
              <p className="opacity-80 mb-1 font-black text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-widest">
                Current Balance
              </p>
              <div className="flex justify-center items-center gap-2 mt-1">
                <Icon name="coins" size={24} className="text-amber-500" />
                <span className="font-poppins font-black text-slate-800 dark:text-white text-3xl">
                  {coins.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Email */}
            <p className="mt-4 font-bold text-slate-400 dark:text-slate-500 text-[11px] truncate">
              {student.email}
            </p>
          </div>

          {/* Action buttons */}
          <div className="gap-3 grid grid-cols-2">
            <button
              onClick={() => setModal("add")}
              className="flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 py-3.5 border-none rounded-2xl font-black text-white text-sm transition-all active:scale-95 cursor-pointer shadow-lg shadow-brand-500/20"
            >
              <Icon name="add" size={14} /> Add
            </button>
            <button
              onClick={() => setModal("sub")}
              className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 py-3.5 border-none rounded-2xl font-black text-white text-sm transition-all active:scale-95 cursor-pointer shadow-lg shadow-red-500/20"
            >
              <Icon name="remove" size={14} /> Remove
            </button>
          </div>

          {/* Quick actions */}
          <div className="bg-white dark:bg-slate-800 p-4 border border-slate-100 dark:border-slate-700 rounded-3xl shadow-sm">
            <SectionLabel>Quick Actions</SectionLabel>
            <div className="flex flex-wrap gap-2 mt-1">
              {QUICK_ACTIONS.map((qa) => (
                <button
                  key={qa.label}
                  onClick={() => handleQuick(qa)}
                  className={
                    "px-3 py-2 rounded-xl text-[11px] font-black border-none cursor-pointer transition-all active:scale-95 " +
                    (qa.type === "add"
                      ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500 hover:!text-white"
                      : "bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 hover:bg-red-500 hover:!text-white")
                  }
                >
                  {qa.label}
                </button>
              ))}
            </div>
          </div>

          {/* Delete student */}
          <button
            onClick={() => setModal("delete")}
            className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 py-3.5 border border-red-100 dark:border-red-900/30 rounded-2xl w-full font-black text-red-500 dark:text-red-400 text-sm transition-all cursor-pointer"
          >
            <Icon name="delete" size={16} /> Delete Student
          </button>
        </div>

        {/* Right column — transactions */}
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-slate-800 p-6 border border-slate-100 dark:border-slate-700 rounded-3xl shadow-sm h-full">
            <div className="flex justify-between items-center mb-6">
              <SectionLabel className="mb-0">Activity History</SectionLabel>
              <span className="font-black text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-wider">
                {txs.length} entries
              </span>
            </div>
            {txs.length === 0 ? (
              <div className="py-20 text-slate-400 dark:text-slate-500 text-center bg-slate-50/50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
                <div className="mb-3 flex justify-center">
                   <Icon name="history" size={40} className="text-slate-300 dark:text-slate-600" />
                </div>
                <p className="font-bold text-sm">
                  No activity recorded
                </p>
              </div>
            ) : (
              <div className="space-y-0 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
                {txs.map((tx) => {
                  const earn = tx.type === "earn";
                  return (
                    <div
                      key={tx._id || tx.id}
                      className="flex items-center gap-4 py-4 border-slate-50 dark:border-slate-700 last:border-0 border-b group"
                    >
                      <div
                        className={
                          "w-10 h-10 rounded-xl flex items-center justify-center text-sm flex-shrink-0 transition-transform group-hover:scale-110 " +
                          (earn
                            ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500"
                            : "bg-red-50 dark:bg-red-900/30 text-red-500")
                        }
                      >
                        {earn ? <Icon name="arrowUp" size={14} /> : <Icon name="arrowDown" size={14} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-slate-800 dark:text-white text-sm truncate">
                          {tx.label}
                        </p>
                        <p className="text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-tight">
                          {tx.date ||
                            new Date(tx.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={
                          "text-base font-black font-poppins " +
                          (earn
                            ? "text-emerald-500"
                            : "text-red-500")
                        }
                      >
                        {earn ? "+" : ""}
                        {tx.amount}
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
        <Modal
          onClose={() => {
            setModal(null);
            setAmount("");
            setReason("");
          }}
        >
          <h3 className="mb-6 font-poppins font-black text-slate-800 dark:text-white text-2xl">
            {modal === "add" ? "Deposit Coins" : "Withdraw Coins"}
          </h3>
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700 px-4 py-3.5 border-2 border-transparent focus-within:border-brand-400 rounded-2xl transition-all shadow-inner">
              <Icon name="coins" size={20} className="text-amber-500" />
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                min="1"
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none font-black text-slate-800 dark:text-slate-200 text-lg placeholder-slate-400"
              />
            </div>
            <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700 px-4 py-3.5 border-2 border-transparent focus-within:border-brand-400 rounded-2xl transition-all shadow-inner">
              <Icon name="edit" size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Reason for transaction"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none font-bold text-slate-800 dark:text-slate-200 text-sm placeholder-slate-400"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setModal(null);
                setAmount("");
                setReason("");
              }}
              className="flex-1 bg-white dark:bg-slate-700 py-4 border-2 border-slate-100 dark:border-slate-600 rounded-2xl font-black text-slate-400 dark:text-slate-400 text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleManual}
              className={
                "flex-[2] py-4 rounded-2xl font-black text-sm text-white border-none cursor-pointer shadow-lg " +
                (modal === "add"
                  ? "bg-brand-500 hover:bg-brand-600 shadow-brand-500/20"
                  : "bg-red-500 hover:bg-red-600 shadow-red-500/20")
              }
            >
              Update Balance
            </button>
          </div>
        </Modal>
      )}

      {/* Change Class Modal */}
      {modal === "class" && (
        <Modal
          onClose={() => {
            setModal(null);
            setSelectedClass("");
          }}
        >
          <h3 className="mb-2 font-poppins font-black text-slate-800 dark:text-white text-2xl">
            Move Student
          </h3>
          <p className="mb-5 text-slate-500 dark:text-slate-400 text-sm">
            Move{" "}
            <b className="text-slate-700 dark:text-white">{student.name}</b>{" "}
            from{" "}
            <b className="text-slate-700 dark:text-white">{student.class}</b>{" "}
            to another class.
          </p>

          {otherClasses.length === 0 ? (
            <div className="bg-slate-50 dark:bg-slate-700/60 p-4 rounded-2xl text-center">
              <Icon
                name="graduation"
                size={26}
                className="mx-auto mb-2 text-slate-300 dark:text-slate-500"
              />
              <p className="font-bold text-slate-500 dark:text-slate-300 text-sm">
                No other classes available
              </p>
            </div>
          ) : (
            <div className="space-y-2 mb-6">
              <SectionLabel>Target Class</SectionLabel>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-slate-50 dark:bg-slate-700 px-4 py-3.5 border-2 border-transparent focus:border-brand-400 rounded-2xl outline-none w-full font-black text-slate-800 dark:text-slate-200 text-sm transition-all"
              >
                {otherClasses.map((c) => (
                  <option key={c._id || c.id || c.name} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => {
                setModal(null);
                setSelectedClass("");
              }}
              className="flex-1 bg-white dark:bg-slate-700 py-4 border-2 border-slate-100 dark:border-slate-600 rounded-2xl font-black text-slate-400 dark:text-slate-400 text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleClassChange}
              disabled={classLoading || otherClasses.length === 0}
              className="flex flex-[2] justify-center items-center gap-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-60 py-4 border-none rounded-2xl font-black text-white text-sm shadow-lg shadow-brand-500/20 cursor-pointer"
            >
              {classLoading ? (
                "Moving..."
              ) : (
                <>
                  Move Student <Icon name="exchange" size={14} />
                </>
              )}
            </button>
          </div>
        </Modal>
      )}

      {/* Delete confirm modal */}
      {modal === "delete" && (
        <Modal onClose={() => setModal(null)}>
          <div className="text-center p-2">
            <div className="w-20 h-20 bg-red-50 dark:bg-red-900/30 rounded-3xl flex items-center justify-center mx-auto mb-5 text-red-500">
               <Icon name="delete" size={32} />
            </div>
            <h3 className="mb-2 font-poppins font-black text-slate-800 dark:text-white text-2xl">
              Terminate Student?
            </h3>
            <p className="mb-4 text-slate-500 dark:text-slate-400 text-sm">
              Are you sure you want to remove <b className="dark:text-white">{student.name}</b> from the system?
            </p>
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl border border-red-100 dark:border-red-900/30 mb-8">
               <p className="font-bold text-red-600 dark:text-red-400 text-xs leading-relaxed uppercase tracking-tighter">
                Warning: This action is irreversible. All student history and coin balance will be purged.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setModal(null)}
                className="flex-1 bg-white dark:bg-slate-700 py-4 border-2 border-slate-100 dark:border-slate-600 rounded-2xl font-black text-slate-400 text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={delLoading}
                className="flex-[2] bg-red-500 hover:bg-red-600 disabled:opacity-60 py-4 border-none rounded-2xl font-black text-white text-sm cursor-pointer shadow-lg shadow-red-500/20"
              >
                {delLoading ? "Processing..." : "Confirm Removal"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
