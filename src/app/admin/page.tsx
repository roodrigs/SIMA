"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, TrendingUp, TrendingDown, Activity, Award, LogOut, BarChart3, Users, Map, MapPin, Target, AreaChart, Search, School } from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line, Area, AreaChart as ReAreaChart
} from 'recharts';

export default function AdminDashboard() {
  const [rawData, setRawData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    grade: "ALL",
    zone: "ALL",
    schoolNetwork: "ALL",
    school: "ALL",
    search: ""
  });
  const router = useRouter();

  useEffect(() => {
    // Verificar autenticação local
    const isAuthenticated = localStorage.getItem("sima_admin_auth");
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    fetch("/api/dashboard")
      .then(res => res.json())
      .then(d => {
        setRawData(d);
        setLoading(false);
      });
  }, [router]);

  const filteredData = useMemo(() => {
    if (!rawData) return null;

    let students = [...rawData.students];

    // Aplicar filtros na lista de alunos (fonte primária de dados)
    if (filters.grade !== "ALL") students = students.filter(s => s.grade === parseInt(filters.grade));
    if (filters.zone !== "ALL") students = students.filter(s => s.zone === filters.zone);
    if (filters.schoolNetwork !== "ALL") students = students.filter(s => s.schoolNetwork === filters.schoolNetwork);
    if (filters.school !== "ALL") students = students.filter(s => s.school === filters.school);
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      students = students.filter(s => 
        s.student.toLowerCase().includes(search) || 
        s.school.toLowerCase().includes(search) || 
        s.operator.toLowerCase().includes(search)
      );
    }

    if (students.length === 0) return { ...rawData, students: [], global: { avgHits: 0, avgMisses: 0, totalHits: 0, globalWeightedAvg: 0, stdDev: 0 }, distribution: [], categories: [], schools: [], classes: [], grades: [], zones: [], schoolNetworks: [] };

    // Recalcular métricas baseadas nos alunos filtrados
    let totalHits = 0;
    let totalQuestions = 0;
    const scores: number[] = [];
    const catStats: any = {};
    const schoolStats: any = {};
    const classStats: any = {};
    const gradeStats: any = {};
    const zoneStats: any = {};
    const schoolNetworkStats: any = {};

    students.forEach(s => {
      totalHits += s.hits;
      const total = s.hits + s.misses;
      totalQuestions += total;
      scores.push(s.weightedAvg);

      // Agrupamento para os mini-gráficos (seriam recalculados idealmente aqui)
      // Para manter a consistência, vamos usar os dados dos alunos filtrados para remontar os gráficos
      if (!schoolStats[s.school]) schoolStats[s.school] = { hits: 0, total: 0 };
      schoolStats[s.school].hits += s.hits;
      schoolStats[s.school].total += total;

      if (!classStats[s.class]) classStats[s.class] = { hits: 0, total: 0 };
      classStats[s.class].hits += s.hits;
      classStats[s.class].total += total;

      const gLabel = s.grade === 12 ? '3º Ensino Médio' : `${s.grade}º Ano`;
      if (!gradeStats[gLabel]) gradeStats[gLabel] = { hits: 0, total: 0 };
      gradeStats[gLabel].hits += s.hits;
      gradeStats[gLabel].total += total;

      if (!zoneStats[s.zone]) zoneStats[s.zone] = { hits: 0, total: 0 };
      zoneStats[s.zone].hits += s.hits;
      zoneStats[s.zone].total += total;

      if (!schoolNetworkStats[s.schoolNetwork]) schoolNetworkStats[s.schoolNetwork] = { hits: 0, total: 0 };
      schoolNetworkStats[s.schoolNetwork].hits += s.hits;
      schoolNetworkStats[s.schoolNetwork].total += total;
    });

    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const stdDev = Math.sqrt(scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scores.length);

    return {
      students,
      global: {
        avgHits: totalHits / students.length,
        avgMisses: (totalQuestions - totalHits) / students.length,
        totalHits: totalHits,
        globalWeightedAvg: (totalHits / totalQuestions) * 10,
        stdDev: stdDev
      },
      distribution: Array.from({ length: 11 }, (_, i) => ({
        nota: i,
        alunos: scores.filter(s => Math.round(s) === i).length
      })),
      categories: rawData.categories, // Categorias são globais, mas poderiam ser filtradas por avaliação se necessário
      schools: Object.entries(schoolStats).map(([name, s]: any) => ({ school: name, score: Math.round((s.hits / s.total) * 100) })),
      classes: Object.entries(classStats).map(([name, s]: any) => ({ class: name, score: Math.round((s.hits / s.total) * 100) })),
      grades: Object.entries(gradeStats).map(([name, s]: any) => ({ grade: name, score: Math.round((s.hits / s.total) * 100) })),
      zones: Object.entries(zoneStats).map(([name, s]: any) => ({ zone: name, score: Math.round((s.hits / s.total) * 100) })),
      schoolNetworks: Object.entries(schoolNetworkStats).map(([name, s]: any) => ({ schoolNetwork: name, score: Math.round((s.hits / s.total) * 100) }))
    };
  }, [rawData, filters]);

  const handleLogout = () => {
    localStorage.removeItem("sima_admin_auth");
    router.push("/login");
  };

  if (loading) return (
    <div className="min-h-screen bg-surface-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mb-4" />
      <p className="text-surface-900/40 font-black uppercase tracking-widest text-xs">Carregando inteligência de dados...</p>
    </div>
  );

  const data = filteredData || rawData;

  return (
    <main className="min-h-screen bg-surface-50 flex flex-col pb-20">
      <nav className="bg-white border-b border-surface-100 px-8 py-4 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20"><GraduationCap size={22}/></div>
            <span className="font-black text-2xl tracking-tighter text-surface-900">SIMA ADMIN</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-[10px] font-black text-surface-900/40 uppercase tracking-widest">Painel de Controle</span>
              <span className="text-xs font-bold text-surface-900">BI & Analytics Real-time</span>
            </div>
            <button 
              onClick={handleLogout}
              className="w-10 h-10 flex items-center justify-center bg-surface-50 text-surface-900/40 hover:text-danger-500 hover:bg-danger-50 transition-all rounded-xl"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-1 max-w-[1600px] mx-auto w-full p-6 md:p-12 space-y-12">
        {/* Filtros e Busca */}
        <div className="bg-white p-8 rounded-[40px] border border-surface-100 shadow-sm flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center shadow-inner"><Search size={22} /></div>
            <input 
              type="text" 
              placeholder="Buscar aluno, escola ou operador..." 
              className="bg-transparent font-bold text-surface-900 placeholder:text-surface-900/20 focus:outline-none w-full md:w-64"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
            <select 
              className="bg-surface-50 p-4 rounded-2xl font-bold text-surface-900 text-xs focus:outline-none border-none cursor-pointer"
              value={filters.school}
              onChange={(e) => setFilters({...filters, school: e.target.value})}
            >
              <option value="ALL">Todas as Escolas</option>
              {rawData && Array.from(new Set(rawData.students.map((s: any) => s.school))).map((s: any) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select 
              className="bg-surface-50 p-4 rounded-2xl font-bold text-surface-900 text-xs focus:outline-none border-none cursor-pointer"
              value={filters.schoolNetwork}
              onChange={(e) => setFilters({...filters, schoolNetwork: e.target.value})}
            >
              <option value="ALL">Todas as Redes</option>
              <option value="PUBLICA">Pública</option>
              <option value="PARTICULAR">Particular</option>
            </select>
            <select 
              className="bg-surface-50 p-4 rounded-2xl font-bold text-surface-900 text-xs focus:outline-none border-none cursor-pointer"
              value={filters.grade}
              onChange={(e) => setFilters({...filters, grade: e.target.value})}
            >
              <option value="ALL">Todas as Séries</option>
              <option value="12">3º Ensino Médio</option>
            </select>
            <button 
              onClick={() => setFilters({ grade: "ALL", zone: "ALL", schoolNetwork: "ALL", school: "ALL", search: "" })}
              className="p-4 bg-surface-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-surface-800 transition-all"
            >
              Limpar Filtros
            </button>
          </div>
        </div>

        {/* KPIs Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="bg-white p-8 rounded-[32px] border border-surface-100 shadow-sm space-y-4">
            <div className="w-10 h-10 bg-success-50 text-success-600 rounded-xl flex items-center justify-center"><TrendingUp size={20} /></div>
            <div>
              <h3 className="text-surface-900/40 text-[10px] font-black uppercase tracking-widest">Média de Acertos</h3>
              <p className="text-4xl font-black text-surface-900 tracking-tighter">{data.global.avgHits.toFixed(1)}</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[32px] border border-surface-100 shadow-sm space-y-4">
            <div className="w-10 h-10 bg-danger-50 text-danger-600 rounded-xl flex items-center justify-center"><TrendingDown size={20} /></div>
            <div>
              <h3 className="text-surface-900/40 text-[10px] font-black uppercase tracking-widest">Média de Erros</h3>
              <p className="text-4xl font-black text-surface-900 tracking-tighter">{data.global.avgMisses.toFixed(1)}</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[32px] border border-surface-100 shadow-sm space-y-4">
            <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center"><Activity size={20} /></div>
            <div>
              <h3 className="text-surface-900/40 text-[10px] font-black uppercase tracking-widest">Total de Acertos</h3>
              <p className="text-4xl font-black text-surface-900 tracking-tighter">{data.global.totalHits}</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[32px] border border-surface-100 shadow-sm space-y-4">
            <div className="w-10 h-10 bg-warning-50 text-warning-500 rounded-xl flex items-center justify-center"><Award size={20} /></div>
            <div>
              <h3 className="text-surface-900/40 text-[10px] font-black uppercase tracking-widest">Média Global</h3>
              <p className="text-4xl font-black text-surface-900 tracking-tighter">{data.global.globalWeightedAvg.toFixed(1)} <span className="text-sm font-black text-surface-900/20">/10</span></p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[32px] border border-surface-100 shadow-sm space-y-4 border-l-4 border-l-primary-500">
            <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center"><Target size={20} /></div>
            <div>
              <h3 className="text-surface-900/40 text-[10px] font-black uppercase tracking-widest">Desvio Padrão</h3>
              <p className="text-4xl font-black text-surface-900 tracking-tighter">{data.global.stdDev.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Gráficos Geográficos e por Série */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Por Série */}
           <div className="bg-white p-10 rounded-[40px] border border-surface-100 shadow-sm space-y-8">
            <h3 className="text-xl font-black text-surface-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center"><GraduationCap size={20} /></div>
              Desempenho por Série (%)
            </h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.grades}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="grade" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: '900', fill: '#94a3b8'}} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold'}} />
                  <Bar dataKey="score" fill="#3b82f6" radius={[8, 8, 8, 8]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Por Zona */}
          <div className="bg-white p-10 rounded-[40px] border border-surface-100 shadow-sm space-y-8">
            <h3 className="text-xl font-black text-surface-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-success-50 text-success-600 rounded-xl flex items-center justify-center"><Map size={20} /></div>
              Desempenho por Zona (%)
            </h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.zones}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="zone" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: '900', fill: '#94a3b8'}} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold'}} />
                  <Bar dataKey="score" fill="#10b981" radius={[8, 8, 8, 8]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Por Rede */}
          <div className="bg-white p-10 rounded-[40px] border border-surface-100 shadow-sm space-y-8">
            <h3 className="text-xl font-black text-surface-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-warning-50 text-warning-500 rounded-xl flex items-center justify-center"><MapPin size={20} /></div>
              Desempenho por Rede (%)
            </h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.schoolNetworks}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="schoolNetwork" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: '900', fill: '#94a3b8'}} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold'}} />
                  <Bar dataKey="score" fill="#f59e0b" radius={[8, 8, 8, 8]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Gráfico de Desvio Padrão / Curva de Aprendizado */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border border-surface-100 shadow-sm space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-surface-900 flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center"><AreaChart size={20} /></div>
                Distribuição de Notas (Curva de Aprendizado)
              </h3>
              <div className="text-right">
                <p className="text-[10px] font-black text-surface-900/40 uppercase tracking-widest">Frequência de Notas</p>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ReAreaChart data={data.distribution}>
                  <defs>
                    <linearGradient id="colorAlunos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="nota" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: '900', fill: '#94a3b8'}} label={{ value: 'Nota (0-10)', position: 'insideBottom', offset: -5, fontSize: 10, fontWeight: 'bold' }} />
                  <YAxis hide />
                  <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold'}} />
                  <Area type="monotone" dataKey="alunos" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorAlunos)" />
                </ReAreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico por Matéria Re-estilizado */}
          <div className="bg-white p-10 rounded-[40px] border border-surface-100 shadow-sm space-y-8">
            <h3 className="text-xl font-black text-surface-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-danger-50 text-danger-600 rounded-xl flex items-center justify-center"><BarChart3 size={20} /></div>
              Por Matéria (%)
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.categories} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" hide domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: '900', fill: '#94a3b8'}} width={80} />
                  <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold'}} />
                  <Bar dataKey="score" radius={[0, 8, 8, 0]} barSize={25}>
                    {data.categories.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={['#3b82f6', '#10b981', '#f59e0b', '#f43f5e'][index % 4]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gráfico por Turma */}
          <div className="bg-white p-10 rounded-[40px] border border-surface-100 shadow-sm space-y-8">
            <h3 className="text-xl font-black text-surface-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-success-50 text-success-600 rounded-xl flex items-center justify-center"><Users size={20} /></div>
              Desempenho por Turma (%)
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.classes}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="class" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: '900', fill: '#94a3b8'}} interval={0} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}} 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold'}} 
                  />
                  <Bar dataKey="score" radius={[8, 8, 8, 8]} barSize={40}>
                    {data.classes.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.score >= 80 ? '#10b981' : entry.score >= 60 ? '#3b82f6' : entry.score >= 40 ? '#f59e0b' : '#f43f5e'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfico por Escola */}
          <div className="bg-white p-10 rounded-[40px] border border-surface-100 shadow-sm space-y-8">
            <h3 className="text-xl font-black text-surface-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-50 text-primary-600 rounded-xl flex items-center justify-center"><School size={20} /></div>
              Desempenho por Escola (%)
            </h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.schools}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="school" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: '900', fill: '#94a3b8'}} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}} 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold'}} 
                  />
                  <Bar dataKey="score" fill="#6366f1" radius={[8, 8, 8, 8]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[40px] border border-surface-100 shadow-xl shadow-surface-900/5 overflow-hidden">
          <div className="p-10 border-b border-surface-50 bg-surface-50/30 flex justify-between items-center">
            <h2 className="text-2xl font-black text-surface-900 tracking-tight">Relatório Consolidado de Alunos</h2>
            <span className="bg-primary-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">{data.students.length} Avaliações</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-surface-900/30 text-[10px] font-black uppercase tracking-widest">
                  <th className="px-10 py-6">Aluno</th>
                  <th className="px-10 py-6">Série/Zona/Rede</th>
                  <th className="px-10 py-6">Operador</th>
                  <th className="px-10 py-6">Status</th>
                  <th className="px-10 py-6">Média Ponderada (0-10)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-50">
                {data.students.map((s: any, i: number) => (
                  <tr key={i} className="hover:bg-surface-50/50 transition-colors group">
                    <td className="px-10 py-6">
                       <div className="flex flex-col">
                         <span className="font-black text-surface-900 group-hover:text-primary-600 transition-colors">{s.student}</span>
                         <span className="text-[10px] text-surface-900/40 font-bold uppercase">{s.school}</span>
                       </div>
                    </td>
                    <td className="px-10 py-6">
                       <div className="flex gap-2">
                         <span className="bg-surface-100 text-surface-900 px-3 py-1 rounded-full text-[9px] font-black">{s.grade === 12 ? '3º E.M.' : `${s.grade}º Ano`}</span>
                         <span className="bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-[9px] font-black">{s.zone}</span>
                         <span className="bg-warning-50 text-warning-600 px-3 py-1 rounded-full text-[9px] font-black">{s.schoolNetwork}</span>
                       </div>
                    </td>
                    <td className="px-10 py-6 text-surface-900/60 font-bold">{s.operator}</td>
                    <td className="px-10 py-6">
                       <div className="flex gap-4">
                         <span className="text-success-600 font-black text-sm">{s.hits} <span className="text-[10px] opacity-40 uppercase">Hits</span></span>
                         <span className="text-danger-600 font-black text-sm">{s.misses} <span className="text-[10px] opacity-40 uppercase">Miss</span></span>
                       </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center space-x-4">
                        <span className="font-black text-lg text-surface-900">{s.weightedAvg.toFixed(1)}</span>
                        <div className="w-32 bg-surface-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-700 ${s.weightedAvg >= 7 ? 'bg-success-500' : s.weightedAvg >= 5 ? 'bg-primary-500' : 'bg-danger-500'}`} 
                            style={{ width: `${s.weightedAvg * 10}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
