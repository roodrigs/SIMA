"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  GraduationCap, ChevronRight, School, User, UserCircle, 
  ArrowLeft, ArrowRight, CheckCircle2, Send, Loader2, AlertCircle,
  BarChart3, LayoutDashboard, XCircle, Info, RefreshCcw, Users, ClipboardCheck
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend 
} from 'recharts';

type Question = {
  id: string;
  category: string;
  text: string;
  options: string[];
  correctAnswer: number;
  description: string;
};

type AppView = 'FORM' | 'LOADING' | 'QUIZ' | 'REVIEW' | 'DASHBOARD' | 'ERROR';

export default function SIMAApp() {
  const [view, setView] = useState<AppView>('FORM');
  const [formData, setFormData] = useState({ school: "", class: "", operator: "", student: "" });
  const [questions, setQuestions] = useState<Record<string, Question[]>>({});
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [dashboardData, setDashboardData] = useState({ 
    schools: [], 
    categories: [], 
    classes: [], 
    diagnostics: [],
    students: [] 
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const getDiagnostic = (score: number) => {
    if (score >= 80) return "Excelente domínio dos conteúdos.";
    if (score >= 60) return "Bom desempenho, conceitos principais compreendidos.";
    if (score >= 40) return "Atenção necessária, requer reforço em conceitos básicos.";
    return "Nível crítico, necessário plano de recuperação imediato.";
  };

  const filteredStudents = useMemo(() => {
    return dashboardData.students.filter((s: any) => 
      s.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.school.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [dashboardData.students, searchTerm]);

  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/dashboard");
      const data = await res.json();
      setDashboardData(data);
    } catch (e) {
      console.error("Erro dashboard:", e);
    }
  };

  const handleStart = async () => {
    if (!formData.school || !formData.class || !formData.operator || !formData.student) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    setView('LOADING');
    try {
      const res = await fetch("/api/questions");
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setQuestions(data);
      setAnswers({});
      const categories = Object.keys(data);
      setActiveTab(categories[0]);
      setView('QUIZ');
    } catch (err: any) {
      setError(err.message || "Falha ao carregar perguntas.");
      setView('ERROR');
    }
  };

  const handleAnswer = (qId: string, optIdx: number) => {
    setAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const allQuestionsList = Object.values(questions).flat();
      const payloadAnswers = allQuestionsList.map(q => ({
        questionId: q.id,
        selectedIdx: answers[q.id] ?? -1,
        isCorrect: answers[q.id] === q.correctAnswer
      }));

      const response = await fetch("/api/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolName: formData.school,
          schoolClass: formData.class,
          operatorName: formData.operator,
          intervieweeName: formData.student,
          answers: payloadAnswers
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao salvar no servidor");
      }

      setView('REVIEW');
      fetchDashboard();
    } catch (err: any) {
      alert("Erro ao salvar: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = Object.keys(questions);
  const totalQuestions = Object.values(questions).flat().length;
  const answeredCount = Object.keys(answers).length;
  const progress = totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  const reviewStats = useMemo(() => {
    const list = Object.values(questions).flat();
    const correct = list.filter(q => answers[q.id] === q.correctAnswer).length;
    const score = list.length > 0 ? Math.round((correct / list.length) * 100) : 0;
    
    let diagnostic = "";
    if (score >= 80) diagnostic = "Excelente! Você demonstra um domínio sólido dos conteúdos avaliados.";
    else if (score >= 60) diagnostic = "Bom trabalho. Você conhece os conceitos principais, mas pode melhorar em alguns pontos.";
    else if (score >= 40) diagnostic = "Atenção necessária. Recomendamos revisar os fundamentos das matérias com dificuldades.";
    else diagnostic = "Nível crítico. É fundamental um plano de reforço imediato para recuperar as bases do aprendizado.";

    return { total: list.length, correct, wrong: list.length - correct, percent: score, diagnostic };
  }, [questions, answers, view]);

  if (view === 'LOADING') return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
      <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest">Sorteando questões...</p>
    </div>
  );

  if (view === 'REVIEW') return (
    <main className="min-h-screen bg-gray-50 flex flex-col pb-20">
      <div className="max-w-4xl mx-auto w-full p-6 md:p-12 space-y-12">
        <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={40} />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-gray-900">Resultado: {reviewStats.percent}%</h1>
            <p className="text-gray-500 font-medium">{formData.student} (Turma {formData.class}) acertou {reviewStats.correct} de {reviewStats.total} questões.</p>
          </div>
          
          <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 text-left">
            <h4 className="text-blue-800 font-black text-sm uppercase mb-2 flex items-center gap-2">
              <ClipboardCheck size={16} /> Diagnóstico Individual
            </h4>
            <p className="text-blue-900 font-medium leading-relaxed italic">
              "{reviewStats.diagnostic}"
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <button onClick={() => setView('DASHBOARD')} className="bg-black text-white px-8 h-14 rounded-2xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all">
              <LayoutDashboard size={18} /> Ver Dashboard
            </button>
            <button onClick={() => window.location.reload()} className="bg-gray-100 text-gray-600 px-8 h-14 rounded-2xl font-bold hover:bg-gray-200 transition-all">
              Nova Avaliação
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-black text-gray-800 pt-8">Revisão Detalhada</h2>
        
        {Object.values(questions).flat().map((q, idx) => {
          const isCorrect = answers[q.id] === q.correctAnswer;
          return (
            <div key={q.id} className={`bg-white p-8 rounded-[32px] border-2 space-y-6 ${isCorrect ? 'border-green-100' : 'border-red-100'}`}>
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {idx + 1}
                  </span>
                  <p className="text-lg font-bold text-gray-800">{q.text}</p>
                </div>
                {isCorrect ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-red-500" />}
              </div>

              {!isCorrect && (
                <div className="bg-gray-50 p-6 rounded-2xl space-y-4">
                  <div className="flex gap-4 items-center">
                    <div className="text-xs font-black uppercase text-gray-400">Resposta do Aluno:</div>
                    <div className="text-sm font-bold text-red-600">{q.options[answers[q.id]] || "Não respondida"}</div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="text-xs font-black uppercase text-gray-400">Resposta Correta:</div>
                    <div className="text-sm font-bold text-green-600">{q.options[q.correctAnswer]}</div>
                  </div>
                  <div className="pt-4 border-t border-gray-200 flex gap-3">
                    <Info size={16} className="text-blue-500 shrink-0 mt-1" />
                    <p className="text-sm text-gray-600 leading-relaxed">
                      <strong>Por que esta é a correta?</strong><br/>
                      {q.description}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white border-b border-gray-100 px-8 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white"><GraduationCap size={18}/></div>
             <span className="font-black text-xl tracking-tighter">SIMA</span>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-xl">
             <button onClick={() => setView('FORM')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${view !== 'DASHBOARD' ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}>Avaliação</button>
             <button onClick={() => setView('DASHBOARD')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${view === 'DASHBOARD' ? 'bg-white shadow-sm text-black' : 'text-gray-400'}`}>Dashboard</button>
          </div>
        </div>
      </nav>

      <div className="flex-1 max-w-6xl mx-auto w-full p-6 md:p-12">
        {view === 'DASHBOARD' ? (
          <DashboardView 
            dashboardData={dashboardData}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filteredStudents={filteredStudents}
            getDiagnostic={getDiagnostic}
            setView={setView}
          />
        ) : view === 'QUIZ' ? (
          <div className="animate-in fade-in duration-500">
             <div className="flex justify-between items-center mb-12">
                <div>
                  <h1 className="text-4xl font-black text-gray-900">{activeTab}</h1>
                  <p className="text-gray-400 font-medium">Aluno: {formData.student} (Turma: {formData.class}) • {progress}% Concluído</p>
                </div>
                <div className="flex gap-2">
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setActiveTab(cat)} className={`w-3 h-3 rounded-full transition-all ${activeTab === cat ? 'bg-blue-600 w-8' : 'bg-gray-200'}`} />
                  ))}
                </div>
             </div>

             <div className="space-y-8 pb-32">
                {questions[activeTab]?.map((q, idx) => (
                  <div key={q.id} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                    <p className="text-xl font-bold text-gray-800">{idx + 1}. {q.text}</p>
                    <div className="grid gap-3">
                      {q.options.map((opt, oi) => (
                        <button 
                          key={oi} 
                          onClick={() => handleAnswer(q.id, oi)}
                          className={`p-5 rounded-2xl border-2 text-left font-semibold transition-all ${answers[q.id] === oi ? 'border-blue-600 bg-blue-50/50 text-blue-700' : 'border-gray-50 bg-gray-50/50 hover:border-gray-200 text-gray-600'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
             </div>

             <footer className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-black/90 backdrop-blur-xl rounded-[32px] p-4 flex gap-4 shadow-2xl">
                <button disabled={categories.indexOf(activeTab) === 0} onClick={() => setActiveTab(categories[categories.indexOf(activeTab) - 1])} className="flex-1 h-14 rounded-2xl font-bold text-white/50 hover:text-white disabled:opacity-0">Anterior</button>
                <button disabled={categories.indexOf(activeTab) === categories.length - 1} onClick={() => setActiveTab(categories[categories.indexOf(activeTab) + 1])} className="flex-1 h-14 bg-white/10 rounded-2xl font-bold text-white">Próximo</button>
                <button onClick={handleSubmit} disabled={answeredCount === 0} className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg disabled:opacity-20"><Send size={20} /></button>
             </footer>
          </div>
        ) : (
          <div className="max-w-md mx-auto space-y-12 py-10 animate-in slide-in-from-bottom-8 duration-1000">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-white rounded-[28px] flex items-center justify-center border border-gray-100 shadow-xl mx-auto mb-6">
                <GraduationCap size={40} className="text-blue-600" />
              </div>
              <h1 className="text-5xl font-black tracking-tighter text-gray-900">SIMA</h1>
              <p className="text-gray-400 text-lg font-medium italic">Sistema de Mapeamento</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input className="w-full h-16 bg-white border border-gray-100 rounded-2xl px-6 font-bold shadow-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" placeholder="Escola" value={formData.school} onChange={e => setFormData({...formData, school: e.target.value})} />
                <input className="w-full h-16 bg-white border border-gray-100 rounded-2xl px-6 font-bold shadow-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" placeholder="Turma (ex: 3º A)" value={formData.class} onChange={e => setFormData({...formData, class: e.target.value})} />
              </div>
              <input className="w-full h-16 bg-white border border-gray-100 rounded-2xl px-6 font-bold shadow-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" placeholder="Nome do Operador" value={formData.operator} onChange={e => setFormData({...formData, operator: e.target.value})} />
              <input className="w-full h-16 bg-white border border-gray-100 rounded-2xl px-6 font-bold shadow-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all" placeholder="Nome do Aluno" value={formData.student} onChange={e => setFormData({...formData, student: e.target.value})} />
            </div>

            <button onClick={handleStart} className="w-full h-20 bg-blue-600 text-white rounded-[28px] text-xl font-black shadow-xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
              Iniciar Avaliação <ChevronRight />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

const DashboardView = ({ 
  dashboardData, 
  searchTerm, 
  setSearchTerm, 
  filteredStudents, 
  getDiagnostic, 
  setView 
}: {
  dashboardData: any;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  filteredStudents: any[];
  getDiagnostic: (score: number) => string;
  setView: (view: AppView) => void;
}) => (
  <div className="space-y-12 animate-in fade-in duration-700 pb-20">
    <div className="flex justify-between items-end">
      <div>
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Rendimento Geral</h1>
        <p className="text-gray-400 font-medium">Análise de desempenho por escola, turma e matéria</p>
      </div>
      <button onClick={() => setView('FORM')} className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700">
        <RefreshCcw size={16} /> Nova Avaliação
      </button>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Rendimento por Matéria */}
      <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <BarChart3 size={20} className="text-purple-500" /> Rendimento por Matéria (%)
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={dashboardData.categories} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                {dashboardData.categories.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={['#3b82f6', '#a855f7', '#ec4899'][index % 3]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{borderRadius: '16px'}} />
              <Legend verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Desempenho por Turma */}
      <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Users size={20} className="text-blue-500" /> Desempenho por Turma (%)
        </h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dashboardData.classes}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis dataKey="class" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 'bold'}} />
              <YAxis hide domain={[0, 100]} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none'}} />
              <Bar dataKey="score" radius={[10, 10, 10, 10]} barSize={40}>
                {dashboardData.classes.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.score > 70 ? '#22c55e' : entry.score > 50 ? '#3b82f6' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>

    {/* Diagnóstico das Turmas */}
    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-8">
      <h3 className="text-2xl font-black text-gray-800 flex items-center gap-3">
        <ClipboardCheck size={28} className="text-green-600" /> Diagnóstico Pedagógico das Turmas
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardData.diagnostics.map((diag: any, i: number) => (
          <div key={i} className="p-6 rounded-3xl bg-gray-50 border border-gray-100 space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-black text-xl text-gray-900">{diag.class}</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${diag.score >= 60 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {diag.score}%
              </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed font-medium">
              {diag.diagnostic}
            </p>
          </div>
        ))}
        {dashboardData.diagnostics.length === 0 && (
           <p className="text-gray-400 italic">Nenhum dado de turma disponível para diagnóstico.</p>
        )}
      </div>
    </div>

    {/* Relatório Detalhado de Alunos */}
    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <h3 className="text-2xl font-black text-gray-800 flex items-center gap-3">
          <User size={28} className="text-blue-600" /> Relatório Detalhado de Alunos
        </h3>
        
        <div className="relative max-w-sm w-full">
          <input 
            type="text" 
            placeholder="Pesquisar aluno, turma ou escola..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 pl-10 font-medium text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
          />
          <Info size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-400 text-xs font-black uppercase tracking-widest border-b border-gray-50">
              <th className="px-6 py-4">Aluno</th>
              <th className="px-6 py-4">Turma / Escola</th>
              <th className="px-6 py-4">Diagnóstico Individual</th>
              <th className="px-6 py-4">Nota</th>
              <th className="px-6 py-4">Data</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredStudents.map((s: any) => (
              <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-800">{s.student}</p>
                  <p className="text-xs text-gray-400 font-medium">Op: {s.operator}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-600 text-sm">{s.class}</p>
                  <p className="text-xs text-gray-400 font-medium">{s.school}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-gray-500 font-medium leading-tight max-w-xs">
                    {getDiagnostic(s.score)}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full ${s.score >= 60 ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${s.score}%` }} />
                    </div>
                    <span className={`text-sm font-black ${s.score >= 60 ? 'text-green-600' : 'text-red-600'}`}>{s.score}%</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-400 font-bold">
                  {new Date(s.date).toLocaleDateString('pt-BR')}
                </td>
              </tr>
            ))}
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                  {searchTerm ? "Nenhum aluno encontrado para esta busca." : "Nenhum aluno avaliado ainda."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);
