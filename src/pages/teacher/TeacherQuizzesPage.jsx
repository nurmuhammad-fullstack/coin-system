// src/pages/teacher/TeacherQuizzesPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const BLANK_Q    = { question: "", options: ["","","",""], correct: 0 };
const BLANK_FORM = { title:"", subject:"", class:"", maxCoins:20, timeLimit:10, questions:[JSON.parse(JSON.stringify(BLANK_Q))] };
const SUBJECTS   = ["Math","English","Science","History","Geography","Literature","Other"];
const OPT_LABELS = ["A","B","C","D"];

export default function TeacherQuizzesPage() {
  const { showToast } = useApp();
  const navigate      = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView]       = useState("list");
  const [form, setForm]       = useState(JSON.parse(JSON.stringify(BLANK_FORM)));
  const [saving, setSaving]   = useState(false);

  const token = localStorage.getItem("coined_token");
  const API   = process.env.REACT_APP_API_URL || "http://localhost:5001/api";

  useEffect(() => { loadQuizzes(); }, [loadQuizzes]);

  const loadQuizzes = async () => {
    try {
      const r = await fetch(`${API}/quizzes`, { headers: { Authorization:`Bearer ${token}` } });
      const d = await r.json();
      setQuizzes(Array.isArray(d) ? d : []);
    } catch(e){ console.error(e); } finally { setLoading(false); }
  };

  const addQ    = () => { if(form.questions.length>=20) return; setForm(f=>({...f, questions:[...f.questions, JSON.parse(JSON.stringify(BLANK_Q))]})); };
  const removeQ = (i) => { if(form.questions.length===1) return; setForm(f=>({...f, questions:f.questions.filter((_,idx)=>idx!==i)})); };
  const updateQ = (i,field,val) => setForm(f=>{ const qs=[...f.questions]; qs[i]={...qs[i],[field]:val}; return {...f,questions:qs}; });
  const updateOpt = (qi,oi,val) => setForm(f=>{ const qs=[...f.questions]; const opts=[...qs[qi].options]; opts[oi]=val; qs[qi]={...qs[qi],options:opts}; return {...f,questions:qs}; });

  const handleSave = async () => {
    if(!form.title.trim()){ showToast("❌ Test nomini kiriting","error"); return; }
    for(let i=0;i<form.questions.length;i++){
      if(!form.questions[i].question.trim()){ showToast(`❌ ${i+1}-savol bo'sh`,"error"); return; }
      if(form.questions[i].options.some(o=>!o.trim())){ showToast(`❌ ${i+1}-savol variantlari to'liq emas`,"error"); return; }
    }
    setSaving(true);
    try {
      const r = await fetch(`${API}/quizzes`,{ method:"POST", headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`}, body:JSON.stringify(form) });
      if(!r.ok) throw new Error((await r.json()).message);
      showToast("✅ Test yaratildi!");
      setView("list"); setForm(JSON.parse(JSON.stringify(BLANK_FORM))); loadQuizzes();
    } catch(err){ showToast("❌ "+err.message,"error"); } finally { setSaving(false); }
  };

  const handleDelete = async (id, title) => {
    if(!window.confirm(`"${title}" testini o'chirmoqchimisiz?`)) return;
    await fetch(`${API}/quizzes/${id}`,{ method:"DELETE", headers:{Authorization:`Bearer ${token}`} });
    showToast("Deleted"); setQuizzes(p=>p.filter(q=>q._id!==id));
  };

  const handleToggle = async (id) => {
    const r = await fetch(`${API}/quizzes/${id}/toggle`,{ method:"PATCH", headers:{Authorization:`Bearer ${token}`} });
    const d = await r.json();
    setQuizzes(p=>p.map(q=>q._id===id?d:q));
  };

  /* ── LIST VIEW ── */
  if(view==="list") return (
    <div className="p-5 md:p-0">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="mb-1 font-extrabold text-[11px] text-indigo-400 uppercase tracking-widest">Teacher</p>
          <h1 className="font-black text-slate-900 text-3xl md:text-4xl tracking-tight">Quizzes</h1>
        </div>
        <button onClick={()=>setView("create")}
          className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 shadow-indigo-200 shadow-lg px-5 py-2.5 border-none rounded-full font-bold text-[13px] text-white transition-colors cursor-pointer">
          + New Quiz
        </button>
      </div>

      {/* Stats */}
      <div className="gap-3 grid grid-cols-3 mb-6">
        <Stat label="Total"     value={quizzes.length}                                      color="bg-indigo-500 text-white" />
        <Stat label="Active"    value={quizzes.filter(q=>q.active).length}                  color="bg-emerald-500 text-white" />
        <Stat label="Questions" value={quizzes.reduce((a,q)=>a+(q.questions?.length||0),0)} color="bg-violet-500 text-white" />
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="text-4xl animate-bounce">📝</div></div>
      ) : quizzes.length===0 ? (
        <EmptyState onNew={()=>setView("create")} />
      ) : (
        <div className="gap-3 grid grid-cols-1 md:grid-cols-2">
          {quizzes.map((quiz,i)=>(
            <div key={quiz._id} className="group bg-white hover:shadow-lg p-5 border border-slate-100 hover:border-indigo-200 rounded-2xl transition-all">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex flex-shrink-0 justify-center items-center bg-indigo-50 group-hover:bg-indigo-500 rounded-xl w-10 h-10 font-black text-[13px] text-indigo-400 group-hover:text-white transition-colors">
                  {String(i+1).padStart(2,"0")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-black text-[15px] text-slate-900 truncate leading-tight">{quiz.title}</span>
                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${quiz.active?"bg-emerald-100 text-emerald-700":"bg-slate-100 text-slate-400"}`}>
                      {quiz.active?"Live":"Paused"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 font-medium text-[11px] text-slate-400">
                    {quiz.subject && <span>{quiz.subject}</span>}
                    {quiz.class   && <span>Class {quiz.class}</span>}
                    <span>{quiz.questions?.length} savol</span>
                    <span className="font-bold text-violet-500">🪙 {quiz.maxCoins} max</span>
                  </div>
                </div>
              </div>
              <div className="gap-2 grid grid-cols-3">
                <button onClick={()=>navigate(`/teacher/quizzes/${quiz._id}`)}
                  className="col-span-1 bg-indigo-50 hover:bg-indigo-100 py-2 border-none rounded-xl font-bold text-[11px] text-indigo-600 transition-colors cursor-pointer">
                  📊 Results
                </button>
                <button onClick={()=>handleToggle(quiz._id)}
                  className={`col-span-1 py-2 text-[11px] font-bold rounded-xl border-none cursor-pointer transition-colors ${quiz.active?"bg-amber-50 text-amber-600 hover:bg-amber-100":"bg-emerald-50 text-emerald-600 hover:bg-emerald-100"}`}>
                  {quiz.active?"⏸ Pause":"▶ Start"}
                </button>
                <button onClick={()=>handleDelete(quiz._id,quiz.title)}
                  className="col-span-1 bg-red-50 hover:bg-red-100 py-2 border-none rounded-xl font-bold text-[11px] text-red-400 transition-colors cursor-pointer">
                  ✕ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  /* ── CREATE VIEW ── */
  return (
    <div className="p-5 md:p-0 pb-12">
      <div className="flex items-center gap-3 mb-7">
        <button onClick={()=>setView("list")}
          className="flex justify-center items-center bg-white hover:bg-indigo-50 border border-slate-200 border-none rounded-xl w-9 h-9 text-slate-500 text-base transition-colors cursor-pointer">
          ←
        </button>
        <div>
          <h2 className="font-black text-slate-900 text-2xl tracking-tight">Yangi Test</h2>
          <p className="text-[11px] text-slate-400">{form.questions.length} ta savol</p>
        </div>
      </div>

      <div className="flex md:flex-row flex-col gap-6">
        {/* LEFT PANEL */}
        <div className="flex-shrink-0 space-y-4 w-full md:w-72">
          <Section label="Test haqida">
            <input type="text" placeholder="Test nomi *" value={form.title}
              onChange={e=>setForm(f=>({...f,title:e.target.value}))}
              className="bg-slate-50 px-4 py-3 border border-slate-200 focus:border-indigo-400 rounded-xl outline-none w-full font-bold text-sm transition-all" />
            <div className="gap-2 grid grid-cols-2 mt-2">
              <select value={form.subject} onChange={e=>setForm(f=>({...f,subject:e.target.value}))}
                className="bg-slate-50 px-3 py-3 border border-slate-200 rounded-xl outline-none font-medium text-sm appearance-none cursor-pointer">
                <option value="">Fan</option>
                {SUBJECTS.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
              <input type="text" placeholder="Sinf" value={form.class}
                onChange={e=>setForm(f=>({...f,class:e.target.value}))}
                className="bg-slate-50 px-3 py-3 border border-slate-200 focus:border-indigo-400 rounded-xl outline-none font-medium text-sm transition-all" />
            </div>
          </Section>

          <div className="gap-3 grid grid-cols-2">
            <div className="bg-violet-50 p-4 border border-violet-100 rounded-2xl">
              <p className="mb-1 font-extrabold text-[10px] text-violet-400 uppercase tracking-wider">Max 🪙</p>
              <input type="number" value={form.maxCoins} min="1" max="200"
                onChange={e=>setForm(f=>({...f,maxCoins:parseInt(e.target.value)||20}))}
                className="bg-transparent border-none outline-none w-full font-black text-violet-700 text-2xl" />
            </div>
            <div className="bg-sky-50 p-4 border border-sky-100 rounded-2xl">
              <p className="mb-1 font-extrabold text-[10px] text-sky-400 uppercase tracking-wider">⏱ min</p>
              <input type="number" value={form.timeLimit} min="1" max="60"
                onChange={e=>setForm(f=>({...f,timeLimit:parseInt(e.target.value)||10}))}
                className="bg-transparent border-none outline-none w-full font-black text-sky-700 text-2xl" />
            </div>
          </div>

          <Section label="Coin jadvali">
            <div className="space-y-2">
              {[100,80,60,40,0].map(pct=>(
                <div key={pct} className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-indigo-500 rounded-full h-full transition-all" style={{width:`${pct}%`}} />
                  </div>
                  <span className="w-8 font-bold text-[11px] text-slate-400 text-right">{pct}%</span>
                  <span className="w-10 font-black text-[11px] text-violet-600 text-right">🪙{Math.round(form.maxCoins*pct/100)}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Save — desktop */}
          <button onClick={handleSave} disabled={saving}
            className="hidden md:block bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 shadow-indigo-200 shadow-lg py-4 border-none rounded-2xl w-full font-black text-white text-sm transition-colors cursor-pointer">
            {saving ? "Saqlanmoqda..." : `✅ Saqlash (${form.questions.length} savol)`}
          </button>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 space-y-4">
          {form.questions.map((q,qi)=>(
            <div key={qi} className="bg-white p-5 border border-slate-100 hover:border-indigo-200 rounded-2xl transition-colors">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex justify-center items-center bg-indigo-500 rounded-lg w-7 h-7 font-black text-[11px] text-white">
                    {qi+1}
                  </span>
                  <span className="font-bold text-slate-400 text-xs uppercase tracking-wider">Savol</span>
                </div>
                {form.questions.length>1 && (
                  <button onClick={()=>removeQ(qi)}
                    className="bg-transparent border-none font-bold text-[11px] text-red-400 hover:text-red-600 transition-colors cursor-pointer">
                    ✕ O'chirish
                  </button>
                )}
              </div>

              <textarea placeholder="Savol matni *" value={q.question}
                onChange={e=>updateQ(qi,"question",e.target.value)} rows={2}
                className="bg-slate-50 focus:bg-white mb-3 px-4 py-3 border border-slate-200 focus:border-indigo-400 rounded-xl outline-none w-full font-medium text-sm transition-all resize-none" />

              <p className="mb-2 font-extrabold text-[10px] text-slate-400 uppercase tracking-widest">
                Variantlar — to'g'risini tanlang
              </p>
              <div className="space-y-2">
                {q.options.map((opt,oi)=>(
                  <div key={oi} onClick={()=>updateQ(qi,"correct",oi)}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 border cursor-pointer transition-all ${q.correct===oi?"border-emerald-400 bg-emerald-50":"border-slate-100 bg-slate-50 hover:border-indigo-200"}`}>
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black flex-shrink-0 transition-colors ${q.correct===oi?"bg-emerald-500 text-white":"bg-white border border-slate-200 text-slate-400"}`}>
                      {OPT_LABELS[oi]}
                    </span>
                    <input type="text" placeholder={`${OPT_LABELS[oi]} variant *`} value={opt}
                      onClick={e=>e.stopPropagation()}
                      onChange={e=>updateOpt(qi,oi,e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none font-medium text-slate-700 text-sm placeholder-slate-300" />
                    {q.correct===oi && <span className="flex-shrink-0 font-extrabold text-[11px] text-emerald-500">✓</span>}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button onClick={addQ} disabled={form.questions.length>=20}
            className="bg-transparent disabled:opacity-30 py-4 border-2 border-indigo-200 hover:border-indigo-400 border-dashed rounded-2xl w-full font-bold text-indigo-400 hover:text-indigo-600 text-sm transition-all cursor-pointer">
            + Savol qo'shish
            <span className="opacity-60 ml-1 text-[11px]">({form.questions.length}/20)</span>
          </button>

          {/* Save — mobile */}
          <div className="md:hidden flex gap-3 pt-2">
            <button onClick={()=>setView("list")}
              className="flex-1 bg-white py-4 border border-slate-200 rounded-2xl font-bold text-slate-500 text-sm cursor-pointer">
              Bekor
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex-[2] bg-indigo-500 disabled:opacity-50 py-4 border-none rounded-2xl font-black text-white text-sm cursor-pointer">
              {saving ? "..." : "✅ Saqlash"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const Stat = ({label,value,color}) => (
  <div className={`${color} rounded-2xl p-4 text-center`}>
    <p className="font-black text-2xl">{value}</p>
    <p className="opacity-70 mt-0.5 font-bold text-[10px] uppercase tracking-wider">{label}</p>
  </div>
);

const Section = ({label, children}) => (
  <div className="bg-white p-4 border border-slate-100 rounded-2xl">
    <p className="mb-3 font-extrabold text-[10px] text-slate-400 uppercase tracking-widest">{label}</p>
    {children}
  </div>
);

const EmptyState = ({onNew}) => (
  <div className="flex flex-col justify-center items-center py-20 text-center">
    <div className="flex justify-center items-center bg-indigo-50 mb-5 rounded-3xl w-20 h-20 text-4xl">📝</div>
    <p className="mb-1 font-black text-slate-800 text-xl">Hali test yo'q</p>
    <p className="mb-6 text-slate-400 text-sm">Birinchi testingizni yarating</p>
    <button onClick={onNew}
      className="bg-indigo-500 hover:bg-indigo-600 shadow-indigo-200 shadow-lg px-7 py-3 border-none rounded-full font-bold text-white text-sm transition-colors cursor-pointer">
      + Test yaratish
    </button>
  </div>
);