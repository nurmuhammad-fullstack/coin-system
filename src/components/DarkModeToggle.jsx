// Dark Mode Toggle Component
// Animated Moon/Sun toggle with rotation effect - positioned at bottom-left

import { useApp } from "../context/AppContext";

export default function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useApp();

  return (
    <button
      onClick={toggleDarkMode}
className="right-6 bottom-6 z-50 fixed flex justify-center items-center shadow-lg rounded-full w-14 h-14 hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
      style={{
        background: darkMode 
          ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' 
          : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        boxShadow: darkMode 
          ? '0 4px 20px rgba(139, 92, 246, 0.4)' 
          : '0 4px 20px rgba(251, 191, 36, 0.4)',
      }}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
<div className="relative w-7 h-7">
        {/* Sun Icon */}
        <svg
          className={`absolute inset-0 w-full h-full transition-all duration-500 ${
            darkMode ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
        
        {/* Moon Icon */}
        <svg
          className={`absolute inset-0 w-full h-full transition-all duration-500 ${
            darkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </div>
    </button>
  );
}

