"use client";
import { useState } from "react";

const navItems = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "wallet", label: "Wallet", icon: "💳" },
  { id: "rewards", label: "Rewards", icon: "🎁" },
  { id: "tests", label: "Tests", icon: "📝" },
  { id: "profile", label: "Profile", icon: "👤" },
];

const quickLinks = [
  { id: "wallet", label: "My Wallet", icon: "💳", color: "#e8f4ff", iconBg: "#b3d9ff" },
  { id: "rewards", label: "Rewards Shop", icon: "🎁", color: "#fff0f0", iconBg: "#ffc9c9" },
  { id: "leaderboard", label: "Leaderboard", icon: "🏆", color: "#fffbe6", iconBg: "#ffe066" },
  { id: "profile", label: "Profile", icon: "👤", color: "#f3f0ff", iconBg: "#c5b8ff" },
];

const tests = [
  { id: 1, title: "Mathematics - Algebra", subject: "Math", questions: 20, duration: "30 min", status: "available", coins: 50 },
  { id: 2, title: "English Grammar", subject: "English", questions: 15, duration: "20 min", status: "completed", score: 85, coins: 30 },
  { id: 3, title: "History - World War II", subject: "History", questions: 25, duration: "40 min", status: "available", coins: 60 },
  { id: 4, title: "Science - Physics", subject: "Science", questions: 18, duration: "25 min", status: "locked", coins: 40 },
];

