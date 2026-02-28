// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function LoginPage() {
  const { login, showToast } = useApp();
  const navigate = useNavigate();
  const [role, setRole]         = useState("student");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(email, password);
      if (!result.ok) {
        showToast("❌ " + (result.message || "Wrong email or password"), "error");
        return;
      }
      showToast("✅ Welcome back!");
      navigate(result.role === "teacher" ? "/teacher/students" : "/student/home");
    } catch (err) {
      showToast("❌ " + (err.message || "Wrong email or password"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-slate-50 via-brand-50 to-blue-50 p-4 min-h-screen">
      <div className="w-full max-w-sm">

        {/* Card */}
        <div className="bg-white shadow-slate-200 shadow-xl p-7 rounded-3xl">
          <h2 className="mb-1 font-poppins font-bold text-slate-800 text-2xl">Welcome Back</h2>
          <p className="mb-6 text-slate-500 text-sm">Sign in to manage your wallet and rewards.</p>

          {/* Role toggle */}
          <div className="flex bg-slate-100 mb-6 p-1 rounded-2xl">
            {["student", "teacher"].map(r => (
              <button
                key={r}
                onClick={() => { setRole(r); setEmail(""); setPassword(""); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-extrabold capitalize transition-all border-none cursor-pointer
                  ${role === r ? "bg-white text-slate-800 shadow-sm" : "text-slate-400 bg-transparent"}`}
              >
                {r === "student" ? "🎓 Student" : "👨‍🏫 Teacher"}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-3">
            {/* Email */}
            <div className="flex items-center gap-3 bg-slate-50 focus-within:bg-white px-4 py-3.5 border-2 border-transparent focus-within:border-brand-400 rounded-xl transition-all">
              <span className="text-slate-400 text-base">✉️</span>
              <input
                type="email"
                placeholder={role === "student" ? "Your email address" : "Teacher email"}
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none font-medium text-slate-800 text-sm placeholder-slate-400"
                required
              />
            </div>

            {/* Password */}
            <div className="flex items-center gap-3 bg-slate-50 focus-within:bg-white px-4 py-3.5 border-2 border-transparent focus-within:border-brand-400 rounded-xl transition-all">
              <span className="text-slate-400 text-base">🔒</span>
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none font-medium text-slate-800 text-sm placeholder-slate-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="bg-transparent border-none font-bold text-slate-400 text-xs cursor-pointer"
              >
                {showPass ? "HIDE" : "SHOW"}
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-brand-500 to-brand-600 disabled:opacity-70 shadow-brand-200 shadow-lg hover:shadow-brand-300 hover:shadow-xl mt-2 py-4 border-none rounded-2xl w-full font-extrabold text-white text-base active:scale-[0.98] transition-all cursor-pointer"
            >
              {loading ? "Signing in..." : "Log In →"}
            </button>
          </form>

          {/* Info for student */}
          {role === "student" && (
            <div className="bg-brand-50 mt-5 p-4 rounded-2xl">
              <p className="font-bold text-brand-700 text-xs text-center">
                🎓 Your login credentials were given by your teacher
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
