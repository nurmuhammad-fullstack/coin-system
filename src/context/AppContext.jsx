// src/context/AppContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { authAPI, studentsAPI, shopAPI } from "../services/api";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [students, setStudents]       = useState([]);
  const [shopItems, setShopItems]     = useState([]);
  const [transactions, setTransactions] = useState({});
  const [toast, setToast]             = useState(null);
  const [loading, setLoading]         = useState(true);

  // ── Auto login from token ─────────────────────
  useEffect(() => {
    const token = localStorage.getItem("coined_token");
    if (token) {
      authAPI.me()
        .then(user => setCurrentUser(user))
        .catch(() => localStorage.removeItem("coined_token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // ── Load students & shop when teacher logs in ─
  useEffect(() => {
    if (currentUser?.role === "teacher") {
      studentsAPI.getAll().then(setStudents).catch(console.error);
      shopAPI.getAll().then(setShopItems).catch(console.error);
    }
    if (currentUser?.role === "student") {
      shopAPI.getAll().then(setShopItems).catch(console.error);
    }
  }, [currentUser]);

  // ── Toast ─────────────────────────────────────
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  // ── Auth ──────────────────────────────────────
  const login = async (email, password) => {
    const data = await authAPI.login(email, password);
    localStorage.setItem("coined_token", data.token);
    setCurrentUser(data.user);
    return { ok: true, role: data.user.role };
  };

  const logout = () => {
    localStorage.removeItem("coined_token");
    setCurrentUser(null);
    setStudents([]);
    setShopItems([]);
    setTransactions({});
  };

  // ── Students ──────────────────────────────────
  const createStudent = async (data) => {
    const res = await authAPI.createStudent(data);
    setStudents(prev => [...prev, res.user || res]);
    return res;
  };

  const deleteStudent = async (studentId) => {
    await studentsAPI.deleteOne(studentId);
    setStudents(prev => prev.filter(s => s._id !== studentId));
  };

  // ── Coins ─────────────────────────────────────
  const addCoins = async (studentId, amount, label = "Teacher Bonus") => {
    const res = await studentsAPI.addCoins(studentId, amount, label, "behavior");
    setStudents(prev => prev.map(s => s._id === studentId ? { ...s, coins: res.student.coins } : s));
    setTransactions(prev => ({
      ...prev,
      [studentId]: [{ _id: Date.now(), label, type: "earn", amount, date: "Just now" }, ...(prev[studentId] || [])]
    }));
  };

  const removeCoins = async (studentId, amount, label = "Teacher Deduction") => {
    const res = await studentsAPI.removeCoins(studentId, amount, label, "behavior");
    setStudents(prev => prev.map(s => s._id === studentId ? { ...s, coins: res.student.coins } : s));
    setTransactions(prev => ({
      ...prev,
      [studentId]: [{ _id: Date.now(), label, type: "spend", amount: -amount, date: "Just now" }, ...(prev[studentId] || [])]
    }));
  };

  const spendCoins = async (userId, amount, itemName) => {
    try {
      await studentsAPI.removeCoins(userId, amount, itemName, "shop");
      setCurrentUser(prev => ({ ...prev, coins: (prev.coins || 0) - amount }));
      return true;
    } catch {
      return false;
    }
  };

  // ── Transactions ──────────────────────────────
  const loadTransactions = async (studentId) => {
    try {
      const txs = await studentsAPI.getTransactions(studentId);
      setTransactions(prev => ({ ...prev, [studentId]: txs }));
    } catch (err) {
      console.error(err);
    }
  };

  // ── Helpers ───────────────────────────────────
  const getStudentCoins = (id) => {
    const s = students.find(s => s._id === id);
    if (s) return s.coins || 0;
    if (currentUser?._id === id) return currentUser.coins || 0;
    return 0;
  };

  const getStudentTransactions = (id) => transactions[id] || [];

  // ── Shop ──────────────────────────────────────
  const addShopItem  = async (item) => {
    const res = await shopAPI.addItem(item);
    setShopItems(prev => [...prev, res]);
  };
  const removeShopItem = async (id) => {
    await shopAPI.deleteItem(id);
    setShopItems(prev => prev.filter(i => i._id !== id && i.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="text-5xl mb-3 animate-bounce">🪙</div>
          <p className="font-bold text-slate-500">Loading CoinEd...</p>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={{
      currentUser, login, logout,
      students, setStudents,
      shopItems, setShopItems,
      transactions,
      addCoins, removeCoins, spendCoins,
      addShopItem, removeShopItem,
      createStudent, deleteStudent,
      loadTransactions,
      getStudentCoins, getStudentTransactions,
      toast, showToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