export default function StudentPortal() {
  const [activePage, setActivePage] = useState("home");
  const [activeTest, setActiveTest] = useState(null);

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Nunito', sans-serif", background: "#f0f7f0" }}>
      {/* Sidebar */}
      <aside style={{
        width: 200, background: "#fff", display: "flex", flexDirection: "column",
        padding: "24px 12px", gap: 6, boxShadow: "2px 0 12px rgba(0,0,0,0.06)", position: "fixed", height: "100vh"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px 20px" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#22c55e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🪙</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: "#1a1a1a" }}>CoinEd</div>
            <div style={{ fontSize: 11, color: "#888" }}>Student Portal</div>
          </div>
        </div>

        {navItems.map(item => (
          <button key={item.id} onClick={() => setActivePage(item.id)} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "10px 14px",
            borderRadius: 12, border: "none", cursor: "pointer", textAlign: "left",
            background: activePage === item.id ? "#22c55e" : "transparent",
            color: activePage === item.id ? "#fff" : "#555",
            fontWeight: activePage === item.id ? 700 : 500,
            fontSize: 14, transition: "all 0.2s"
          }}>
            <span>{item.icon}</span> {item.label}
          </button>
        ))}

        <div style={{ marginTop: "auto", padding: "16px 14px", background: "#f0fdf4", borderRadius: 12 }}>
          <div style={{ fontSize: 20, marginBottom: 4 }}>🎓</div>
          <div style={{ fontWeight: 700, fontSize: 13, color: "#1a1a1a" }}>Student Account</div>
          <div style={{ fontSize: 11, color: "#22c55e", fontWeight: 600 }}>Keep earning coins!</div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: 200, flex: 1, padding: "32px 40px" }}>
        {/* HOME PAGE */}
        {activePage === "home" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
              <div>
                <div style={{ fontSize: 14, color: "#888", marginBottom: 2 }}>Welcome back,</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#1a1a1a" }}>Hi, Burxon 👋</div>
              </div>
              <button style={{ background: "#fff", border: "none", borderRadius: 12, padding: "10px 14px", cursor: "pointer", fontSize: 18, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>🔔</button>
            </div>

            {/* Balance Card */}
            <div style={{
              background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
              borderRadius: 20, padding: "32px 36px", marginBottom: 24, color: "#fff",
              boxShadow: "0 8px 30px rgba(34,197,94,0.35)"
            }}>
              <div style={{ fontSize: 13, opacity: 0.8, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Total Balance</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: 40 }}>🪙</span>
                <span style={{ fontSize: 56, fontWeight: 900, lineHeight: 1 }}>540</span>
              </div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "rgba(255,255,255,0.2)", borderRadius: 20, padding: "6px 14px", fontSize: 13
              }}>
                ↑ coins balance
              </div>
            </div>

            {/* Quick Links */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
              {quickLinks.map(link => (
                <button key={link.id} onClick={() => setActivePage(link.id)} style={{
                  background: link.color, border: "1.5px solid rgba(0,0,0,0.06)",
                  borderRadius: 16, padding: "20px 16px", cursor: "pointer",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                  transition: "transform 0.2s, box-shadow 0.2s",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)"; }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: link.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                    {link.icon}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#333" }}>{link.label}</span>
                </button>
              ))}
            </div>

            {/* Recent Transactions */}
            <div style={{ background: "#fff", borderRadius: 20, padding: "24px 28px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: "#1a1a1a", textTransform: "uppercase", letterSpacing: 0.5 }}>Recent Transactions</div>
                <button style={{ background: "none", border: "none", color: "#22c55e", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>View all →</button>
              </div>
              <div style={{ textAlign: "center", padding: "32px 0", color: "#bbb" }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>📭</div>
                <div style={{ fontSize: 14 }}>No transactions yet</div>
              </div>
            </div>
          </div>
        )}

        {/* TESTS PAGE */}
        {activePage === "tests" && (
          <div>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 14, color: "#888", marginBottom: 2 }}>Earn coins by completing</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#1a1a1a" }}>Tests 📝</div>
            </div>

            {/* Stats Row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 28 }}>
              {[
                { label: "Available Tests", value: "2", icon: "📋", color: "#e8f4ff", accent: "#3b82f6" },
                { label: "Completed", value: "1", icon: "✅", color: "#f0fdf4", accent: "#22c55e" },
                { label: "Coins Earned", value: "30", icon: "🪙", color: "#fffbe6", accent: "#f59e0b" },
              ].map(s => (
                <div key={s.label} style={{ background: s.color, borderRadius: 16, padding: "20px 24px", border: `1.5px solid ${s.accent}22` }}>
                  <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontSize: 28, fontWeight: 900, color: s.accent }}>{s.value}</div>
                  <div style={{ fontSize: 13, color: "#666", fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Tests List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {tests.map(test => (
                <div key={test.id} style={{
                  background: "#fff", borderRadius: 18, padding: "22px 28px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                  border: "1.5px solid rgba(0,0,0,0.05)",
                  opacity: test.status === "locked" ? 0.6 : 1
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{
                      width: 50, height: 50, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                      background: test.status === "completed" ? "#f0fdf4" : test.status === "locked" ? "#f5f5f5" : "#e8f4ff"
                    }}>
                      {test.status === "completed" ? "✅" : test.status === "locked" ? "🔒" : "📝"}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 15, color: "#1a1a1a", marginBottom: 4 }}>{test.title}</div>
                      <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#888" }}>
                        <span>📚 {test.subject}</span>
                        <span>❓ {test.questions} questions</span>
                        <span>⏱ {test.duration}</span>
                        <span style={{ color: "#f59e0b", fontWeight: 700 }}>🪙 +{test.coins} coins</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    {test.status === "completed" && (
                      <div style={{ background: "#f0fdf4", color: "#22c55e", borderRadius: 10, padding: "6px 14px", fontWeight: 800, fontSize: 14 }}>
                        {test.score}%
                      </div>
                    )}
                    <button
                      disabled={test.status === "locked"}
                      style={{
                        padding: "10px 22px", borderRadius: 12, border: "none", cursor: test.status === "locked" ? "not-allowed" : "pointer",
                        fontWeight: 700, fontSize: 13, transition: "all 0.2s",
                        background: test.status === "completed" ? "#e8f4ff" : test.status === "locked" ? "#e5e7eb" : "#22c55e",
                        color: test.status === "completed" ? "#3b82f6" : test.status === "locked" ? "#9ca3af" : "#fff",
                        boxShadow: test.status === "available" ? "0 4px 14px rgba(34,197,94,0.35)" : "none"
                      }}
                    >
                      {test.status === "completed" ? "Review" : test.status === "locked" ? "Locked" : "Start Test"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* OTHER PAGES PLACEHOLDER */}
        {!["home", "tests"].includes(activePage) && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", color: "#bbb" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>
              {navItems.find(n => n.id === activePage)?.icon}
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#ccc" }}>
              {navItems.find(n => n.id === activePage)?.label} page
            </div>
            <div style={{ fontSize: 14, marginTop: 8 }}>Coming soon...</div>
          </div>
        )}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        button:hover { opacity: 0.92; }
      `}</style>
    </div>
  );
}
