// src/pages/teacher/TeacherShopPage.jsx
import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Modal } from "../../components/ui";

const EMOJIS = ["🎒","📓","🍕","🍫","🎬","⚽","📝","💡","🌟","🎨","🎮","🧸","🎯","📚","🏆","🎁"];
const CATEGORIES = ["School Supplies", "Snacks", "Academic", "Fun"];

const BLANK = { name: "", cost: "", emoji: "🎁", desc: "", category: "Fun", tag: null };

export default function TeacherShopPage() {
  const { shopItems, addShopItem, removeShopItem, showToast } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState({ ...BLANK });
  const [catFilter, setCatFilter] = useState("All");

  const items = catFilter === "All" ? shopItems : shopItems.filter(i => i.category === catFilter);

  const handleAdd = async () => {
    if (!form.name.trim() || !form.cost) { showToast("❌ Fill in name and cost", "error"); return; }
    await addShopItem({ ...form, cost: parseInt(form.cost) });
    showToast("✅ Item added to shop!");
    setShowModal(false);
    setForm({ ...BLANK });
  };

  const handleRemove = async (id, name) => {
    await removeShopItem(id);
    showToast(`🗑️ "${name}" removed`);
  };

  return (
    <div className="space-y-4 p-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="font-poppins font-black text-slate-800 text-2xl">Manage Shop</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-gradient-to-r from-brand-500 to-brand-600 shadow-brand-200 shadow-md hover:shadow-lg px-4 py-2.5 border-none rounded-full font-extrabold text-white text-xs transition-all cursor-pointer"
        >
          ➕ Add Item
        </button>
      </div>

      {/* Stats */}
      <div className="flex justify-between items-center bg-gradient-to-br from-purple-500 to-purple-700 shadow-lg shadow-purple-200 p-4 rounded-2xl text-white">
        <div>
          <p className="opacity-80 mb-0.5 font-bold text-xs">Total Items</p>
          <p className="font-poppins font-black text-3xl">{shopItems.length}</p>
        </div>
        <span className="opacity-80 text-5xl">🏪</span>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 pb-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {["All", ...CATEGORIES].map(c => (
          <button
            key={c}
            onClick={() => setCatFilter(c)}
            className={`px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap border-none cursor-pointer transition-all
              ${catFilter === c ? "bg-purple-600 text-white" : "bg-white text-slate-500 shadow-sm"}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Items list */}
      <div className="space-y-2">
        {items.map(item => {
          const itemKey = item._id || item.id;
          return (
          <div key={itemKey} className="flex items-center gap-3 bg-white shadow-sm p-3.5 rounded-2xl">
            <div className="flex flex-shrink-0 justify-center items-center bg-slate-50 rounded-xl w-12 h-12 text-2xl">
              {item.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-extrabold text-slate-800 text-sm truncate">{item.name}</p>
                {item.tag && (
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full text-white ${item.tag === "HOT" ? "bg-red-500" : "bg-brand-500"}`}>
                    {item.tag}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-[10px] text-slate-400">{item.category}</span>
                <span className="text-[10px] text-slate-300">•</span>
                <div className="flex items-center gap-0.5">
                  <span className="text-xs">🪙</span>
                  <span className="font-black text-brand-600 text-xs">{item.cost}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleRemove(itemKey, item.name)}
              className="flex justify-center items-center bg-red-50 hover:bg-red-100 border-none rounded-xl w-8 h-8 text-red-500 text-sm transition-colors cursor-pointer"
            >
              🗑️
            </button>
          </div>
        )})}
        {items.length === 0 && (
          <div className="py-8 text-slate-400 text-center">
            <div className="mb-2 text-4xl">🏪</div>
            <p className="font-medium text-sm">No items in this category</p>
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      {showModal && (
        <Modal onClose={() => { setShowModal(false); setForm({ ...BLANK }); }}>
          <h3 className="mb-5 font-poppins font-black text-slate-800 text-xl">Add Shop Item</h3>

          {/* Emoji picker */}
          <div className="mb-4">
            <p className="mb-2 font-bold text-slate-500 text-xs uppercase tracking-wider">Choose Emoji</p>
            <div className="flex flex-wrap gap-2">
              {EMOJIS.map(e => (
                <button
                  key={e}
                  onClick={() => setForm(f => ({ ...f, emoji: e }))}
                  className={`w-9 h-9 rounded-xl text-xl border-2 cursor-pointer transition-all
                    ${form.emoji === e ? "border-brand-400 bg-brand-50" : "border-slate-100 bg-white"}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 mb-5">
            <input
              type="text"
              placeholder="Item name *"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="bg-slate-50 focus:bg-white px-4 py-3 border-2 border-transparent focus:border-brand-400 rounded-xl outline-none w-full font-medium text-sm transition-all"
            />
            <input
              type="number"
              placeholder="Cost in coins *"
              value={form.cost}
              onChange={e => setForm(f => ({ ...f, cost: e.target.value }))}
              className="bg-slate-50 focus:bg-white px-4 py-3 border-2 border-transparent focus:border-brand-400 rounded-xl outline-none w-full font-medium text-sm transition-all"
            />
            <input
              type="text"
              placeholder="Description"
              value={form.desc}
              onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
              className="bg-slate-50 focus:bg-white px-4 py-3 border-2 border-transparent focus:border-brand-400 rounded-xl outline-none w-full font-medium text-sm transition-all"
            />
            <select
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="bg-slate-50 px-4 py-3 border-2 border-transparent rounded-xl outline-none w-full font-medium text-sm transition-all appearance-none"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => { setShowModal(false); setForm({ ...BLANK }); }}
              className="flex-1 bg-white py-3 border-2 border-slate-200 rounded-2xl font-extrabold text-slate-600 text-sm cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="flex-[2] bg-gradient-to-r from-brand-500 to-brand-600 shadow-brand-200 shadow-lg py-3 border-none rounded-2xl font-extrabold text-white text-sm cursor-pointer"
            >
              Add to Shop ✅
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
