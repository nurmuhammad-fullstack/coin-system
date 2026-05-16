// Dark Mode Toggle Component
// Animated Moon/Sun toggle with rotation effect - positioned at bottom-left

import { useApp } from "../context/AppContext";
import { FaMoon, FaSun } from "react-icons/fa";

export default function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useApp();

  return (
    <button
      onClick={toggleDarkMode}
      className="right-5 bottom-5 z-50 fixed flex justify-center items-center border border-white/20 rounded-full w-[46px] h-[46px] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
      style={{
        background: darkMode
          ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
          : "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
        boxShadow: darkMode
          ? "0 8px 24px rgba(15, 23, 42, 0.28)"
          : "0 8px 22px rgba(217, 119, 6, 0.24)",
      }}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="relative w-5 h-5 text-white">
        <FaSun
          className={`absolute inset-0 w-full h-full transition-all duration-300 ${
            darkMode
              ? "opacity-0 rotate-45 scale-75"
              : "opacity-100 rotate-0 scale-100"
          }`}
        />
        <FaMoon
          className={`absolute inset-0 w-full h-full transition-all duration-300 ${
            darkMode
              ? "opacity-100 rotate-0 scale-100"
              : "opacity-0 -rotate-45 scale-75"
          }`}
        />
      </div>
    </button>
  );
}
