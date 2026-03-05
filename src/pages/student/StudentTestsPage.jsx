// src/pages/student/StudentTestsPage.jsx
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Card, SectionLabel } from "../../components/ui";

export default function StudentTestsPage() {
  const { quizzes = [], quizzesLoaded } = useApp();
  const navigate = useNavigate();

  const availableQuizzes = quizzes.filter(q => q.active !== false && q.isActive !== false);

  // ✅ attempt to'g'ridan-to'g'ri quiz objectidan olamiz (backend beradi)
  const isDone = (quiz) => !!(quiz.attempt && quiz.attempt._id);

  const completedCount = availableQuizzes.filter(q => isDone(q)).length;
  const availableCount = availableQuizzes.filter(q => !isDone(q)).length;
  const coinsEarned    = availableQuizzes
    .filter(q => isDone(q))
    .reduce((sum, q) => sum + (q.attempt?.coinsEarned || 0), 0);

  return (
    <div className="space-y-5 mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-0 max-w-7xl">
      {/* Header */}
      <div>
        <p className="font-semibold text-slate-500 dark:text-slate-400 text-xs">Earn coins by completing</p>
        <h2 className="font-poppins font-black text-slate-800 dark:text-white text-2xl md:text-3xl">Tests 📝</h2>
      </div>

      {/* Stats */}
      <div className="gap-3 grid grid-cols-3">
        {[
          { label: "Available",    value: availableCount, icon: "📋", bg: "bg-brand-50 dark:bg-brand-900/30",   color: "text-brand-600 dark:text-brand-400"  },
          { label: "Completed",    value: completedCount, icon: "✅", bg: "bg-brand-50 dark:bg-brand-900/30",  color: "text-brand-600 dark:text-brand-400" },
          { label: "Coins Earned", value: coinsEarned,    icon: "🪙", bg: "bg-brand-50 dark:bg-brand-900/30",  color: "text-brand-600 dark:text-brand-400" },
        ].map(s => (
          <Card key={s.label} className={`${s.bg} p-4 border-none`}>
            <p className="mb-1 text-2xl">{s.icon}</p>
            <p className={`font-poppins font-black text-2xl ${s.color}`}>{s.value}</p>
            <p className="font-semibold text-slate-500 dark:text-slate-400 text-xs">{s.label}</p>
          </Card>
        ))}
      </div>

      {/* Tests list */}
      <Card className="p-5">
        <SectionLabel className="mb-4">All Tests</SectionLabel>

        {/* Loading */}
        {!quizzesLoaded && (
          <div className="py-10 text-center">
            <p className="mb-2 text-3xl animate-bounce">🪙</p>
            <p className="font-bold text-slate-400 dark:text-slate-500 text-sm">Yuklanmoqda...</p>
          </div>
        )}

        {/* Empty */}
        {quizzesLoaded && availableQuizzes.length === 0 && (
          <div className="py-10 text-slate-400 dark:text-slate-500 text-center">
            <p className="mb-2 text-4xl">📭</p>
            <p className="font-bold dark:text-slate-400 text-sm">No tests available yet</p>
            <p className="mt-1 dark:text-slate-500 text-xs">Your teacher hasn't added any tests</p>
          </div>
        )}

        {/* List */}
        {quizzesLoaded && availableQuizzes.length > 0 && (
          <div className="space-y-3">
            {availableQuizzes.map(quiz => {
              const id   = quiz._id || quiz.id;
              const done = isDone(quiz);

              return (
                <div key={id} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                  done ? "border-brand-100 dark:border-brand-900/50 bg-brand-50/40 dark:bg-brand-900/20" : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600"
                }`}>
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
                    done ? "bg-brand-100 dark:bg-brand-900/50" : "bg-brand-50 dark:bg-brand-900/30"
                  }`}>
                    {done ? "✅" : "📝"}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-slate-800 dark:text-white text-sm truncate">{quiz.title}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-1 font-semibold text-slate-400 dark:text-slate-500 text-xs">
                      {quiz.subject && <span>📚 {quiz.subject}</span>}
                      {quiz.questions?.length > 0 && <span>❓ {quiz.questions.length} questions</span>}
                      {quiz.maxCoins > 0 && <span className="text-amber-500">🪙 +{quiz.maxCoins} coins</span>}
                    </div>
                    {/* Score badge */}
                    {done && (
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="inline-flex items-center gap-1 bg-brand-100 dark:bg-brand-900/50 px-2.5 py-0.5 rounded-full font-black text-brand-700 dark:text-brand-400 text-xs">
                          🏆 {quiz.attempt.score ?? 0}% ball
                        </div>
                        <div className="inline-flex items-center gap-1 bg-brand-50 dark:bg-brand-900/30 px-2.5 py-0.5 rounded-full font-black text-brand-600 dark:text-brand-400 text-xs">
                          🪙 +{quiz.attempt.coinsEarned ?? 0}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  {done ? (
                    <div className="flex-shrink-0 text-center">
                      <div className="bg-brand-500 px-4 py-2 rounded-xl font-black text-white text-xs">
                        Completed ✓
                      </div>
                      <p className="mt-1 font-medium text-[10px] text-slate-400 dark:text-slate-500">1 attempt only</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => navigate(`/student/quiz/${id}`)}
                      className="flex-shrink-0 bg-brand-500 hover:bg-brand-600 px-4 py-2.5 border-none rounded-xl font-extrabold text-white text-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      Start Test →
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
