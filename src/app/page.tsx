"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { 
  GraduationCap, ChevronRight, School, User, UserCircle, 
  ArrowLeft, ArrowRight, CheckCircle2, Send, Loader2, AlertCircle,
  BarChart3, LayoutDashboard, XCircle, Info, RefreshCcw, Users, ClipboardCheck,
  Lock
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

type AppView = 'FORM' | 'LOADING' | 'QUIZ' | 'REVIEW' | 'ERROR';

export default function SIMAApp() {
  const [view, setView] = useState<AppView>('FORM');
  const [formData, setFormData] = useState({ 
    school: "", 
    class: "", 
    operator: "", 
    student: "", 
    grade: "12",
    zone: "NORTE",
    schoolNetwork: "PUBLICA"
  });
  const [questions, setQuestions] = useState<Record<string, Question[]>>({});
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finishedAnswers, setFinishedAnswers] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Ajuste 3: Subir para o topo ao trocar de categoria
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const handleStart = async () => {
    if (!formData.school || !formData.class || !formData.operator || !formData.student || !formData.grade) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    setView('LOADING');
    try {
      const res = await fetch(`/api/questions?grade=${formData.grade}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setQuestions(data);
      setAnswers({});
      setFinishedAnswers({});
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
          grade: formData.grade,
          zone: formData.zone,
          schoolNetwork: formData.schoolNetwork,
          answers: payloadAnswers
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao salvar no servidor");
      }

      // Preserva as respostas para a tela de revisão ANTES de limpar o estado principal
      setFinishedAnswers({...answers});
      setView('REVIEW');
      
      // Ajuste 1: Limpar os campos após finalizar
      setFormData({ 
        school: "", 
        class: "", 
        operator: "", 
        student: "",
        grade: "12",
        zone: "NORTE",
        schoolNetwork: "PUBLICA"
      });
      setAnswers({});
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
    const currentAnswers = view === 'REVIEW' ? finishedAnswers : answers;
    const correct = list.filter(q => currentAnswers[q.id] === q.correctAnswer).length;
    const score = list.length > 0 ? Math.round((correct / list.length) * 100) : 0;
    
    let diagnostic = "";
    if (score >= 80) diagnostic = "Excelente! Você demonstra um domínio sólido dos conteúdos avaliados.";
    else if (score >= 60) diagnostic = "Bom trabalho. Você conhece os conceitos principais, mas pode melhorar em alguns pontos.";
    else if (score >= 40) diagnostic = "Atenção necessária. Recomendamos revisar os fundamentos das matérias com dificuldades.";
    else diagnostic = "Nível crítico. É fundamental um plano de reforço imediato para recuperar as bases do aprendizado.";

    return { total: list.length, correct, wrong: list.length - correct, percent: score, diagnostic };
  }, [questions, answers, finishedAnswers, view]);

  if (view === 'LOADING') return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <Loader2 className="w-12 h-12 text-primary-600 animate-spin mb-4" />
      <p className="text-surface-900/40 font-black animate-pulse uppercase tracking-[0.2em] text-sm">Sorteando questões...</p>
    </div>
  );

  if (view === 'REVIEW') return (
    <main className="min-h-screen bg-surface-50 flex flex-col pb-20">
      <div className="max-w-4xl mx-auto w-full p-6 md:p-12 space-y-12">
        <div className="bg-white p-10 rounded-[40px] border border-surface-100 shadow-xl shadow-surface-900/5 text-center space-y-6">
          <div className="w-20 h-20 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={40} />
          </div>
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-surface-900">Avaliação Concluída!</h1>
            <p className="text-surface-900/50 font-medium">Os dados foram salvos e os campos de formulário foram limpos para a próxima avaliação.</p>
          </div>
          
          <div className="bg-primary-50/50 p-6 rounded-3xl border border-primary-100 text-left">
            <h4 className="text-primary-700 font-black text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
              <ClipboardCheck size={16} /> Diagnóstico Individual
            </h4>
            <p className="text-primary-900 font-medium leading-relaxed italic">
              "{reviewStats.diagnostic}"
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <button onClick={() => setView('FORM')} className="btn-primary">
              Nova Avaliação
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-black text-surface-900 pt-8">Revisão Detalhada</h2>
        
        {Object.values(questions).flat().map((q, idx) => {
          const isCorrect = finishedAnswers[q.id] === q.correctAnswer;
          return (
            <div key={q.id} className={`bg-white p-8 rounded-[32px] border-2 space-y-6 transition-all ${isCorrect ? 'border-success-500 bg-success-50/10' : 'border-danger-500 bg-danger-50/10'}`}>
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${isCorrect ? 'bg-success-500 text-white' : 'bg-danger-500 text-white'}`}>
                    {idx + 1}
                  </span>
                  <div>
                    <p className="text-lg font-black text-surface-900">{q.text}</p>
                    <div className="flex gap-2 mt-2">
                       <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider ${isCorrect ? 'bg-success-100 text-success-700' : 'bg-danger-100 text-danger-700'}`}>
                         {isCorrect ? 'ACERTOU' : 'ERROU'}
                       </span>
                       <span className="bg-surface-100 text-surface-600 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">
                         {q.category.replace('_', ' ')}
                       </span>
                    </div>
                  </div>
                </div>
                {isCorrect ? <CheckCircle2 className="text-success-500" size={32} /> : <XCircle className="text-danger-500" size={32} />}
              </div>

              <div className="bg-white/50 p-6 rounded-2xl border border-surface-100 space-y-4">
                  <div className="flex gap-4 items-center">
                    <div className="text-[10px] font-black uppercase text-surface-900/30 tracking-widest">Resposta do Aluno:</div>
                    <div className={`text-sm font-bold ${isCorrect ? 'text-success-600' : 'text-danger-600'}`}>{q.options[finishedAnswers[q.id]] || "Não respondida"}</div>
                  </div>
                  {!isCorrect && (
                    <div className="flex gap-4 items-center">
                      <div className="text-[10px] font-black uppercase text-surface-900/30 tracking-widest">Resposta Correta:</div>
                      <div className="text-sm font-bold text-success-600">{q.options[q.correctAnswer]}</div>
                    </div>
                  )}
                  <div className="pt-4 border-t border-surface-200 flex gap-3">
                    <Info size={16} className="text-primary-500 shrink-0 mt-1" />
                    <p className="text-sm text-surface-900/60 leading-relaxed">
                      <strong className="text-surface-900">Por que esta é a correta?</strong><br/>
                      {q.description}
                    </p>
                  </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-surface-50 flex flex-col">
      <nav className="bg-white border-b border-surface-100 px-8 py-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20"><GraduationCap size={22}/></div>
             <span className="font-black text-2xl tracking-tighter text-surface-900">SIMA</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" title="Acesso Admin" className="w-10 h-10 flex items-center justify-center text-surface-900/20 hover:text-primary-600 transition-all hover:bg-surface-50 rounded-xl">
               <Lock size={18} />
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 max-w-6xl mx-auto w-full p-6 md:p-12">
        {view === 'QUIZ' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                  <h1 className="text-5xl font-black text-surface-900 tracking-tighter mb-2">{activeTab}</h1>
                  <p className="text-surface-900/40 font-bold uppercase text-xs tracking-widest">
                    Aluno: <span className="text-surface-900">{formData.student}</span> • Turma: <span className="text-surface-900">{formData.class}</span>
                  </p>
                </div>
                <div className="space-y-3 md:text-right">
                  <div className="flex gap-2 md:justify-end">
                    {categories.map(cat => (
                      <button key={cat} onClick={() => setActiveTab(cat)} className={`h-2 rounded-full transition-all ${activeTab === cat ? 'bg-primary-600 w-12' : 'bg-surface-200 w-4'}`} />
                    ))}
                  </div>
                  {/* Ajuste 2: Contador de respostas respondidas */}
                  <p className="text-xs font-black text-primary-600 tracking-widest">{answeredCount} de {totalQuestions} QUESTÕES RESPONDIDAS ({progress}%)</p>
                </div>
             </div>

             <div className="space-y-8 pb-32">
                {questions[activeTab]?.map((q, idx) => (
                  <div key={q.id} className="card-premium space-y-6">
                    <div className="flex gap-4">
                      <span className="text-primary-600 font-black text-xl italic opacity-20">{String(idx + 1).padStart(2, '0')}</span>
                      <p className="text-2xl font-black text-surface-900 tracking-tight leading-tight">{q.text}</p>
                    </div>
                    <div className="grid gap-4">
                      {q.options.map((opt, oi) => (
                        <button 
                          key={oi} 
                          onClick={() => handleAnswer(q.id, oi)}
                          className={`p-6 rounded-[24px] border-2 text-left font-bold transition-all text-lg ${answers[q.id] === oi ? 'border-primary-500 bg-primary-50/50 text-primary-700 shadow-md shadow-primary-500/5' : 'border-surface-50 bg-surface-50/50 hover:border-surface-200 text-surface-900/60'}`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${answers[q.id] === oi ? 'border-primary-500 bg-primary-500' : 'border-surface-200'}`}>
                              {answers[q.id] === oi && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                            {opt}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
             </div>

             <footer className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-xl bg-surface-900/90 backdrop-blur-2xl rounded-[32px] p-2 flex gap-2 shadow-2xl border border-white/10 items-center">
                {categories.indexOf(activeTab) > 0 && (
                  <button onClick={() => setActiveTab(categories[categories.indexOf(activeTab) - 1])} className="flex-1 h-14 rounded-2xl font-black text-white/40 hover:text-white hover:bg-white/5 transition-all uppercase text-[10px] tracking-widest">
                    Anterior
                  </button>
                )}
                
                {categories.indexOf(activeTab) !== categories.length - 1 ? (
                  <button onClick={() => setActiveTab(categories[categories.indexOf(activeTab) + 1])} className="flex-[3] h-14 bg-white/10 rounded-2xl font-black text-white hover:bg-white/20 transition-all uppercase text-xs tracking-widest">
                    Próxima Matéria
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      if (confirm("Deseja realmente finalizar a avaliação? Certifique-se de ter respondido todas as questões.")) {
                        handleSubmit();
                      }
                    }} 
                    disabled={answeredCount === 0 || isSubmitting} 
                    className="flex-[3] h-14 bg-primary-500 rounded-2xl flex items-center justify-center gap-3 text-white shadow-lg shadow-primary-500/40 disabled:opacity-20 hover:bg-primary-400 transition-all font-black uppercase text-xs tracking-widest"
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (
                      <>
                        Finalizar Avaliação <Send size={18} />
                      </>
                    )}
                  </button>
                )}
             </footer>
          </div>
        ) : (
          <div className="max-w-md mx-auto space-y-12 py-10 animate-in slide-in-from-bottom-8 duration-1000">
            <div className="text-center space-y-4">
              <div className="w-24 h-24 bg-white rounded-[32px] flex items-center justify-center border border-surface-100 shadow-2xl shadow-primary-500/10 mx-auto mb-8">
                <GraduationCap size={48} className="text-primary-600" />
              </div>
              <h1 className="text-6xl font-black tracking-tighter text-surface-900">SIMA</h1>
              <p className="text-primary-600/40 text-sm font-black uppercase tracking-[0.3em]">Sistema de Mapeamento</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="label-minimal">Escola</label>
                  <input className="input-clean" placeholder="Nome" value={formData.school} onChange={e => setFormData({...formData, school: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="label-minimal">Turma</label>
                  <select className="input-clean bg-white appearance-none" value={formData.class} onChange={e => setFormData({...formData, class: e.target.value})}>
                    <option value="">Selecione</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="label-minimal">Operador</label>
                <input className="input-clean" placeholder="Nome completo" value={formData.operator} onChange={e => setFormData({...formData, operator: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="label-minimal">Aluno</label>
                <input className="input-clean" placeholder="Nome completo" value={formData.student} onChange={e => setFormData({...formData, student: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="label-minimal">Ano Escolar</label>
                <select className="input-clean bg-white appearance-none" value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})}>
                  <option value="12">3º Ano Ensino Médio</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="label-minimal">Zona</label>
                  <select className="input-clean bg-white appearance-none" value={formData.zone} onChange={e => setFormData({...formData, zone: e.target.value})}>
                    <option value="NORTE">Norte</option>
                    <option value="SUL">Sul</option>
                    <option value="LESTE">Leste</option>
                    <option value="OESTE">Oeste</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="label-minimal">Rede</label>
                  <select className="input-clean bg-white appearance-none" value={formData.schoolNetwork} onChange={e => setFormData({...formData, schoolNetwork: e.target.value})}>
                    <option value="PUBLICA">Pública</option>
                    <option value="PARTICULAR">Particular</option>
                  </select>
                </div>
              </div>
            </div>

            <button onClick={handleStart} className="w-full h-20 bg-primary-600 text-white rounded-[32px] text-xl font-black shadow-2xl shadow-primary-500/40 hover:bg-primary-700 active:scale-[0.98] transition-all flex items-center justify-center gap-3">
              Iniciar Avaliação <ChevronRight size={24} />
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
