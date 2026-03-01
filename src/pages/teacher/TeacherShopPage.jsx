// src/pages/teacher/TeacherShopPage.jsx
import { useState, useRef } from "react";
import { useApp } from "../../context/AppContext";
import { Modal } from "../../components/ui";
import { FaPlus, FaTrash, FaStore, FaCamera, FaCoins, FaCheck, FaTimes } from "react-icons/fa";

const EMOJIS     = ["🎒","📓","🍕","🍫","🎬","⚽","📝","💡","🌟","🎨","🎮","🧸","🎯","📚","🏆","🎁"];
const CATEGORIES = ["School Supplies", "Snacks", "Academic", "Fun"];
const BLANK      = { name: "", cost: "", emoji: "🎁", image: null, desc: "", category: "Fun", tag: null };

export default function TeacherShopPage() {
  const { shopItems, addShopItem, removeShopItem, showToast } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState({ ...BLANK });
  const [catFilter, setCatFilter] = useState("All");
  const [loading, setLoading]     = useState(false);
  const fileRef                   = useRef();

  const items = catFilter === "All" ? shopItems : shopItems.filter(i => i.category === catFilter);

  // Image upload — base64 ga o'girish
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      showToast("❌ Rasm 2MB dan kichik bo'lishi kerak", "error"); return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setForm(f => ({ ...f, image: ev.target.result, emoji: null }));
    reader.readAsDataURL(file);
  };

  const handleAdd = async () => {
    if (!form.name.trim() || !form.cost) { showToast("❌ Nom va narxni kiriting", "error"); return; }
    setLoading(true);
    try {
      await addShopItem({ ...form, cost: parseInt(form.cost) });
      showToast("✅ Mahsulot qo'shildi!");
      setShowModal(false);
      setForm({ ...BLANK });
    } catch (err) {
      showToast("❌ " + (err.message || "Xatolik"), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (id, name) => {
    removeShopItem(id);
    showToast(`🗑️ "${name}" o'chirildi`);
  };

  return (
    <div className="space-y-4 p-5 md:p-0">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="font-poppins font-black text-slate-800 text-2xl md:text-3xl">Manage Shop</h2>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 bg-gradient-to-r from-brand-500 to-brand-600 shadow-brand-200 shadow-md hover:shadow-lg px-4 py-2.5 border-none rounded-full font-extrabold text-white text-xs transition-all cursor-pointer">
          <FaPlus /> Add Item
        </button>
      </div>

      {/* Stats */}
      <div className="flex justify-between items-center bg-gradient-to-br from-purple-500 to-purple-700 shadow-lg shadow-purple-200 p-4 rounded-2xl text-white">
        <div>
          <p className="opacity-80 mb-0.5 font-bold text-xs">Total Items</p>
          <p className="font-poppins font-black text-3xl">{shopItems.length}</p>
        </div>
        <FaStore className="opacity-80 text-5xl" />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 pb-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {["All", ...CATEGORIES].map(c => (
          <button key={c} onClick={() => setCatFilter(c)}
            className={"px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap border-none cursor-pointer transition-all " +
              (catFilter === c ? "bg-purple-600 text-white" : "bg-white text-slate-500 shadow-sm")}>
            {c}
          </button>
        ))}
      </div>

      {/* Items grid */}
      <div className="gap-3 grid grid-cols-1 md:grid-cols-2">
        {items.map(item => (
          <div key={item._id || item.id}
            className="flex items-center gap-3 bg-white shadow-sm hover:shadow-md p-3.5 rounded-2xl transition-all">
            {/* Image or emoji */}
            <div className="flex flex-shrink-0 justify-center items-center bg-slate-50 rounded-xl w-14 h-14 overflow-hidden">
              {item.image
                ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                : <span className="text-3xl">{item.emoji}</span>
              }
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-extrabold text-slate-800 text-sm truncate">{item.name}</p>
                {item.tag && (
                  <span className={"text-[9px] font-extrabold px-2 py-0.5 rounded-full text-white " +
                    (item.tag === "HOT" ? "bg-red-500" : "bg-brand-500")}>
                    {item.tag}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-medium text-[10px] text-slate-400">{item.category}</span>
                <span className="text-[10px] text-slate-300">•</span>
                <FaCoins className="text-amber-500 text-xs" />
                <span className="font-black text-brand-600 text-xs">{item.cost}</span>
              </div>
            </div>
            <button onClick={() => handleRemove(item._id || item.id, item.name)}
              className="flex flex-shrink-0 justify-center items-center bg-red-50 hover:bg-red-100 border-none rounded-xl w-8 h-8 text-red-500 text-sm transition-colors cursor-pointer">
              <FaTrash />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <div className="col-span-2 py-10 text-slate-400 text-center">
            <div className="mb-2 text-4xl">
              <FaStore className="inline-block text-slate-300" />
            </div>
            <p className="font-medium text-sm">No items yet</p>
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      {showModal && (
        <Modal onClose={() => { setShowModal(false); setForm({ ...BLANK }); }}>
          <h3 className="mb-4 font-poppins font-black text-slate-800 text-xl">Add Shop Item</h3>

          {/* Image upload */}
          <div className="mb-4">
            <p className="mb-2 font-bold text-slate-500 text-xs uppercase tracking-wider">Rasm yuklash</p>
            <div
              onClick={() => fileRef.current.click()}
              className="hover:bg-brand-50 p-4 border-2 border-slate-200 hover:border-brand-400 border-dashed rounded-2xl text-center transition-all cursor-pointer"
            >
              {form.image ? (
                <div className="flex items-center gap-3">
                  <img src={form.image} alt="preview" className="rounded-xl w-16 h-16 object-cover" />
                  <div className="text-left">
                    <p className="flex items-center gap-2 font-bold text-slate-700 text-sm">
                      <FaCheck className="text-green-500" /> Rasm yuklandi
                    </p>
                    <p className="text-slate-400 text-xs">O'zgartirish uchun bosing</p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="mb-1 text-3xl">
                    <FaCamera className="inline-block text-slate-400" />
                  </div>
                  <p className="font-bold text-slate-500 text-sm">Rasm yuklash uchun bosing</p>
                  <p className="mt-0.5 text-slate-400 text-xs">JPG, PNG • max 2MB</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>

          {/* Yoki emoji tanlash */}
          {!form.image && (
            <div className="mb-4">
              <p className="mb-2 font-bold text-slate-500 text-xs uppercase tracking-wider">Yoki Emoji tanlang</p>
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map(e => (
                  <button key={e} onClick={() => setForm(f => ({ ...f, emoji: e }))}
                    className={"w-9 h-9 rounded-xl text-xl border-2 cursor-pointer transition-all " +
                      (form.emoji === e ? "border-brand-400 bg-brand-50" : "border-slate-100 bg-white")}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Rasmni olib tashlash */}
          {form.image && (
            <button onClick={() => setForm(f => ({ ...f, image: null, emoji: "🎁" }))}
              className="flex items-center gap-1 bg-transparent mb-3 border-none font-bold text-red-400 text-xs cursor-pointer">
              <FaTimes /> Rasmni olib tashlash
            </button>
          )}

          <div className="space-y-3 mb-5">
            <input type="text" placeholder="Item name *" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="bg-slate-50 focus:bg-white px-4 py-3 border-2 border-transparent focus:border-brand-400 rounded-xl outline-none w-full font-medium text-sm transition-all" />
            <input type="number" placeholder="Cost in coins *" value={form.cost}
              onChange={e => setForm(f => ({ ...f, cost: e.target.value }))}
              className="bg-slate-50 focus:bg-white px-4 py-3 border-2 border-transparent focus:border-brand-400 rounded-xl outline-none w-full font-medium text-sm transition-all" />
            <input type="text" placeholder="Description" value={form.desc}
              onChange={e => setForm(f => ({ ...f, desc: e.target.value }))}
              className="bg-slate-50 focus:bg-white px-4 py-3 border-2 border-transparent focus:border-brand-400 rounded-xl outline-none w-full font-medium text-sm transition-all" />
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              className="bg-slate-50 px-4 py-3 border-2 border-transparent rounded-xl outline-none w-full font-medium text-sm appearance-none">
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="flex gap-3">
            <button onClick={() => { setShowModal(false); setForm({ ...BLANK }); }}
              className="flex-1 bg-white py-3 border-2 border-slate-200 rounded-2xl font-extrabold text-slate-600 text-sm cursor-pointer">
              Cancel
            </button>
            <button onClick={handleAdd} disabled={loading}
              className="flex flex-[2] justify-center items-center gap-2 bg-gradient-to-r from-brand-500 to-brand-600 disabled:opacity-60 shadow-lg py-3 border-none rounded-2xl font-extrabold text-white text-sm cursor-pointer">
              {loading ? "Adding..." : <>Add to Shop <FaCheck /></>}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

