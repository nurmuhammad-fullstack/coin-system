// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { FaGraduationCap, FaChalkboardTeacher, FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginPage() {
  const { login, showToast } = useApp();
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(email, password);
      if (!result.ok) {
        showToast("❌ " + (result.message || "Wrong login or password"), "error");
        return;
      }
      showToast("✅ Welcome back!");
      navigate(result.role === "teacher" ? "/teacher/students" : "/student/home");
    } catch (err) {
      showToast("❌ " + (err.message || "Wrong login or password"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-slate-100 dark:from-slate-900 via-slate-50 dark:via-slate-800 to-brand-100 dark:to-slate-900 p-4 min-h-screen">
      <div className="w-full max-w-sm">
        {/* Card */}
        <div className="bg-white/80 dark:bg-slate-800/90 shadow-xl backdrop-blur-sm p-7 rounded-3xl">
          {/* Logo */}

          <h2 className="mb-1 font-poppins font-bold text-slate-800 dark:text-white text-2xl text-center">Welcome Back</h2>
          <p className="mb-6 text-slate-500 dark:text-slate-400 text-sm text-center">Sign in to continue to CoinEd</p>

          {/* Role toggle */}
          <div className="flex bg-slate-100 dark:bg-slate-700/50 mb-6 p-1.5 rounded-2xl">
            {["student", "teacher"].map(r => (
              <button
                key={r}
                onClick={() => { setRole(r); setEmail(""); setPassword(""); }}
                className={`flex-1 py-3 rounded-xl text-sm font-extrabold capitalize transition-all duration-300 border-none cursor-pointer flex items-center justify-center gap-2 ${
                  role === r 
                    ? "bg-white dark:bg-slate-600 text-brand-600 dark:text-brand-400 shadow-md" 
                    : "text-slate-400 dark:text-slate-400 hover:text-slate-600 bg-transparent"
                }`}
              >
                {r === "student" ? <FaGraduationCap /> : <FaChalkboardTeacher />}
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <div className="top-1/2 left-4 absolute text-slate-400 -translate-y-1/2">
                <FaUser />
              </div>
              <input
                type="email"
                placeholder={role === "student" ? "Your email" : "Teacher email"}
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-slate-50 dark:bg-slate-700/50 py-3.5 pr-4 pl-12 border-2 border-transparent focus:border-brand-400 dark:focus:border-brand-500 rounded-xl outline-none w-full font-medium text-slate-800 dark:text-white text-sm transition-all placeholder-slate-400 dark:placeholder-slate-500"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="top-1/2 left-4 absolute text-slate-400 -translate-y-1/2">
                <FaLock />
              </div>
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="bg-slate-50 dark:bg-slate-700/50 py-3.5 pr-12 pl-12 border-2 border-transparent focus:border-brand-400 dark:focus:border-brand-500 rounded-xl outline-none w-full font-medium text-slate-800 dark:text-white text-sm transition-all placeholder-slate-400 dark:placeholder-slate-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="top-1/2 right-4 absolute bg-transparent border-none text-slate-400 hover:text-brand-500 text-sm transition-colors -translate-y-1/2 cursor-pointer"
              >
                {showPass ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-brand-500 hover:from-brand-600 to-brand-600 hover:to-brand-700 disabled:opacity-50 shadow-lg py-4 rounded-2xl w-full font-extrabold text-white text-base active:scale-[0.98] transition-all cursor-pointer"
            >
              {loading ? "Signing in..." : "Log In →"}
            </button>
          </form>

          {/* Info for student */}
          {role === "student" && (
            <div className="bg-gradient-to-r from-brand-50 dark:from-brand-900/20 to-green-50 dark:to-green-900/20 mt-6 p-4 rounded-2xl">
              <p className="flex justify-center items-center gap-2 font-bold text-brand-700 dark:text-brand-400 text-xs text-center">
                <FaGraduationCap /> Your login credentials were given by your teacher
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="mt-6 text-slate-400 dark:text-slate-500 text-xs text-center">
          2026 CoinEd. All rights reserved.
        </p>
      </div>
    </div>
  );
}

