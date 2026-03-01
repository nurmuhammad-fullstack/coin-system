// src/pages/student/StudentWalletPage.jsx
import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { Card, TxItem, SectionLabel } from "../../components/ui";
import { FaCoins, FaArrowUp, FaArrowDown, FaSyncAlt } from "react-icons/fa";

const FILTERS = ["All", "Earned", "Spent"];

export default function StudentWalletPage() {
  const { currentUser, getStudentCoins, getStudentTransactions, loadTransactions } = useApp();
  const [filter, setFilter] = useState("All");

  // Load transactions on mount
  useEffect(() => {
    if (currentUser?._id) {
      loadTransactions(currentUser._id);
    }
  }, [currentUser?._id, loadTransactions]);

  const coins = getStudentCoins(currentUser._id);
  const allTxs = getStudentTransactions(currentUser._id);
  const txs = allTxs.filter(t =>
    filter === "All" ? true : filter === "Earned" ? t.type === "earn" : t.type === "spend"
  );

  const totalEarned = allTxs.filter(t => t.type === "earn").reduce((a, t) => a + t.amount, 0);
  const totalSpent  = allTxs.filter(t => t.type === "spend").reduce((a, t) => a + Math.abs(t.amount), 0);

  return (
    <div className="space-y-4 p-5">
      <div className="flex justify-between items-center">
        <h2 className="font-poppins font-black text-slate-800 text-2xl">My Wallet</h2>
        <button className="bg-transparent border-none text-xl cursor-pointer">
          <FaSyncAlt className="text-slate-400 hover:text-slate-600" />
        </button>
      </div>

      {/* Balance card */}
      <Card className="p-6 text-center">
        <p className="mb-2 font-extrabold text-slate-400 text-xs uppercase tracking-wider">Total Balance</p>
        <div className="flex justify-center items-center gap-2 mb-1">
          <FaCoins className="text-amber-500 text-2xl" />
          <span className="font-poppins font-black text-slate-800 text-5xl">{coins.toLocaleString()}</span>
        </div>
        <div className="flex justify-center items-center gap-1.5 mt-2">
          <div className="bg-brand-500 rounded-full w-2 h-2" />
          <span className="font-medium text-slate-400 text-xs">Last updated: just now</span>
        </div>
      </Card>

      {/* Stats */}
      <div className="gap-3 grid grid-cols-2">
        <Card className="p-4 text-center">
          <p className="mb-1 text-2xl">
            <FaArrowUp className="text-brand-500" />
          </p>
          <p className="font-black text-brand-600 text-xl">+{totalEarned.toLocaleString()}</p>
          <p className="mt-0.5 font-bold text-slate-400 text-xs">Total Earned</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="mb-1 text-2xl">
            <FaArrowDown className="text-red-500" />
          </p>
          <p className="font-black text-red-500 text-xl">-{totalSpent.toLocaleString()}</p>
          <p className="mt-0.5 font-bold text-slate-400 text-xs">Total Spent</p>
        </Card>
      </div>

      {/* Filter tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all border-none cursor-pointer
              ${filter === f ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 bg-transparent"}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Transactions */}
      <Card className="p-4">
        <SectionLabel>Transactions</SectionLabel>
        {txs.length === 0 && <p className="py-6 text-slate-400 text-sm text-center">No transactions found</p>}
        {txs.map(tx => <TxItem key={tx._id || tx.id} tx={tx} />)}
      </Card>
    </div>
  );
}
