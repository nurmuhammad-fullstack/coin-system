// src/pages/student/StudentRewardsPage.jsx
import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Modal } from "../../components/ui";

const ALL_CATEGORIES = ["All Rewards", "School Supplies", "Snacks", "Academic", "Fun"];

export default function StudentRewardsPage() {
  const { currentUser, getStudentCoins, shopItems, spendCoins, showToast } = useApp();
  const [category, setCategory] = useState("All Rewards");
  const [selected, setSelected] = useState(null);

  const coins   = getStudentCoins(currentUser._id);
  const items   = shopItems.filter(i => category === "All Rewards" || i.category === category);
  const canBuy  = selected && coins >= selected.cost;

  const handleBuy = () => {
    const ok = spendCoins(currentUser._id, selected.cost, selected.name);
    if (ok) { showToast(`✅ Purchased: ${selected.name}!`); setSelected(null); }
    else      showToast("❌ Not enough coins!", "error");
  };

  return (
    <div className="space-y-4 p-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-poppins font-black text-slate-800 dark:text-white text-2xl"> Rewards Shop</h2>
          <p className="mt-0.5 text-slate-500 dark:text-slate-400 text-xs">Trade your coins for perks</p>
        </div>
        <div className="flex items-center gap-1.5 bg-brand-50 dark:bg-brand-900/30 px-3 py-1.5 rounded-full">
          <span>🪙</span>
          <span className="font-black text-brand-700 dark:text-brand-400">{coins.toLocaleString()}</span>
        </div>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 pb-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {ALL_CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap border-none cursor-pointer transition-all
              ${category === c
? "bg-brand-500 text-white"
                : "bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300"}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="gap-3 grid grid-cols-2">
        {items.map(item => {
          const affordable = coins >= item.cost;
          return (
            <div
              key={item.id || item._id}
              onClick={() => setSelected(item)}
              className={`bg-white dark:bg-slate-800 rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-0.5 border-2
                ${affordable ? "border-transparent" : "border-red-100 dark:border-red-900/50"}`}
            >
              {/* Image area */}
              <div className="relative flex justify-center items-center bg-gradient-to-br from-brand-50 dark:from-brand-900/20 to-slate-50 dark:to-slate-700 h-24">
                {item.tag && (
                  <span className={`absolute top-2 left-2 text-[9px] font-extrabold px-2 py-0.5 rounded-full text-white
                    ${item.tag === "HOT" ? "bg-red-500" : "bg-brand-500"}`}>
                    {item.tag}
                  </span>
                )}
                {item.image
                  ? <img src={item.image} alt={item.name} className="rounded-xl w-16 h-16 object-cover" />
                  : <span className="text-5xl">{item.emoji}</span>
                }
              </div>
              {/* Body */}
              <div className="p-3">
                <p className="mb-1 font-extrabold text-slate-800 dark:text-white text-sm leading-tight">{item.name}</p>
                <div className="flex items-center gap-1">
                  <span className="text-sm">🪙</span>
                  <span className={`text-sm font-black ${affordable ? "text-brand-600 dark:text-brand-400" : "text-red-500 dark:text-red-400"}`}>
                    {item.cost.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Buy modal */}
      {selected && (
        <Modal onClose={() => setSelected(null)}>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              {selected.image
                ? <img src={selected.image} alt={selected.name} className="rounded-2xl w-24 h-24 object-cover" />
                : <div className="text-6xl">{selected.emoji}</div>
              }
            </div>
            <h3 className="mb-1 font-poppins font-black text-slate-800 dark:text-white text-xl">{selected.name}</h3>
            <p className="mb-4 text-slate-500 dark:text-slate-400 text-sm">{selected.desc}</p>
            <div className="flex justify-center items-center gap-2 mb-1">
              <span className="text-2xl">🪙</span>
              <span className={`font-poppins font-black text-3xl ${canBuy ? "text-brand-600 dark:text-brand-400" : "text-red-500 dark:text-red-400"}`}>
                {selected.cost.toLocaleString()}
              </span>
            </div>
            <p className="mb-6 text-slate-400 dark:text-slate-500 text-xs">Your balance: {coins.toLocaleString()} coins</p>
            <div className="flex gap-3">
              <button
                onClick={() => setSelected(null)}
                className="flex-1 bg-white hover:bg-slate-50 dark:bg-slate-700 dark:hover:bg-slate-600 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-2xl font-extrabold text-slate-600 dark:text-slate-300 text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleBuy}
                disabled={!canBuy}
                className={`flex-[2] py-3 rounded-2xl font-extrabold text-sm text-white border-none cursor-pointer transition-all
                  ${canBuy
                    ? "bg-brand-500 hover:bg-brand-600"
                    : "bg-slate-200 dark:bg-slate-600 text-slate-400 dark:text-slate-500 cursor-not-allowed"}`}
              >
                {canBuy ? "Buy Now 🛒" : "Not enough coins"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
