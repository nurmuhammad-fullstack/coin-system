// src/components/ui.jsx
// Shared UI primitives used across all pages

import { useApp } from "../context/AppContext";
import { useEffect } from "react";
import { getAvatarUrl } from "../services/api";
import {
  FaArrowLeft,
  FaCheck,
  FaChalkboardTeacher,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";

/* ── Toast ── */
export function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  const isError = toast.type === "error";
  const isWarning = toast.type === "warning";
  const msg = String(toast.msg || "").replace(/^[❌✅⚠️]\s*/, "");
  const Icon = isError ? FaTimes : isWarning ? FaExclamationTriangle : FaCheck;
  const bg =
    isError
      ? "bg-red-500"
      : isWarning
        ? "bg-yellow-500"
        : "bg-gradient-to-r from-brand-500 to-brand-600";
  return (
    <div className="fixed top-5 left-1/2 z-[999] -translate-x-1/2">
      <div
        className={`${bg} flex items-center gap-2.5 text-white px-4 py-2.5 rounded-full text-sm font-bold shadow-2xl animate-bounce-in whitespace-nowrap`}
      >
        <span className="flex justify-center items-center bg-white/20 rounded-full w-5 h-5">
          <Icon className="text-[10px]" />
        </span>
        <span>{msg}</span>
      </div>
    </div>
  );
}

/* ── Coin badge ── */
export function CoinBadge({ amount, size = "md" }) {
  const sz =
    size === "sm"
      ? "text-sm gap-1"
      : size === "lg"
        ? "text-2xl gap-2"
        : "text-base gap-1.5";
  return (
    <span
      className={`inline-flex items-center font-black text-brand-600 dark:text-brand-400 ${sz}`}
    >
      <span className="text-brand-500">🪙</span>
      {amount?.toLocaleString()}
    </span>
  );
}

/* ── Avatar ── */
export function Avatar({ user, size = 40 }) {
  // Check if avatar is an uploaded image
  const isImage =
    user?.avatar &&
    (user.avatar.startsWith("/uploads") ||
      user.avatar.startsWith("data:") ||
      user.avatar.startsWith("http"));

  if (isImage) {
    let src = user.avatar.startsWith("/uploads")
      ? getAvatarUrl(user.avatar)
      : user.avatar;
    // Prevent browser caching by adding timestamp parameter
    const separator = src.includes("?") ? "&" : "?";
    src = `${src}${separator}_t=${Date.now()}`;

    return (
      <img
        src={src}
        alt="Avatar"
        className="flex flex-shrink-0 rounded-full object-cover select-none"
        style={{ width: size, height: size }}
      />
    );
  }

  if (user?.role === "teacher") {
    const initials = user?.name
      ?.split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    return (
      <div
        className="relative flex flex-shrink-0 justify-center items-center rounded-full font-black text-white select-none ring-2 ring-white/80 dark:ring-slate-600/80 shadow-sm shadow-indigo-500/20"
        style={{
          width: size,
          height: size,
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
          fontSize: size * 0.34,
        }}
      >
        {initials || <FaChalkboardTeacher style={{ fontSize: size * 0.42 }} />}
        <span
          className="right-0 bottom-0 absolute bg-amber-400 border-2 border-white dark:border-slate-800 rounded-full"
          style={{ width: size * 0.24, height: size * 0.24 }}
        />
      </div>
    );
  }

  return (
    <div
      className="flex flex-shrink-0 justify-center items-center rounded-full font-black text-white select-none"
      style={{
        width: size,
        height: size,
        background: user.color,
        fontSize: size * 0.36,
      }}
    >
      {user.avatar}
    </div>
  );
}

/* ── Modal shell ── */
export function Modal({ onClose, children }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="z-50 fixed inset-0 flex justify-center items-end md:items-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 shadow-2xl shadow-slate-900/20 md:rounded-3xl rounded-t-3xl w-full max-w-lg overflow-y-auto animate-slide-up"
        style={{
          maxHeight: "85vh",
          paddingBottom: "env(safe-area-inset-bottom, 20px)",
        }}
        onClick={(e) => e.stopPropagation()}
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
      className={`bg-white dark:bg-slate-800 rounded-2xl ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

/* ── Section label ── */
export function SectionLabel({ children }) {
  return (
    <p className="mb-3 font-extrabold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest">
      {children}
    </p>
  );
}

/* ── Transaction item ── */
export function TxItem({ tx }) {
  const isEarn = tx.type === "earn";
  const amount = isEarn ? tx.amount : Math.abs(tx.amount);
  const date =
    tx.date ||
    (tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : "Unknown");
  return (
    <div className="flex items-center gap-3 py-3 border-slate-100 dark:border-slate-700 border-b">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isEarn ? "bg-brand-50 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400" : "bg-red-50 dark:bg-red-900/50 text-red-500 dark:text-red-400"}`}
      >
        <span className="text-base">{isEarn ? "↑" : "↓"}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-slate-800 dark:text-white text-sm truncate">
          {tx.label}
        </p>
        <p className="text-slate-400 dark:text-slate-500 text-xs">{date}</p>
      </div>
      <span
        className={`text-sm font-black ${isEarn ? "text-brand-600 dark:text-brand-400" : "text-red-500 dark:text-red-400"}`}
      >
        {isEarn ? "+" : "-"}
        {amount}
      </span>
    </div>
  );
}

/* ── Bottom navigation ── */
export function BottomNav({ tabs, active, onChange }) {
  return (
    <nav className="flex flex-shrink-0 bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 border-t">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`flex-1 flex flex-col items-center gap-1 py-2 text-[10px] font-extrabold transition-colors border-none bg-transparent cursor-pointer
            ${active === t.id ? "text-brand-500" : "text-slate-400 dark:text-slate-500"}`}
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
    green:
      "bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400",
    blue: "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    red: "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    amber:
      "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${colors[color]}`}
    >
      {children}
    </span>
  );
}

/* ── Back button ── */
export function BackButton({ onClick, label = "Back", className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 bg-none mb-4 border-none font-bold text-slate-600 hover:text-slate-900 dark:hover:text-white dark:text-slate-300 text-sm leading-none transition-colors cursor-pointer ${className}`}
    >
      <FaArrowLeft className="block text-xs leading-none" />
      <span className="leading-none">{label}</span>
    </button>
  );
}
