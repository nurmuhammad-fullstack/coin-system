import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { Avatar } from "../../components/ui";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrophy, FaMedal, FaCrown, FaCoins } from "react-icons/fa";

export default function StudentLeaderboardPage() {
  const { students, currentUser } = useApp();
  const [filter, setFilter] = useState("All");

  // Sort students by coins (descending)
  const sortedStudents = [...students].sort((a, b) => (b.coins || 0) - (a.coins || 0));

  // Filter by class if needed
  const filtered = filter === "All" 
    ? sortedStudents 
    : sortedStudents.filter(s => s.class === filter);

  // Get unique classes
  const classes = [...new Set(students.map(s => s.class).filter(Boolean))];

  // Find current user's rank
  const userRank = sortedStudents.findIndex(s => s._id === currentUser?._id) + 1;

  // Top 3
  const topThree = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  const getRankIcon = (rank) => {
    if (rank === 1) return <FaCrown className="text-yellow-400" />;
    if (rank === 2) return <FaMedal className="text-gray-400" />;
    if (rank === 3) return <FaMedal className="text-amber-600" />;
    return null;
  };

  return (
    <div className="space-y-4 p-5">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <h2 className="flex items-center gap-2 font-poppins font-black text-slate-800 text-2xl">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
          >
            <FaTrophy className="text-amber-500" />
          </motion.div>
          Leaderboard
        </h2>
      </motion.div>

      {/* User's rank card */}
      <AnimatePresence>
        {currentUser && userRank > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gradient-to-r from-amber-400 to-amber-500 shadow-amber-200 shadow-lg p-4 rounded-2xl text-white"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="opacity-80 font-bold text-xs">Your Rank</p>
                <motion.p 
                  key={userRank}
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  className="font-poppins font-black text-4xl"
                >
                  #{userRank}
                </motion.p>
              </div>
              <div className="text-right">
                <p className="opacity-80 font-bold text-xs">Your Coins</p>
                <p className="flex items-center gap-2 font-poppins font-black text-2xl">
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <FaCoins />
                  </motion.span>
                  {currentUser.coins || 0}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Class filter */}
      {classes.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-2 pb-1 overflow-x-auto" 
          style={{ scrollbarWidth: "none" }}
        >
          <button onClick={() => setFilter("All")}
            className={"px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap border-none cursor-pointer transition-all " +
              (filter === "All" ? "bg-amber-500 text-white" : "bg-white text-slate-500 shadow-sm")}>
            All Classes
          </button>
          {classes.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              className={"px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap border-none cursor-pointer transition-all " +
                (filter === c ? "bg-amber-500 text-white" : "bg-white text-slate-500 shadow-sm")}>
              Class {c}
            </button>
          ))}
        </motion.div>
      )}

      {/* Top 3 Podium */}
      {topThree.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center items-end gap-2 pt-4"
        >
          {/* 2nd place */}
          {topThree[1] && (
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center"
            >
              <Avatar user={topThree[1]} size={48} />
              <div className="bg-gray-200 mt-2 px-3 py-1 rounded-full">
                <p className="font-bold text-slate-600 text-xs">{topThree[1].name?.split(" ")[0]}</p>
                <p className="flex items-center gap-1 font-black text-slate-700 text-sm">
                  <FaCoins className="text-amber-500 text-xs" />
                  {topThree[1].coins}
                </p>
              </div>
              <div className="mt-2 text-3xl">{getRankIcon(2)}</div>
            </motion.div>
          )}
          
          {/* 1st place */}
          {topThree[0] && (
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="relative">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  <Avatar user={topThree[0]} size={64} />
                </motion.div>
                <div className="-top-2 -right-2 absolute">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <FaCrown className="drop-shadow-lg text-yellow-400 text-2xl" />
                  </motion.div>
                </div>
              </div>
              <div className="bg-amber-100 mt-2 px-4 py-2 rounded-full">
                <p className="font-bold text-amber-700 text-sm">{topThree[0].name?.split(" ")[0]}</p>
                <p className="flex items-center gap-1 font-black text-amber-600 text-lg">
                  <FaCoins className="text-amber-500" />
                  {topThree[0].coins}
                </p>
              </div>
              <div className="mt-2 text-4xl">{getRankIcon(1)}</div>
            </motion.div>
          )}
          
          {/* 3rd place */}
          {topThree[2] && (
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col items-center"
            >
              <Avatar user={topThree[2]} size={40} />
              <div className="bg-amber-100 mt-2 px-3 py-1 rounded-full">
                <p className="font-bold text-amber-700 text-xs">{topThree[2].name?.split(" ")[0]}</p>
                <p className="flex items-center gap-1 font-black text-amber-600 text-sm">
                  <FaCoins className="text-amber-500 text-xs" />
                  {topThree[2].coins}
                </p>
              </div>
              <div className="mt-2 text-3xl">{getRankIcon(3)}</div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Rest of the leaderboard - Unique Glassmorphism Design */}
      {rest.length > 0 && (
        <div className="space-y-3">
          <AnimatePresence>
            {rest.map((student, idx) => {
              const rank = idx + 4;
              const isCurrentUser = student._id === currentUser?._id;
              // Generate unique gradient based on rank
              const gradients = [
                "from-pink-500 to-rose-500",
                "from-purple-500 to-violet-500", 
                "from-indigo-500 to-blue-500",
                "from-cyan-500 to-teal-500",
                "from-green-500 to-emerald-500",
                "from-orange-500 to-amber-500",
              ];
              const gradient = gradients[(idx) % gradients.length];
              
              return (
                <motion.div 
                  key={student._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05, type: "spring", stiffness: 300 }}
                  className={`relative overflow-hidden rounded-2xl p-0.5 ${isCurrentUser ? "ring-2 ring-amber-400" : ""}`}
                >
                  {/* Gradient border animation */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-75 animate-pulse`} />
                  
                  {/* Main content with glass effect */}
                  <div className={`relative flex items-center gap-3 p-4 backdrop-blur-xl bg-white/80 ${isCurrentUser ? "bg-white/95" : ""}`}>
                    {/* Rank badge with gradient */}
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                      <span className="font-black text-white text-sm">{rank}</span>
                    </div>
                    
                    {/* Avatar with glow */}
                    <div className="relative">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} p-0.5`}>
                        <div className="flex justify-center items-center bg-white rounded-2xl w-full h-full">
                          <span className="font-black text-lg" style={{ color: student.color || '#6366f1' }}>
                            {student.name?.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      {isCurrentUser && (
                        <div className="-right-1 -bottom-1 absolute flex justify-center items-center bg-amber-400 border-2 border-white rounded-full w-4 h-4">
                          <span className="text-[8px]">★</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Name */}
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-base truncate ${isCurrentUser ? "text-amber-600" : "text-slate-700"}`}>
                        {student.name}
                        {isCurrentUser && <span className="ml-1 text-amber-500 text-xs">★</span>}
                      </p>
                      <p className="text-slate-400 text-xs">Class {student.class}</p>
                    </div>
                    
                    {/* Coins with animation */}
                    <motion.div 
                      whileHover={{ scale: 1.1 }}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r ${gradient} shadow-lg`}
                    >
                      <span className="text-white text-lg">🪙</span>
                      <span className="font-black text-white text-lg">{student.coins || 0}</span>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-10 text-slate-400 text-center"
        >
          <div className="mb-2 text-4xl">
            <FaTrophy className="inline-block text-slate-300" />
          </div>
          <p className="font-medium text-sm">No students found</p>
        </motion.div>
      )}
    </div>
  );
}

