// src/pages/student/StudentQuizPage.jsx
import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const TOTAL_SECONDS = 12 * 60;

export default function StudentQuizPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, quizzes, quizAttempts, submitQuizAttempt } = useApp();

  const quiz      = quizzes?.find(q => (q._id || q.id) === id);
  const questions = useMemo(() => quiz?.questions || [], [quiz]);
  const totalQ    = questions.length;

  const alreadyDone = quizAttempts?.find(
    a => (a.quizId === id || a.quiz === id || (a.quiz?._id || a.quiz) === id) &&
         (a.studentId === currentUser?._id || a.student === currentUser?._id || (a.student?._id || a.student) === currentUser?._id)
  );

  const [phase, setPhase]         = useState("intro");
  const [current, setCurrent]     = useState(0);
  const [answers, setAnswers]     = useState([]);
  const [selected, setSelected]   = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [timeLeft, setTimeLeft]   = useState(TOTAL_SECONDS);
  const [result, setResult]       = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [animDir, setAnimDir]     = useState("in");
  const startTimeRef              = useRef(null);
  const handleSubmitRef           = useRef(null);

  const formatTime = (s) =>
    `${String(Math.floor(s / 60)).padStart(2,"0")}:${String(s % 60).padStart(2,"0")}`;

  const timerPct   = (timeLeft / TOTAL_SECONDS) * 100;
  const timerColor = timerPct > 50 ? "#22c55e" : timerPct > 25 ? "#f59e0b" : "#ef4444";
  const circumference = 2 * Math.PI * 36;
  const strokeDash    = circumference - (timerPct / 100) * circumference;

  const handleSelect = (idx) => { if (!confirmed) setSelected(idx); };

  const handleConfirm = () => {
    if (selected === null) return;
    setConfirmed(true);
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);

    setTimeout(() => {
      if (current + 1 >= totalQ) {
        if (handleSubmitRef.current) handleSubmitRef.current(newAnswers);
      } else {
        setAnimDir("out");
        setTimeout(() => {
          setCurrent(c => c + 1);
          setSelected(null);
          setConfirmed(false);
          setAnimDir("in");
        }, 300);
      }
    }, 800);
  };

  const handleSubmit = useCallback(async (finalAnswers) => {
    if (submitting) return;
    setSubmitting(true);
    const timeTaken = startTimeRef.current
      ? Math.round((Date.now() - startTimeRef.current) / 1000)
      : 0;
    try {
      const res = await submitQuizAttempt(id, finalAnswers, timeTaken);
      setResult(res);
      setPhase("result");
    } catch (err) {
      if (err.message?.includes("Already completed")) {
        navigate("/student/tests");
        return;
      }
      let correct = 0;
      finalAnswers.forEach((ans, i) => {
        if (questions[i] && Number(ans) === Number(questions[i].correct)) correct++;
      });
      const score = Math.round((correct / totalQ) * 100);
      const coinsEarned = Math.round((quiz?.maxCoins || 20) * score / 100);
      setResult({ score, correct, total: totalQ, coinsEarned });
      setPhase("result");
    } finally {
      setSubmitting(false);
    }
  }, [id, submitQuizAttempt, questions, totalQ, quiz, navigate, submitting]);

  useEffect(() => {
    handleSubmitRef.current = handleSubmit;
  }, [handleSubmit]);

  useEffect(() => {
    if (phase !== "quiz") return;
    if (!startTimeRef.current) startTimeRef.current = Date.now();
    if (timeLeft <= 0) { 
      if (handleSubmitRef.current) handleSubmitRef.current(answers); 
      return; 
    }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [phase, timeLeft, answers]);

  // ── Already done ────────────────────────────────
  if (alreadyDone) return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-gradient-to-br from-indigo-50 dark:from-slate-900 via-white dark:via-slate-800 to-purple-50 dark:to-slate-900 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-slate-400 to-slate-500 p-8 text-white text-center">
          <div className="mb-3 text-6xl">🔒</div>
          <h1 className="font-black text-2xl">Allaqachon yechilgan</h1>
          <p className="mt-1 text-slate-200 text-sm">Bu testni faqat bir marta yechish mumkin</p>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-700 mb-4 p-4 rounded-2xl">
            <div className="text-3xl">🏆</div>
            <div>
              <p className="font-black text-slate-700 dark:text-white">Sizning natijangiz</p>
              <p className="font-black text-indigo-600 dark:text-indigo-400 text-2xl">{alreadyDone.score ?? "–"}%</p>
            </div>
            <div className="ml-auto text-right">
              <p className="font-medium text-slate-400 dark:text-slate-500 text-xs">Coins</p>
              <p className="font-black text-amber-500">+{alreadyDone.coinsEarned ?? 0} 🪙</p>
            </div>
          </div>
          <button onClick={() => navigate("/student/tests")}
            className="bg-brand-500 hover:bg-brand-600 py-4 border-none rounded-2xl w-full font-black text-white active:scale-95 transition-all cursor-pointer">
            Testlarga qaytish →
          </button>
        </div>
      </div>
    </div>
  );

  if (!quiz) return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-slate-50 dark:bg-slate-900">
      <div className="p-4 text-center">
        <div className="mb-3 text-5xl">😕</div>
        <p className="font-bold text-slate-500 dark:text-slate-400">Test topilmadi</p>
        <button onClick={() => navigate("/student/tests")}
          className="bg-brand-500 mt-4 px-6 py-2 border-none rounded-full font-bold text-white cursor-pointer">
          Orqaga
        </button>
      </div>
    </div>
  );

  /* ── INTRO ── */
  if (phase === "intro") return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-gradient-to-br from-indigo-50 dark:from-slate-900 via-white dark:via-slate-800 to-purple-50 dark:to-slate-900 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden">
          <div className="relative bg-gradient-to-r from-brand-500 to-brand-600 p-8 overflow-hidden text-white text-center">
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)",
              backgroundSize: "30px 30px"
            }} />
            <div className="mb-3 text-6xl">📝</div>
            <h1 className="font-black text-2xl leading-tight">{quiz.title}</h1>
            {quiz.subject && <p className="mt-1 font-medium text-indigo-200 text-sm">{quiz.subject}</p>}
          </div>
          <div className="p-6">
            <div className="gap-3 grid grid-cols-3 mb-5">
              {[
                { icon: "❓", label: "Savollar", value: totalQ },
                { icon: "⏱", label: "Vaqt", value: "12 min" },
                { icon: "🪙", label: "Max coin", value: quiz.maxCoins || 20 },
              ].map(item => (
                <div key={item.label} className="bg-slate-50 dark:bg-slate-700 p-3 rounded-2xl text-center">
                  <div className="mb-1 text-xl">{item.icon}</div>
                  <div className="font-black text-slate-800 dark:text-white text-lg leading-none">{item.value}</div>
                  <div className="mt-0.5 font-semibold text-[10px] text-slate-400 dark:text-slate-500">{item.label}</div>
                </div>
              ))}
            </div>

            <div className="flex items-start gap-3 bg-red-50 dark:bg-red-900/30 mb-5 p-4 border border-red-100 dark:border-red-800 rounded-2xl">
              <span className="mt-0.5 text-xl">⚠️</span>
              <div>
                <p className="font-black text-red-600 dark:text-red-400 text-sm">Faqat 1 marta!</p>
                <p className="mt-0.5 font-medium text-red-400 dark:text-red-500 text-xs">Testni boshlaganingizdan keyin qaytib bo'lmaydi.</p>
              </div>
            </div>

            <button onClick={() => setPhase("quiz")}
              className="bg-brand-500 hover:bg-brand-600 py-4 border-none rounded-2xl w-full font-black text-white text-base active:scale-95 transition-all cursor-pointer">
              🚀 Testni Boshlash
            </button>
            <button onClick={() => navigate("/student/tests")}
              className="bg-transparent mt-3 py-2 border-none rounded-xl w-full font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white text-sm transition-colors cursor-pointer">
              ← Orqaga qaytish
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  /* ── RESULT ── */
  if (phase === "result") {
    const score = result?.score ?? 0;
    const coinsEarned = result?.coinsEarned ?? 0;
    const grade = score >= 90 ? { emoji: "🏆", label: "A'lo!", color: "from-brand-400 to-brand-500" }
                : score >= 70 ? { emoji: "🌟", label: "Yaxshi!", color: "from-brand-400 to-brand-500" }
                : score >= 50 ? { emoji: "👍", label: "O'rtacha", color: "from-brand-400 to-brand-500" }
                : { emoji: "💪", label: "Harakat qiling!", color: "from-brand-400 to-brand-500" };
    return (
      <div className="z-50 fixed inset-0 flex justify-center items-center bg-gradient-to-br from-indigo-50 dark:from-slate-900 via-white dark:via-slate-800 to-purple-50 dark:to-slate-900 p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden">
            <div className={`bg-gradient-to-r ${grade.color} p-8 text-white text-center`}>
              <div className="mb-2 text-7xl animate-bounce">{grade.emoji}</div>
              <div className="font-black text-4xl">{score}%</div>
              <div className="opacity-90 font-bold text-lg">{grade.label}</div>
            </div>
            <div className="p-6">
              <div className="gap-3 grid grid-cols-3 mb-5">
                {[
                  { icon: "✅", label: "To'g'ri", value: result?.correct ?? "-", color: "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400" },
                  { icon: "❌", label: "Noto'g'ri", value: (result?.total ?? totalQ) - (result?.correct ?? 0), color: "bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400" },
                  { icon: "🪙", label: "Coins", value: `+${coinsEarned}`, color: "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" },
                ].map(s => (
                  <div key={s.label} className={`${s.color} rounded-2xl p-3 text-center`}>
                    <div className="mb-1 text-xl">{s.icon}</div>
                    <div className="font-black text-xl leading-none">{s.value}</div>
                    <div className="opacity-70 mt-0.5 font-semibold text-[10px]">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-4 bg-gradient-to-r from-amber-50 dark:from-amber-900/30 to-yellow-50 dark:to-yellow-900/30 mb-5 p-4 border border-amber-200 dark:border-amber-800 rounded-2xl">
                <div className="text-4xl">🪙</div>
                <div>
                  <p className="font-black text-amber-700 dark:text-amber-400 text-lg">+{coinsEarned} coin</p>
                  <p className="font-medium text-amber-500 dark:text-amber-400 text-xs">Hisobingizga qo'shildi!</p>
                </div>
              </div>
              <button onClick={() => navigate("/student/tests")}
                className="bg-brand-500 hover:bg-brand-600 py-4 border-none rounded-2xl w-full font-black text-white text-base active:scale-95 transition-all cursor-pointer">
                Testlarga qaytish →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── QUIZ ── */
  const q = questions[current];
  const OPT_LABELS = ["A","B","C","D"];

  return (
    <div className="z-50 fixed inset-0 flex flex-col bg-gradient-to-br from-slate-50 dark:from-slate-900 dark:via-slate-800 to-indigo-50 dark:to-slate-900 overflow-y-auto">
      {/* TOP BAR - Desktop only */}
      <div className="hidden md:flex items-center gap-4 bg-white dark:bg-slate-800 px-4 py-3 border-slate-100 dark:border-slate-700 border-b">
        <div className="relative flex-shrink-0 w-12 h-12">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="36" fill="none" stroke="#f1f5f9" strokeWidth="6" />
            <circle cx="40" cy="40" r="36" fill="none"
              stroke={timerColor} strokeWidth="6" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={strokeDash}
              style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }}
            />
          </svg>
          <div className="absolute inset-0 flex justify-center items-center">
            <span className="font-black text-[9px] text-slate-700 dark:text-slate-300">{formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between mb-1.5">
            <span className="max-w-[120px] font-bold text-slate-500 dark:text-slate-400 text-xs truncate">{quiz.title}</span>
            <span className="font-black text-slate-700 dark:text-white text-xs">{current + 1}/{totalQ}</span>
          </div>
          <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
            <div className="rounded-full h-full transition-all duration-500"
              style={{ width: `${(current / totalQ) * 100}%`, background: "linear-gradient(to right, #6366f1, #a855f7)" }} />
          </div>
        </div>

        <div className="flex-shrink-0 bg-amber-50 dark:bg-amber-900/30 px-3 py-1.5 rounded-full">
          <span className="font-black text-amber-600 dark:text-amber-400 text-xs">🪙{quiz.maxCoins}</span>
        </div>
      </div>

      {/* QUESTION - Full screen on mobile */}
      <div className="flex flex-col flex-1 mx-auto px-3 py-4 w-full md:max-w-2xl">
        {/* Mobile timer */}
        <div className="md:hidden flex justify-between items-center bg-white dark:bg-slate-800 mb-4 p-3 rounded-2xl">
          <div className="flex items-center gap-2">
            <span className={`font-black text-lg ${timerPct > 25 ? 'text-green-500' : 'text-red-500'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <span className="font-bold text-slate-500 dark:text-slate-400 text-sm">{current + 1}/{totalQ}</span>
          <span className="font-black text-amber-500">🪙{quiz.maxCoins}</span>
        </div>

        <div className="bg-white dark:bg-slate-800 mb-4 p-4 rounded-2xl"
          style={{ opacity: animDir === "out" ? 0 : 1, transform: animDir === "out" ? "translateX(-30px)" : "translateX(0)", transition: "all 0.3s ease" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-1.5 rounded-xl font-black text-white text-xs">
              Savol {current + 1}
            </div>
          </div>
          <p className="font-black dark:text-white text-lg leading-snug">{q.question}</p>
        </div>

        <div className="space-y-2"
          style={{ opacity: animDir === "out" ? 0 : 1, transition: "all 0.3s ease" }}>
          {q.options.map((opt, oi) => {
            const isSelected = selected === oi;
            const isCorrect  = confirmed && oi === Number(q.correct);
            const isWrong    = confirmed && isSelected && oi !== Number(q.correct);
            let bg = "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200";
            if (isCorrect)       bg = "bg-brand-500 border-brand-500 text-white";
            else if (isWrong)    bg = "bg-red-400 border-red-400 text-white";
            else if (isSelected) bg = "bg-brand-500 border-brand-500 text-white";
            return (
              <button key={oi} onClick={() => handleSelect(oi)} disabled={confirmed}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 font-bold text-left transition-all cursor-pointer ${bg}`}
                style={{ transform: isSelected && !confirmed ? "scale(1.02)" : "scale(1)" }}>
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black flex-shrink-0 ${
                  isCorrect || isWrong || isSelected ? "bg-white/20" : "bg-slate-100 dark:bg-slate-600 text-slate-500 dark:text-slate-300"
                }`}>
                  {isCorrect ? "✓" : isWrong ? "✕" : OPT_LABELS[oi]}
                </span>
                <span className="flex-1 text-sm">{opt}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-4">
          {!confirmed ? (
            <button onClick={handleConfirm} disabled={selected === null}
              className="disabled:opacity-30 py-3 border-none rounded-xl w-full font-black text-base transition-all cursor-pointer"
              style={{
                background: selected !== null ? "linear-gradient(to right, #6366f1, #a855f7)" : "#e2e8f0",
                color: selected !== null ? "white" : "#94a3b8",
                boxShadow: selected !== null ? "0 8px 25px rgba(99,102,241,0.35)" : "none"
              }}>
              Tasdiqlash →
            </button>
          ) : (
            <div className={`w-full py-3 rounded-xl font-black text-base text-center ${
              Number(selected) === Number(q.correct) ? "bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400" : "bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400"
            }`}>
              {Number(selected) === Number(q.correct) ? "✅ To'g'ri!" : "❌ Noto'g'ri!"}
              {current + 1 < totalQ && <span className="opacity-60 ml-2 text-xs">Keyingi savol...</span>}
            </div>
          )}
        </div>

        {/* Dot progress */}
        <div className="flex flex-wrap justify-center gap-1.5 mt-3">
          {questions.map((_, i) => (
            <div key={i} className="rounded-full w-1.5 h-1.5 transition-all"
              style={{
                background: i < current ? "#22c55e" : i === current ? "#6366f1" : "#e2e8f0",
                transform: i === current ? "scale(1.4)" : "scale(1)"
              }} />
          ))}
        </div>
      </div>
    </div>
  );
}

