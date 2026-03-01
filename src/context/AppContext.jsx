// src/context/AppContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { authAPI, studentsAPI, shopAPI, quizzesAPI } from "../services/api";
import { FaCoins } from "react-icons/fa";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser]   = useState(null);
  const [students, setStudents]         = useState([]);
  const [shopItems, setShopItems]       = useState([]);
  const [transactions, setTransactions] = useState({});
  const [quizzes, setQuizzes]           = useState([]);
  const [quizzesLoaded, setQuizzesLoaded] = useState(false);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [toast, setToast]               = useState(null);
  const [loading, setLoading]           = useState(true);

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

  useEffect(() => {
    if (currentUser?.role === "teacher") {
      studentsAPI.getAll().then(setStudents).catch(console.error);
      shopAPI.getAll().then(setShopItems).catch(console.error);
      quizzesAPI.getAll().then((data) => { setQuizzes(data); setQuizzesLoaded(true); }).catch(console.error);
    }
    if (currentUser?.role === "student") {
      // Load all students for leaderboard
      studentsAPI.getAll().then(setStudents).catch(console.error);
      shopAPI.getAll().then(setShopItems).catch(console.error);
      quizzesAPI.getAll().then((data) => { setQuizzes(data); setQuizzesLoaded(true); }).catch(console.error);
      quizzesAPI.myAttempts().then(setQuizAttempts).catch(console.error);
      // Load student transactions
      studentsAPI.getTransactions(currentUser._id)
        .then(txs => setTransactions(prev => ({ ...prev, [currentUser._id]: txs })))
        .catch(console.error);
    }
  }, [currentUser]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const login = async (loginInput, password) => {
    try {
      const data = await authAPI.login(loginInput, password);
      localStorage.setItem("coined_token", data.token);
      setCurrentUser(data.user);
      return { ok: true, role: data.user.role };
    } catch (err) {
      return { ok: false, message: err.message || "Login failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("coined_token");
    setCurrentUser(null);
    setStudents([]);
    setShopItems([]);
    setTransactions({});
    setQuizzes([]);
    setQuizAttempts([]);
  };

  const createStudent = async (data) => {
    const res = await authAPI.createStudent(data);
    setStudents(prev => [...prev, res.user || res]);
    return res;
  };

  const deleteStudent = async (studentId) => {
    await studentsAPI.deleteOne(studentId);
    setStudents(prev => prev.filter(s => s._id !== studentId));
  };

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

  const loadTransactions = async (studentId) => {
    try {
      const txs = await studentsAPI.getTransactions(studentId);
      setTransactions(prev => ({ ...prev, [studentId]: txs }));
    } catch (err) {
      console.error(err);
    }
  };

  const getStudentCoins = (id) => {
    const s = students.find(s => s._id === id);
    if (s) return s.coins || 0;
    if (currentUser?._id === id) return currentUser.coins || 0;
    return 0;
  };

  const getStudentTransactions = (id) => transactions[id] || [];

  const addShopItem = async (item) => {
    const res = await shopAPI.addItem(item);
    setShopItems(prev => [...prev, res]);
  };

  const removeShopItem = async (id) => {
    await shopAPI.deleteItem(id);
    setShopItems(prev => prev.filter(i => i._id !== id && i.id !== id));
  };

  const createQuiz = async (data) => {
    const res = await quizzesAPI.create(data);
    setQuizzes(prev => [...prev, res]);
    return res;
  };

  const updateQuiz = async (id, data) => {
    const res = await quizzesAPI.update(id, data);
    setQuizzes(prev => prev.map(q => (q._id || q.id) === id ? res : q));
    return res;
  };

  const deleteQuiz = async (id) => {
    await quizzesAPI.delete(id);
    setQuizzes(prev => prev.filter(q => (q._id || q.id) !== id));
  };

  // ✅ timeTaken ham yuboriladi backend ga
  const submitQuizAttempt = async (quizId, answers, timeTaken = 0) => {
    const res = await quizzesAPI.submitAttempt(quizId, answers, timeTaken);
    setQuizAttempts(prev => [...prev, res.attempt || res]);
    if (res.coinsEarned > 0) {
      setCurrentUser(prev => ({ ...prev, coins: (prev.coins || 0) + res.coinsEarned }));
    }
    return res;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-slate-50 min-h-screen">
        <div className="text-center">
          <div className="mb-3 text-5xl animate-bounce">
            <FaCoins />
          </div>
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
      quizzes, setQuizzes, quizzesLoaded, setQuizzesLoaded,
      quizAttempts, setQuizAttempts,
      createQuiz, updateQuiz, deleteQuiz,
      submitQuizAttempt,
      toast, showToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);