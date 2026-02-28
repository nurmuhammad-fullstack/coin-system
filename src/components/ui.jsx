// src/components/ui.jsx
// Shared UI primitives used across all pages

import { useApp } from "../context/AppContext";
import { useEffect } from "react";

/* ── Toast ── */
export function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  const bg = toast.type === "error" ? "bg-red-500" : toast.type === "warning" ? "bg-yellow-500" : "bg-gray-900";
  return (
    <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-[999] ${bg} text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-2xl animate-bounce-in whitespace-nowrap`}>
      {toast.msg}
    </div>
  );
}

/* ── Coin badge ── */
export function CoinBadge({ amount, size = "md" }) {
  const sz = size === "sm" ? "text-sm gap-1" : size === "lg" ? "text-2xl gap-2" : "text-base gap-1.5";
  return (
    <span className={`inline-flex items-center font-black text-brand-600 ${sz}`}>
      <span className="text-brand-500">🪙</span>{amount?.toLocaleString()}
    </span>
  );
}

/* ── Avatar ── */
export function Avatar({ user, size = 40 }) {
  return (
    <div
      className="flex flex-shrink-0 justify-center items-center rounded-full font-black text-white select-none"
      style={{ width: size, height: size, background: user.color, fontSize: size * 0.36 }}
    >
      {user.avatar}
    </div>
  );
}

/* ── Modal shell ── */
export function Modal({ onClose, children }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-end bg-black/50 animate-fade-in" onClick={onClose}>
      <div
        className="bg-white rounded-t-3xl w-full max-w-lg overflow-y-auto animate-slide-up"
        style={{ maxHeight: "85vh", paddingBottom: "env(safe-area-inset-bottom, 20px)" }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

/* ── Card ── */
export function Card({ children, className = "", onClick }) {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

/* ── Section label ── */
export function SectionLabel({ children }) {
  return <p className="mb-3 font-extrabold text-[10px] text-slate-400 uppercase tracking-widest">{children}</p>;
}

/* ── Transaction item ── */
export function TxItem({ tx }) {
  const isEarn = tx.type === "earn";
  const date = tx.date || (tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : "Unknown");
  return (
    <div className="flex items-center gap-3 py-3 border-slate-50 last:border-0 border-b">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isEarn ? "bg-brand-50 text-brand-600" : "bg-red-50 text-red-500"}`}>
        <span className="text-base">{isEarn ? "↑" : "↓"}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-800 text-sm truncate">{tx.label}</p>
        <p className="text-slate-400 text-xs">{date}</p>
      </div>
      <span className={`text-sm font-black ${isEarn ? "text-brand-600" : "text-red-500"}`}>
        {isEarn ? "+" : ""}{tx.amount}
      </span>
    </div>
  );
}

/* ── Bottom navigation ── */
export function BottomNav({ tabs, active, onChange }) {
  return (
    <nav className="flex flex-shrink-0 bg-white border-slate-100 border-t">
      {tabs.map(t => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`flex-1 flex flex-col items-center gap-1 py-2 text-[10px] font-extrabold transition-colors border-none bg-transparent cursor-pointer
            ${active === t.id ? "text-brand-500" : "text-slate-400"}`}
        >
          <span className="text-xl leading-none">{t.icon}</span>
          {t.label}
        </button>
      ))}
    </nav>
  );
}

/* ── Chip ── */
export function Chip({ children, color = "green" }) {
  const colors = {
    green: "bg-brand-50 text-brand-700",
    blue:  "bg-blue-50 text-blue-700",
    red:   "bg-red-50 text-red-600",
    amber: "bg-amber-50 text-amber-700",
  };
  return <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${colors[color]}`}>{children}</span>;
}

/* ── Back button ── */
export function BackButton({ onClick, label = "Back" }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 bg-none mb-4 border-none font-bold text-slate-600 hover:text-slate-900 text-sm transition-colors cursor-pointer">
      ← {label}
    </button>
  );
}
