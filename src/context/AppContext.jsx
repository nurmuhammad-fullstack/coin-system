// src/context/AppContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import {
  authAPI,
  studentsAPI,
  shopAPI,
  quizzesAPI,
  notificationsAPI,
  classesAPI,
  scheduleAPI,
} from "../services/api";
import { APP_NAME } from "../config/appConfig";
import { FaCoins } from "react-icons/fa";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [shopItems, setShopItems] = useState([]);
  const [transactions, setTransactions] = useState({});
  const [quizzes, setQuizzes] = useState([]);
  const [quizzesLoaded, setQuizzesLoaded] = useState(false);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [classes, setClasses] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("coined_dark_mode");
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("coined_dark_mode", JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    const token = localStorage.getItem("coined_token");
    if (token) {
      authAPI
        .me()
        .then((user) => setCurrentUser(user))
        .catch(() => localStorage.removeItem("coined_token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser?.role === "teacher") {
      // ✅ Teacher — barcha studentlarni ko'radi
      studentsAPI.getAll().then(setStudents).catch(console.error);
      shopAPI.getAll().then(setShopItems).catch(console.error);
      quizzesAPI
        .getAll()
        .then((data) => {
          setQuizzes(data);
          setQuizzesLoaded(true);
        })
        .catch(console.error);
      classesAPI.getAll().then(setClasses).catch(console.error);
    }
    if (currentUser?.role === "student") {
      studentsAPI.getLeaderboard().then(setStudents).catch(console.error);
      shopAPI.getAll().then(setShopItems).catch(console.error);
      quizzesAPI
        .getAll()
        .then((data) => {
          setQuizzes(data);
          setQuizzesLoaded(true);
        })
        .catch(console.error);
      classesAPI.getForStudent().then(setClasses).catch(console.error);
      quizzesAPI.myAttempts().then(setQuizAttempts).catch(console.error);
      studentsAPI
        .getTransactions(currentUser._id)
        .then((txs) =>
          setTransactions((prev) => ({ ...prev, [currentUser._id]: txs })),
        )
        .catch(console.error);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      notificationsAPI.getAll().then(setNotifications).catch(console.error);
      notificationsAPI
        .getUnreadCount()
        .then((data) => setUnreadCount(data.count))
        .catch(console.error);
    }
  }, [currentUser]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const login = async (email, password) => {
    try {
      const data = await authAPI.login(email, password);
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

  const updateCurrentUser = async (data) => {
    try {
      await authAPI.updateProfile(data);
      const freshUser = await authAPI.me();
      setCurrentUser(freshUser);
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.message };
    }
  };

  const uploadAvatar = async (file) => {
    try {
      await authAPI.uploadAvatar(file);
      const freshUser = await authAPI.me();
      setCurrentUser(freshUser);
      return { ok: true, avatar: freshUser.avatar };
    } catch (err) {
      return { ok: false, message: err.message };
    }
  };

  const refreshClasses = async () => {
    try {
      const data = await classesAPI.getAll();
      setClasses(data);
    } catch (err) {
      console.error("Failed to refresh classes:", err);
    }
  };

  const createStudent = async (data) => {
    try {
      const res = await authAPI.createStudent(data);
      setStudents((prev) => [...prev, res.user || res]);
      // Sync classes in case a new one was created
      refreshClasses();
      return { ok: true, user: res.user || res };
    } catch (err) {
      return { ok: false, message: err.message || "Failed to create student" };
    }
  };

  const deleteStudent = async (studentId) => {
    try {
      await studentsAPI.deleteOne(studentId);
      setStudents((prev) => prev.filter((s) => s._id !== studentId));
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.message || "Failed to delete student" };
    }
  };

  const updateStudent = async (studentId, data) => {
    try {
      const res = await studentsAPI.updateOne(studentId, data);
      const updatedStudent = res.student || res.user || res;
      setStudents((prev) =>
        prev.map((s) =>
          s._id === studentId ? { ...s, ...updatedStudent } : s,
        ),
      );
      return { ok: true, student: updatedStudent };
    } catch (err) {
      return { ok: false, message: err.message || "Failed to update student" };
    }
  };

  const addCoins = async (studentId, amount, label = "Teacher Bonus") => {
    try {
      const res = await studentsAPI.addCoins(
        studentId,
        amount,
        label,
        "behavior",
      );
      setStudents((prev) =>
        prev.map((s) =>
          s._id === studentId ? { ...s, coins: res.student.coins } : s,
        ),
      );
      setTransactions((prev) => ({
        ...prev,
        [studentId]: [
          { _id: Date.now(), label, type: "earn", amount, date: "Just now" },
          ...(prev[studentId] || []),
        ],
      }));
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.message || "Failed to add coins" };
    }
  };

  const removeCoins = async (
    studentId,
    amount,
    label = "Teacher Deduction",
  ) => {
    try {
      const res = await studentsAPI.removeCoins(
        studentId,
        amount,
        label,
        "behavior",
      );
      setStudents((prev) =>
        prev.map((s) =>
          s._id === studentId ? { ...s, coins: res.student.coins } : s,
        ),
      );
      setTransactions((prev) => ({
        ...prev,
        [studentId]: [
          {
            _id: Date.now(),
            label,
            type: "spend",
            amount: -amount,
            date: "Just now",
          },
          ...(prev[studentId] || []),
        ],
      }));
      return { ok: true };
    } catch (err) {
      return { ok: false, message: err.message || "Failed to remove coins" };
    }
  };

  const spendCoins = async (itemId, amount) => {
    try {
      const purchase = await shopAPI.buyItem(itemId);
      setCurrentUser((prev) => ({
        ...prev,
        coins:
          purchase.student?.coins ?? Math.max(0, (prev.coins || 0) - amount),
      }));
      return true;
    } catch {
      return false;
    }
  };

  const loadTransactions = async (studentId) => {
    try {
      const txs = await studentsAPI.getTransactions(studentId);
      setTransactions((prev) => ({ ...prev, [studentId]: txs }));
    } catch (err) {
      console.error(err);
    }
  };

  const getStudentCoins = (id) => {
    const s = students.find((s) => s._id === id);
    if (s) return s.coins || 0;
    if (currentUser?._id === id) return currentUser.coins || 0;
    return 0;
  };

  const getStudentTransactions = (id) => transactions[id] || [];

  const addShopItem = async (item) => {
    const res = await shopAPI.addItem(item);
    setShopItems((prev) => [...prev, res]);
  };

  const removeShopItem = async (id) => {
    await shopAPI.deleteItem(id);
    setShopItems((prev) => prev.filter((i) => i._id !== id && i.id !== id));
  };

  const createQuiz = async (data) => {
    const res = await quizzesAPI.create(data);
    setQuizzes((prev) => [...prev, res]);
    return res;
  };

  const updateQuiz = async (id, data) => {
    const res = await quizzesAPI.update(id, data);
    setQuizzes((prev) => prev.map((q) => ((q._id || q.id) === id ? res : q)));
    return res;
  };

  const deleteQuiz = async (id) => {
    await quizzesAPI.delete(id);
    setQuizzes((prev) => prev.filter((q) => (q._id || q.id) !== id));
  };

  const submitQuizAttempt = async (quizId, answers, timeTaken = 0) => {
    const res = await quizzesAPI.submitAttempt(quizId, answers, timeTaken);
    setQuizAttempts((prev) => [...prev, res.attempt || res]);
    if (res.coinsEarned > 0) {
      setCurrentUser((prev) => ({
        ...prev,
        coins: (prev.coins || 0) + res.coinsEarned,
      }));
    }
    return res;
  };

  const createClass = async (data) => {
    const res = await classesAPI.create(data);
    setClasses((prev) => [...prev, res]);
    return res;
  };

  const updateClass = async (id, data) => {
    const res = await classesAPI.update(id, data);
    setClasses((prev) => prev.map((c) => ((c._id || c.id) === id ? res : c)));
    return res;
  };

  const deleteClass = async (id) => {
    await classesAPI.delete(id);
    setClasses((prev) => prev.filter((c) => (c._id || c.id) !== id));
  };

  const loadNotifications = async () => {
    try {
      const data = await notificationsAPI.getAll();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    }
  };

  const markNotificationAsRead = async (id) => {
    try {
      await notificationsAPI.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllNotificationsAsRead = async () => {
    try {
      await notificationsAPI.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  const clearAllNotifications = async () => {
    try {
      await notificationsAPI.clearAll();
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error(err);
    }
  };

  // Schedule methods
  const getScheduleForClass = async (classId) => {
    try {
      return await scheduleAPI.getForClass(classId);
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const updateScheduleForClass = async (classId, data) => {
    try {
      const res = await scheduleAPI.updateForClass(classId, data);
      return { ok: true, schedule: res };
    } catch (err) {
      return { ok: false, message: err.message };
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-slate-50 dark:bg-slate-900 min-h-screen">
        <div className="text-center">
          <div className="mb-3 text-5xl animate-bounce">
            <FaCoins />
          </div>
          <p className="font-bold text-slate-500 dark:text-slate-400">
            Loading {APP_NAME}...
          </p>
        </div>
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        logout,
        updateCurrentUser,
        uploadAvatar,
        students,
        setStudents,
        shopItems,
        setShopItems,
        transactions,
        addCoins,
        removeCoins,
        spendCoins,
        addShopItem,
        removeShopItem,
        createStudent,
        updateStudent,
        deleteStudent,
        loadTransactions,
        getStudentCoins,
        getStudentTransactions,
        quizzes,
        setQuizzes,
        quizzesLoaded,
        setQuizzesLoaded,
        quizAttempts,
        setQuizAttempts,
        createQuiz,
        updateQuiz,
        deleteQuiz,
        submitQuizAttempt,
        classes,
        setClasses,
        createClass,
        updateClass,
        deleteClass,
        notifications,
        unreadCount,
        loadNotifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearAllNotifications,
        toast,
        showToast,
        darkMode,
        toggleDarkMode,
        getScheduleForClass,
        updateScheduleForClass,
        refreshClasses,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
