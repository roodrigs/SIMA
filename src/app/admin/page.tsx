"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8 text-center">Carregando dados...</div>;

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 border-b pb-4">Dashboard Administrativo - SIMA</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-green-500">
            <h3 className="text-gray-500 text-sm font-medium uppercase">Média de Acertos</h3>
            <p className="text-3xl font-bold text-gray-800">{data.global.avgHits.toFixed(1)} <span className="text-sm font-normal text-gray-400">/ 30</span></p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-red-500">
            <h3 className="text-gray-500 text-sm font-medium uppercase">Média de Erros</h3>
            <p className="text-3xl font-bold text-gray-800">{data.global.avgMisses.toFixed(1)} <span className="text-sm font-normal text-gray-400">/ 30</span></p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-blue-500">
            <h3 className="text-gray-500 text-sm font-medium uppercase">Total de Acertos</h3>
            <p className="text-3xl font-bold text-gray-800">{data.global.totalHits}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-purple-500">
            <h3 className="text-gray-500 text-sm font-medium uppercase">Média Ponderada Global</h3>
            <p className="text-3xl font-bold text-gray-800">{data.global.globalWeightedAvg.toFixed(1)} <span className="text-sm font-normal text-gray-400">/ 10</span></p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">Desempenho por Aluno</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Aluno</th>
                  <th className="px-6 py-4">Operador</th>
                  <th className="px-6 py-4">Acertos</th>
                  <th className="px-6 py-4">Erros</th>
                  <th className="px-6 py-4">Média Ponderada (0-10)</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {data.students.map((s: any, i: number) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{s.student}</td>
                    <td className="px-6 py-4 text-gray-600">{s.operator}</td>
                    <td className="px-6 py-4 text-green-600 font-bold">{s.hits}</td>
                    <td className="px-6 py-4 text-red-600 font-bold">{s.misses}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">{s.weightedAvg.toFixed(1)}</span>
                        <div className="w-24 bg-gray-200 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-blue-600 h-full" 
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
