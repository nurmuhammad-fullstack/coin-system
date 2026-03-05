// src/pages/teacher/TeacherAnalyticsPage.jsx
import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { analyticsAPI } from "../../services/api";
import { Avatar, SectionLabel, Modal } from "../../components/ui";
import { 
  FaUsers, FaClipboardList, FaCoins, FaStore, FaChartLine, FaChartBar,
  FaTrophy, FaClock, FaCheckCircle, FaArrowUp, FaArrowDown, FaShoppingCart,
  FaGraduationCap, FaStar, FaPercentage, FaHistory, FaMedal
} from "react-icons/fa";

export default function TeacherAnalyticsPage() {
  const { showToast } = useApp();
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [quizStats, setQuizStats] = useState([]);
  const [studentStats, setStudentStats] = useState([]);
  const [coinStats, setCoinStats] = useState(null);
  const [shopStats, setShopStats] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const [overviewData, quizData, studentData, coinData, shopData] = await Promise.all([
        analyticsAPI.getOverview(),
        analyticsAPI.getQuizzes(),
        analyticsAPI.getStudents(),
        analyticsAPI.getCoins(),
        analyticsAPI.getShop(),
      ]);
      setOverview(overviewData);
      setQuizStats(quizData);
      setStudentStats(studentData);
      setCoinStats(coinData);
      setShopStats(shopData);
    } catch (err) {
      showToast("Failed to load analytics: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="border-indigo-500 border-b-2 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: FaChartLine },
    { id: "quizzes", label: "Quizzes", icon: FaClipboardList },
    { id: "students", label: "Students", icon: FaUsers },
    { id: "coins", label: "Coins", icon: FaCoins },
    { id: "shop", label: "Shop", icon: FaStore },
  ];

  return (
    <div className="space-y-5 mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-0 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className="font-semibold text-slate-500 dark:text-slate-400 text-xs">Teacher Dashboard</p>
          <h2 className="font-poppins font-black text-slate-800 dark:text-white text-2xl md:text-3xl">
            Analytics
          </h2>
        </div>
        <button
          onClick={loadAnalytics}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 px-4 py-2 border-none rounded-full font-extrabold text-white text-sm transition-colors cursor-pointer"
        >
          <FaChartLine /> Refresh
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 pb-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={
              "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap border-none cursor-pointer transition-all " +
              (activeTab === tab.id
                ? "bg-indigo-500 text-white"
                : "bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600")
            }
          >
            <tab.icon /> {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && overview && (
        <div className="space-y-5">
          {/* Main Stats Cards */}
          <div className="gap-3 grid grid-cols-2 md:grid-cols-4">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-5 rounded-2xl text-white">
              <div className="flex justify-between items-center mb-2">
                <FaUsers className="opacity-80 text-2xl" />
                <FaArrowUp className="text-green-400" />
              </div>
              <p className="opacity-80 mb-1 font-bold text-xs uppercase tracking-wider">Students</p>
              <p className="font-poppins font-black text-3xl">{overview.totalStudents}</p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-5 rounded-2xl text-white">
              <div className="flex justify-between items-center mb-2">
                <FaClipboardList className="opacity-80 text-2xl" />
                <FaArrowUp className="text-green-400" />
              </div>
              <p className="opacity-80 mb-1 font-bold text-xs uppercase tracking-wider">Quizzes</p>
              <p className="font-poppins font-black text-3xl">{overview.totalQuizzes}</p>
            </div>
            
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-5 rounded-2xl text-white">
              <div className="flex justify-between items-center mb-2">
                <FaCoins className="opacity-80 text-2xl" />
                <FaArrowUp className="text-green-400" />
              </div>
              <p className="opacity-80 mb-1 font-bold text-xs uppercase tracking-wider">Coins Distributed</p>
              <p className="font-poppins font-black text-3xl">{overview.totalCoinsDistributed?.toLocaleString() || 0}</p>
            </div>
            
            <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 rounded-2xl text-white">
              <div className="flex justify-between items-center mb-2">
                <FaPercentage className="opacity-80 text-2xl" />
              </div>
              <p className="opacity-80 mb-1 font-bold text-xs uppercase tracking-wider">Avg Score</p>
              <p className="font-poppins font-black text-3xl">{overview.avgScore}%</p>
            </div>
          </div>

          {/* Secondary Stats */}
          <div className="gap-3 grid grid-cols-2 md:grid-cols-4">
            <div className="bg-white dark:bg-slate-800 p-5 border border-slate-100 dark:border-slate-700 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex justify-center items-center bg-purple-100 dark:bg-purple-900/30 rounded-xl w-10 h-10">
                  <FaGraduationCap className="text-purple-500" />
                </div>
                <span className="font-semibold text-slate-500 dark:text-slate-400 text-xs">Classes</span>
              </div>
              <p className="font-poppins font-black text-slate-800 dark:text-white text-2xl">{overview.totalClasses}</p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-5 border border-slate-100 dark:border-slate-700 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex justify-center items-center bg-amber-100 dark:bg-amber-900/30 rounded-xl w-10 h-10">
                  <FaCheckCircle className="text-amber-500" />
                </div>
                <span className="font-semibold text-slate-500 dark:text-slate-400 text-xs">Attempts</span>
              </div>
              <p className="font-poppins font-black text-slate-800 dark:text-white text-2xl">{overview.totalAttempts}</p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-5 border border-slate-100 dark:border-slate-700 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex justify-center items-center bg-red-100 dark:bg-red-900/30 rounded-xl w-10 h-10">
                  <FaShoppingCart className="text-red-500" />
                </div>
                <span className="font-semibold text-slate-500 dark:text-slate-400 text-xs">Spent</span>
              </div>
              <p className="font-poppins font-black text-slate-800 dark:text-white text-2xl">{overview.totalCoinsSpent?.toLocaleString() || 0}</p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-5 border border-slate-100 dark:border-slate-700 rounded-2xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="flex justify-center items-center bg-cyan-100 dark:bg-cyan-900/30 rounded-xl w-10 h-10">
                  <FaChartBar className="text-cyan-500" />
                </div>
                <span className="font-semibold text-slate-500 dark:text-slate-400 text-xs">Active Rate</span>
              </div>
              <p className="font-poppins font-black text-slate-800 dark:text-white text-2xl">
                {overview.totalStudents > 0 
                  ? Math.round((overview.totalAttempts / overview.totalStudents) * 100) 
                  : 0}%
              </p>
            </div>
          </div>

          {/* Recent Quiz Performance */}
          {quizStats.length > 0 && (
            <div className="bg-white dark:bg-slate-800 p-5 border border-slate-100 dark:border-slate-700 rounded-2xl">
              <SectionLabel>Recent Quiz Performance</SectionLabel>
              <div className="space-y-3 mt-3">
                {quizStats.slice(0, 5).map((quiz) => (
                  <div key={quiz._id} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl">
                    <div className="flex-1 min-w-0">
                      <p className="font-extrabold text-slate-800 dark:text-white text-sm truncate">{quiz.title}</p>
                      <p className="text-slate-400 dark:text-slate-500 text-xs">{quiz.subject} • Class {quiz.class}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-indigo-500 text-lg">{quiz.avgScore}%</p>
                      <p className="text-slate-400 dark:text-slate-500 text-xs">avg score</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-green-500 text-lg">{quiz.totalAttempts}</p>
                      <p className="text-slate-400 dark:text-slate-500 text-xs">attempts</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quizzes Tab */}
      {activeTab === "quizzes" && (
        <div className="space-y-5">
          {quizStats.length === 0 ? (
            <div className="py-12 text-slate-400 dark:text-slate-500 text-center">
              <FaClipboardList className="inline-block mb-3 text-slate-300 dark:text-slate-600 text-5xl" />
              <p className="font-bold dark:text-slate-400 text-sm">No quizzes yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {quizStats.map((quiz) => (
                <div key={quiz._id} className="bg-white dark:bg-slate-800 p-5 border border-slate-100 dark:border-slate-700 rounded-2xl">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-slate-800 dark:text-white text-lg">{quiz.title}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${quiz.active ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {quiz.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <p className="text-slate-400 dark:text-slate-500 text-sm">{quiz.subject} • Class {quiz.class}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-indigo-500 text-2xl">{quiz.avgScore}%</p>
                      <p className="text-slate-400 dark:text-slate-500 text-xs">average score</p>
                    </div>
                  </div>
                  
                  <div className="gap-3 grid grid-cols-4">
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl text-center">
                      <FaUsers className="mx-auto mb-1 text-slate-400" />
                      <p className="font-black text-slate-700 dark:text-white text-lg">{quiz.totalAttempts}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">Attempts</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl text-center">
                      <FaClock className="mx-auto mb-1 text-slate-400" />
                      <p className="font-black text-slate-700 dark:text-white text-lg">{quiz.avgTime}s</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">Avg Time</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl text-center">
                      <FaCoins className="mx-auto mb-1 text-amber-500" />
                      <p className="font-black text-slate-700 dark:text-white text-lg">{quiz.totalCoinsEarned}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">Coins Earned</p>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl text-center">
                      <FaStar className="mx-auto mb-1 text-amber-500" />
                      <p className="font-black text-slate-700 dark:text-white text-lg">{quiz.maxCoins}</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">Max Coins</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Students Tab */}
      {activeTab === "students" && (
        <div className="space-y-5">
          {studentStats.length === 0 ? (
            <div className="py-12 text-slate-400 dark:text-slate-500 text-center">
              <FaUsers className="inline-block mb-3 text-slate-300 dark:text-slate-600 text-5xl" />
              <p className="font-bold dark:text-slate-400 text-sm">No students yet</p>
            </div>
          ) : (
            <>
              {/* Top Performers */}
              <div className="bg-white dark:bg-slate-800 p-5 border border-slate-100 dark:border-slate-700 rounded-2xl">
                <SectionLabel>Top Performers</SectionLabel>
                <div className="space-y-3 mt-3">
                  {studentStats.slice(0, 5).map((student, index) => (
                    <div key={student._id} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl">
                      <span className="w-6 font-black text-center">
                        {index === 0 ? <FaTrophy className="mx-auto text-yellow-500" /> :
                         index === 1 ? <FaMedal className="mx-auto text-gray-400" /> :
                         index === 2 ? <FaMedal className="mx-auto text-amber-600" /> :
                         <span className="text-slate-400">#{index + 1}</span>}
                      </span>
                      <Avatar user={student} size={40} />
                      <div className="flex-1 min-w-0">
                        <p className="font-extrabold text-slate-800 dark:text-white text-sm truncate">{student.name}</p>
                        <p className="text-slate-400 dark:text-slate-500 text-xs">Class {student.class}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-indigo-500 text-lg">{student.avgScore}%</p>
                        <p className="text-slate-400 dark:text-slate-500 text-xs">avg score</p>
                      </div>
                      <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/30 px-3 py-1 rounded-full">
                        <FaCoins className="text-amber-500 text-sm" />
                        <span className="font-black text-amber-600 dark:text-amber-400 text-sm">{student.currentCoins}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* All Students Stats */}
              <div className="bg-white dark:bg-slate-800 p-5 border border-slate-100 dark:border-slate-700 rounded-2xl">
                <SectionLabel>All Students ({studentStats.length})</SectionLabel>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-slate-400 dark:text-slate-500 text-xs text-left uppercase">
                        <th className="pb-3 font-bold">Student</th>
                        <th className="pb-3 font-bold">Quizzes</th>
                        <th className="pb-3 font-bold">Avg Score</th>
                        <th className="pb-3 font-bold">Coins Earned</th>
                        <th className="pb-3 font-bold">Coins Spent</th>
                        <th className="pb-3 font-bold text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {studentStats.map((student) => (
                        <tr key={student._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <Avatar user={student} size={32} />
                              <div>
                                <p className="font-extrabold text-slate-800 dark:text-white text-sm">{student.name}</p>
                                <p className="text-slate-400 dark:text-slate-500 text-xs">Class {student.class}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 font-medium text-slate-600 dark:text-slate-300">{student.totalQuizzesTaken}</td>
                          <td className="py-3">
                            <span className={`font-bold ${student.avgScore >= 70 ? 'text-green-500' : student.avgScore >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                              {student.avgScore}%
                            </span>
                          </td>
                          <td className="py-3 font-medium text-green-500">+{student.coinsEarned}</td>
                          <td className="py-3 font-medium text-red-500">-{student.coinsSpent}</td>
                          <td className="py-3 text-right">
                            <span className="font-black text-amber-500">{student.currentCoins}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Coins Tab */}
      {activeTab === "coins" && coinStats && (
        <div className="space-y-5">
          {/* Summary Cards */}
          <div className="gap-3 grid grid-cols-2 md:grid-cols-4">
            <div className="bg-white dark:bg-slate-800 p-5 border border-slate-100 dark:border-slate-700 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <FaArrowUp className="text-green-500" />
                <span className="font-semibold text-slate-500 dark:text-slate-400 text-xs">Total Earned</span>
              </div>
              <p className="font-poppins font-black text-green-500 text-2xl">
                {coinStats.byType?.find(t => t._id === 'earn')?.totalAmount?.toLocaleString() || 0}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-5 border border-slate-100 dark:border-slate-700 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <FaArrowDown className="text-red-500" />
                <span className="font-semibold text-slate-500 dark:text-slate-400 text-xs">Total Spent</span>
              </div>
              <p className="font-poppins font-black text-red-500 text-2xl">
                {coinStats.byType?.find(t => t._id === 'spend')?.totalAmount?.toLocaleString() || 0}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-5 border border-slate-100 dark:border-slate-700 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <FaHistory className="text-slate-400" />
                <span className="font-semibold text-slate-500 dark:text-slate-400 text-xs">Transactions</span>
              </div>
              <p className="font-poppins font-black text-slate-800 dark:text-white text-2xl">
                {coinStats.totalTransactions}
              </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-5 border border-slate-100 dark:border-slate-700 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <FaChartBar className="text-indigo-500" />
                <span className="font-semibold text-slate-500 dark:text-slate-400 text-xs">Categories</span>
              </div>
              <p className="font-poppins font-black text-slate-800 dark:text-white text-2xl">
                {coinStats.byCategory?.length || 0}
              </p>
            </div>
          </div>

          {/* By Category */}
          <div className="gap-5 grid md:grid-cols-2">
            <div className="bg-white dark:bg-slate-800 p-5 border border-slate-100 dark:border-slate-700 rounded-2xl">
              <SectionLabel>By Category</SectionLabel>
              <div className="space-y-3 mt-3">
                {coinStats.byCategory?.map((cat) => (
                  <div key={cat._id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className="bg-indigo-500 rounded-full w-2 h-2"></span>
                      <span className="font-medium text-slate-700 dark:text-slate-300 capitalize">{cat._id || 'Other'}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-slate-800 dark:text-white">{cat.totalAmount.toLocaleString()}</p>
                      <p className="text-slate-400 dark:text-slate-500 text-xs">{cat.count} transactions</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white dark:bg-slate-800 p-5 border border-slate-100 dark:border-slate-700 rounded-2xl">
              <SectionLabel>Recent Transactions</SectionLabel>
              <div className="space-y-3 mt-3 max-h-80 overflow-y-auto">
                {coinStats.recentTransactions?.map((tx) => (
                  <div key={tx._id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.type === 'earn' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                        {tx.type === 'earn' ? <FaArrowUp className="text-green-500" /> : <FaArrowDown className="text-red-500" />}
                      </div>
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white text-sm">{tx.label}</p>
                        <p className="text-slate-400 dark:text-slate-500 text-xs">{tx.student?.name || 'Unknown'}</p>
                      </div>
                    </div>
                    <p className={`font-black ${tx.type === 'earn' ? 'text-green-500' : 'text-red-500'}`}>
                      {tx.type === 'earn' ? '+' : '-'}{Math.abs(tx.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shop Tab */}
      {activeTab === "shop" && shopStats && (
        <div className="space-y-5">
          {/* Summary Cards */}
          <div className="gap-3 grid grid-cols-2 md:grid-cols-4">
            <div className="bg-gradient-to-br from-green-500 to-green-700 p-5 rounded-2xl text-white">
              <FaCoins className="opacity-80 mb-2 text-2xl" />
              <p className="opacity-80 mb-1 font-bold text-xs uppercase tracking-wider">Total Revenue</p>
              <p className="font-poppins font-black text-3xl">{shopStats.totalRevenue?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-5 rounded-2xl text-white">
              <FaShoppingCart className="opacity-80 mb-2 text-2xl" />
              <p className="opacity-80 mb-1 font-bold text-xs uppercase tracking-wider">Total Purchases</p>
              <p className="font-poppins font-black text-3xl">{shopStats.totalPurchases}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-5 rounded-2xl text-white">
              <FaStore className="opacity-80 mb-2 text-2xl" />
              <p className="opacity-80 mb-1 font-bold text-xs uppercase tracking-wider">Active Items</p>
              <p className="font-poppins font-black text-3xl">{shopStats.activeItems}</p>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-5 rounded-2xl text-white">
              <FaStar className="opacity-80 mb-2 text-2xl" />
              <p className="opacity-80 mb-1 font-bold text-xs uppercase tracking-wider">Top Item</p>
              <p className="font-poppins font-black text-lg truncate">
                {shopStats.topItems?.[0]?.name || 'N/A'}
              </p>
            </div>
          </div>

          {/* Top Items */}
          <div className="bg-white dark:bg-slate-800 p-5 border border-slate-100 dark:border-slate-700 rounded-2xl">
            <SectionLabel>Top Selling Items</SectionLabel>
            <div className="space-y-3 mt-3">
              {shopStats.topItems?.map((item, index) => (
                <div key={index} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl">
                  <span className="w-6 font-black text-slate-400 text-center">#{index + 1}</span>
                  <div className="flex-1">
                    <p className="font-extrabold text-slate-800 dark:text-white">{item.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-slate-800 dark:text-white">{item.totalPurchases}</p>
                    <p className="text-slate-400 dark:text-slate-500 text-xs">sold</p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 px-3 py-1 rounded-full">
                    <FaCoins className="text-amber-500 text-sm" />
                    <span className="font-black text-amber-600 dark:text-amber-400">{item.totalCoinsSpent}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Purchases */}
          <div className="bg-white dark:bg-slate-800 p-5 border border-slate-100 dark:border-slate-700 rounded-2xl">
            <SectionLabel>Recent Purchases</SectionLabel>
            <div className="space-y-3 mt-3">
              {shopStats.recentPurchases?.map((purchase, index) => (
                <div key={index} className="flex items-center gap-4 bg-slate-50 dark:bg-slate-700/50 p-3 rounded-xl">
                  <div className="flex justify-center items-center bg-purple-100 dark:bg-purple-900/30 rounded-xl w-10 h-10">
                    <FaShoppingCart className="text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800 dark:text-white">{purchase.label}</p>
                    <p className="text-slate-400 dark:text-slate-500 text-xs">{purchase.student?.name} • Class {purchase.student?.class}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-red-50 dark:bg-red-900/30 px-3 py-1 rounded-full">
                    <FaCoins className="text-red-500 text-sm" />
                    <span className="font-black text-red-600 dark:text-red-400">-{Math.abs(purchase.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

