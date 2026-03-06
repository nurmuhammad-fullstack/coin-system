// src/pages/teacher/TeacherQuizResultsPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Avatar } from "../../components/ui";
import { useApp } from "../../context/AppContext";

export default function TeacherQuizResultsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useApp();

  const [quiz, setQuiz]         = useState(null);
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(true);

  const token = localStorage.getItem("coined_token");
  const API   = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  useEffect(() => {
    const load = async () => {
      try {
        const [qRes, rRes] = await Promise.all([
          fetch(`${API}/quizzes/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API}/quizzes/${id}/results`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const quizData = await qRes.json();
        const resultsData = await rRes.json();
        
        // Check if responses are OK
        if (!qRes.ok) {
          console.error('Quiz fetch error:', quizData);
          showToast("❌ " + (quizData.message || "Failed to load quiz"), "error");
          return;
        }
        if (!rRes.ok) {
          console.error('Results fetch error:', resultsData);
          showToast("❌ " + (resultsData.message || "Failed to load results"), "error");
          setResults([]);
        } else {
          setResults(resultsData);
        }
        setQuiz(quizData);
      } catch (err) { 
        console.error(err); 
        showToast("❌ " + (err.message || "Failed to load data"), "error");
      }
      finally { setLoading(false); }
    };
    load();
  }, [id, API, token, showToast]);

  if (loading) return <div className="p-6 font-bold text-slate-400 dark:text-slate-500 text-center">Yuklanmoqda...</div>;
  if (!quiz)   return <div className="p-6 font-bold text-slate-400 dark:text-slate-500 text-center">Test topilmadi</div>;

  const avgScore = results.length
    ? Math.round(results.reduce((a, r) => a + r.score, 0) / results.length) : 0;
  const totalCoins = results.reduce((a, r) => a + r.coinsEarned, 0);

  return (
    <div className="space-y-5 mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-0 max-w-7xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/teacher/quizzes")}
          className="flex justify-center items-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 border-none rounded-xl w-9 h-9 text-slate-600 dark:text-slate-300 cursor-pointer">
          ←
        </button>
        <div>
          <h2 className="font-poppins font-black text-slate-800 dark:text-white text-xl">{quiz.title}</h2>
          <p className="text-slate-400 dark:text-slate-500 text-xs">{quiz.questions?.length} savol • max 🪙{quiz.maxCoins}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="gap-3 grid grid-cols-3">
        <div className="bg-violet-500 p-4 rounded-2xl text-white text-center">
          <p className="opacity-80 mb-1 font-bold text-[10px] uppercase">Ishtirokchi</p>
          <p className="font-poppins font-black text-3xl">{results.length}</p>
        </div>
        <div className="bg-blue-500 p-4 rounded-2xl text-white text-center">
          <p className="opacity-80 mb-1 font-bold text-[10px] uppercase">O'rtacha</p>
          <p className="font-poppins font-black text-3xl">{avgScore}%</p>
        </div>
        <div className="bg-amber-500 p-4 rounded-2xl text-white text-center">
          <p className="opacity-80 mb-1 font-bold text-[10px] uppercase">Coin berildi</p>
          <p className="font-poppins font-black text-3xl">{totalCoins}</p>
        </div>
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <div className="py-12 text-slate-400 dark:text-slate-500 text-center">
          <div className="mb-3 text-5xl">📭</div>
          <p className="font-bold dark:text-slate-400">Hali hech kim yechmagan</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="font-extrabold text-slate-400 dark:text-slate-500 text-xs uppercase tracking-wider">Natijalar</p>
          {results.map((r, i) => {
            const medals = ["🥇","🥈","🥉"];
            const scoreColor = r.score >= 80 ? "text-green-600 dark:text-green-400" : r.score >= 50 ? "text-amber-500" : "text-red-500 dark:text-red-400";
            return (
              <div key={r._id} className="flex items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl">
                <span className="w-7 font-black text-center">{medals[i] || `#${i+1}`}</span>
                <Avatar user={r.student} size={40} />
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-slate-800 dark:text-white text-sm">{r.student?.name}</p>
                  <p className="text-slate-400 dark:text-slate-500 text-xs">
                    ⏱ {Math.floor((r.timeTaken || 0) / 60)}:{String((r.timeTaken || 0) % 60).padStart(2,'0')} min
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-poppins font-black text-lg ${scoreColor}`}>{r.score}%</p>
                  <p className="font-bold text-brand-600 dark:text-brand-400 text-xs">+🪙{r.coinsEarned}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

