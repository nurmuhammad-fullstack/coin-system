// src/context/AppContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { authAPI, studentsAPI, shopAPI } from "../services/api";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [coins, setCoins]             = useState({});
  const [transactions, setTransactions] = useState({});
  const [shopItems, setShopItems]     = useState([]);
  const [toast, setToast]             = useState(null);
  const [loading, setLoading]         = useState(true);

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!localStorage.getItem('coined_token');
  };

  // Initialize - fetch data from backend (only if authenticated)
  useEffect(() => {
    const initData = async () => {
      // Only fetch data if user is logged in
      if (!isAuthenticated()) {
        setLoading(false);
        return;
      }

      try {
        // First try to get user info
        const userRes = await authAPI.me();
        setCurrentUser(userRes);

        // Fetch shop items (public for all users)
        const items = await shopAPI.getAll();
        setShopItems(items);

        // If teacher, fetch all students
        if (userRes.role === 'teacher') {
          const studentsRes = await studentsAPI.getAll();
          const coinsMap = {};
          studentsRes.forEach(s => { coinsMap[s._id] = s.coins; });
          setCoins(coinsMap);
        } else if (userRes.role === 'student') {
          // For students, load their own coins and transactions
          setCoins(prev => ({ ...prev, [userRes._id]: userRes.coins }));
          const txs = await studentsAPI.getTransactions(userRes._id);
          setTransactions(prev => ({ ...prev, [userRes._id]: txs }));
        }
      } catch (err) {
        console.error("Failed to load data:", err);
        // Token might be invalid, clear it
        localStorage.removeItem('coined_token');
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  // Also provide a way to refresh students
  const refreshStudents = async () => {
    try {
      const studentsRes = await studentsAPI.getAll();
      const coinsMap = {};
      studentsRes.forEach(s => { coinsMap[s._id] = s.coins; });
      setCoins(coinsMap);
      return studentsRes;
    } catch (err) {
      console.error("Failed to refresh students:", err);
      return [];
    }
  };

  /* ── Auth ── */
  const login = async (email, password) => {
    try {
      const res = await authAPI.login(email, password);
      localStorage.setItem('coined_token', res.token);
      setCurrentUser(res.user);

      // Load user-specific data after login
      if (res.user.role === 'student') {
        // Load student's own data
        setCoins(prev => ({ ...prev, [res.user._id]: res.user.coins }));
        try {
          const txs = await studentsAPI.getTransactions(res.user._id);
          setTransactions(prev => ({ ...prev, [res.user._id]: txs }));
        } catch (err) {
          console.error("Failed to load transactions:", err);
        }
      } else if (res.user.role === 'teacher') {
        // Load all students for teacher
        await refreshStudents();
        try {
          const items = await shopAPI.getAll();
          setShopItems(items);
        } catch (err) {
          console.error("Failed to load shop items:", err);
        }
      }

      return { ok: true, role: res.user.role };
    } catch (err) {
      return { ok: false, message: err.message };
    }
  };
  const logout = () => {
    localStorage.removeItem('coined_token');
    setCurrentUser(null);
    setCoins({});
    setTransactions({});
  };

  /* ── Toast ── */
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  /* ── Coins ── */
  const addCoins = async (studentId, amount, label = "Teacher Bonus") => {
    try {
      const res = await studentsAPI.addCoins(studentId, amount, label, "behavior");
      // Update local state with response
      setCoins(prev => ({ ...prev, [studentId]: res.student.coins }));
      // Add transaction locally
      addTransaction(studentId, {
        label,
        type: "earn",
        amount,
        date: "Just now",
        category: "behavior"
      });
      return true;
    } catch (err) {
      showToast(err.message, "error");
      return false;
    }
  };

  const removeCoins = async (studentId, amount, label = "Teacher Deduction") => {
    try {
      const res = await studentsAPI.removeCoins(studentId, amount, label, "behavior");
      // Update local state with response
      setCoins(prev => ({ ...prev, [studentId]: res.student.coins }));
      // Add transaction locally
      addTransaction(studentId, {
        label,
        type: "spend",
        amount: -amount,
        date: "Just now",
        category: "behavior"
      });
      return true;
    } catch (err) {
      showToast(err.message, "error");
      return false;
    }
  };

  const spendCoins = async (userId, amount, itemName, itemId) => {
    const currentCoins = coins[userId] || 0;
    if (currentCoins < amount) return false;
    try {
      // Call backend API to purchase item (pass itemId, not userId)
      const res = await shopAPI.buyItem(itemId);
      // Update local state with response from server
      setCoins(prev => ({ ...prev, [userId]: res.student.coins }));
      addTransaction(userId, { label: itemName, type: "spend", amount: -amount, date: "Just now", category: "shop" });
      return true;
    } catch (err) {
      showToast(err.message, "error");
      return false;
    }
  };

  /* ── Transactions ── */
  const loadTransactions = async (studentId) => {
    try {
      const txs = await studentsAPI.getTransactions(studentId);
      setTransactions(prev => ({
        ...prev,
        [studentId]: txs
      }));
    } catch (err) {
      console.error("Failed to load transactions:", err);
    }
  };

  const addTransaction = (userId, tx) => {
    setTransactions(prev => ({
      ...prev,
      [userId]: [{ id: Date.now(), ...tx }, ...(prev[userId] || [])]
    }));
  };

  /* ── Shop ── */
  const addShopItem = async (item) => {
    try {
      const newItem = await shopAPI.addItem(item);
      setShopItems(prev => [...prev, newItem]);
      return true;
    } catch (err) {
      showToast(err.message, "error");
      return false;
    }
  };

  const removeShopItem = async (id) => {
    try {
      await shopAPI.deleteItem(id);
      // Handle both _id and id formats
      setShopItems(prev => prev.filter(i => (i._id || i.id) !== id));
      return true;
    } catch (err) {
      showToast(err.message, "error");
      return false;
    }
  };

  /* ── Students (local only) ── */
  const deleteStudent = async (studentId) => {
    try {
      await studentsAPI.deleteOne(studentId);
      // Remove from coins
      setCoins(prev => {
        const newCoins = { ...prev };
        delete newCoins[studentId];
        return newCoins;
      });
      // Remove from transactions
      setTransactions(prev => {
        const newTx = { ...prev };
        delete newTx[studentId];
        return newTx;
      });
      return true;
    } catch (err) {
      showToast(err.message, "error");
      return false;
    }
  };

  /* ── Helpers ── */
  // For now, get students from local data - in production would fetch from API
  // Students will be fetched via refreshStudents function
  const [studentsList, setStudentsList] = useState([]);

  const getStudents = async () => {
    try {
      const res = await studentsAPI.getAll();
      setStudentsList(res);
      return res;
    } catch (err) {
      console.error("Failed to get students:", err);
      return [];
    }
  };

  const students = studentsList;
  const getStudentCoins = (id) => coins[id] || 0;
  const getStudentTransactions = (id) => transactions[id] || [];

  return (
    <AppContext.Provider value={{
      currentUser, login, logout,
      coins, transactions, shopItems,
      addCoins, removeCoins, spendCoins,
      addShopItem, removeShopItem,
      students, getStudents, refreshStudents,
      getStudentCoins, getStudentTransactions,
      loadTransactions, deleteStudent,
      toast, showToast, loading,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
