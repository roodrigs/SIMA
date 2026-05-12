import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (!prisma) {
      throw new Error("Prisma client not initialized");
    }

    const assessments = await prisma.assessment.findMany({
      include: {
        answers: {
          include: {
            question: true
          }
        }
      }
    });

    const schoolStats: Record<string, { correct: number; total: number }> = {};
    const classStats: Record<string, { correct: number; total: number }> = {};
    const gradeStats: Record<number, { correct: number; total: number }> = {};
    const zoneStats: Record<string, { correct: number; total: number }> = {};
    const schoolNetworkStats: Record<string, { correct: number; total: number }> = {};
    const categoryStats: Record<string, { correct: number; total: number }> = {};
    const allScores: number[] = [];

    assessments.forEach(a => {
      const school = (a.schoolName || "Outros").trim();
      const sClass = `${school} - ${a.schoolClass || "Sem Turma"}`;
      const grade = a.grade;
      const zone = a.zone;
      const schoolNetwork = a.schoolNetwork;

      if (!schoolStats[school]) schoolStats[school] = { correct: 0, total: 0 };
      if (!classStats[sClass]) classStats[sClass] = { correct: 0, total: 0 };
      if (!gradeStats[grade]) gradeStats[grade] = { correct: 0, total: 0 };
      if (!zoneStats[zone]) zoneStats[zone] = { correct: 0, total: 0 };
      if (!schoolNetworkStats[schoolNetwork]) schoolNetworkStats[schoolNetwork] = { correct: 0, total: 0 };

      let assessmentCorrect = 0;
      let assessmentTotal = 0;

      a.answers.forEach(ans => {
        const cat = ans.question.category;
        if (!categoryStats[cat]) categoryStats[cat] = { correct: 0, total: 0 };

        schoolStats[school].total++;
        classStats[sClass].total++;
        gradeStats[grade].total++;
        zoneStats[zone].total++;
        schoolNetworkStats[schoolNetwork].total++;
        categoryStats[cat].total++;
        assessmentTotal++;

        if (ans.isCorrect) {
          schoolStats[school].correct++;
          classStats[sClass].correct++;
          gradeStats[grade].correct++;
          zoneStats[zone].correct++;
          schoolNetworkStats[schoolNetwork].correct++;
          categoryStats[cat].correct++;
          assessmentCorrect++;
        }
      });

      if (assessmentTotal > 0) {
        allScores.push((assessmentCorrect / assessmentTotal) * 10);
      }
    });

    const categoryNames: Record<string, string> = {
      'MATEMATICA': 'Matemática',
      'PORTUGUES': 'Português',
      'CIENCIAS BIOLOGICAS': 'Ciências Biológicas',
      'HISTORIA': 'História'
    };

    const categoriesData = Object.entries(categoryStats).map(([name, stats]) => ({
      name: categoryNames[name] || name,
      score: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
      value: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0 
    }));

    const gradesData = Object.entries(gradeStats).map(([name, stats]) => ({
      grade: name.toString() === '12' ? '3º Ensino Médio' : `${name}º Ano`,
      score: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
    })).sort((a, b) => a.grade.localeCompare(b.grade));

    const zonesData = Object.entries(zoneStats).map(([name, stats]) => ({
      zone: name,
      score: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
    }));

    const schoolNetworksData = Object.entries(schoolNetworkStats).map(([name, stats]) => ({
      schoolNetwork: name,
      score: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
    }));

    // Cálculos de Desvio Padrão
    const mean = allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0;
    const variance = allScores.length > 0 ? allScores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / allScores.length : 0;
    const stdDev = Math.sqrt(variance);

    // Distribuição de notas para gráfico de curva
    const distribution = Array.from({ length: 11 }, (_, i) => {
      const count = allScores.filter(s => Math.round(s) === i).length;
      return { nota: i, alunos: count };
    });

    // Cálculos globais
    let totalAllHits = 0;
    let totalAllQuestions = 0;
    assessments.forEach(a => {
      a.answers.forEach(ans => {
        totalAllQuestions++;
        if (ans.isCorrect) totalAllHits++;
      });
    });

    const totalAllMisses = totalAllQuestions - totalAllHits;
    const globalStats = {
      avgHits: assessments.length > 0 ? totalAllHits / assessments.length : 0,
      avgMisses: assessments.length > 0 ? totalAllMisses / assessments.length : 0,
      totalHits: totalAllHits,
      globalWeightedAvg: totalAllQuestions > 0 ? (totalAllHits / totalAllQuestions) * 10 : 0,
      stdDev: stdDev
    };

    const classesData = Object.entries(classStats).map(([name, stats]) => {
      const parts = name.split(' - ');
      const schoolName = parts[0];
      const className = parts.slice(1).join(' - ');
      
      return {
        class: className || name,
        school: schoolName,
        fullClass: name,
        score: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
      };
    }).sort((a, b) => a.fullClass.localeCompare(b.fullClass));

    // Geração de Diagnóstico da Turma
    const classDiagnostics = Object.entries(classStats).map(([name, stats]) => {
      const score = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
      let text = "";
      if (score >= 80) text = "Desempenho excelente. A turma domina a maioria dos conceitos.";
      else if (score >= 60) text = "Bom desempenho, mas requer reforço em tópicos específicos.";
      else if (score >= 40) text = "Atenção necessária. Grande parte da turma apresenta dificuldades básicas.";
      else text = "Crítico. Necessário revisão completa dos fundamentos com a turma.";
      
      const parts = name.split(' - ');
      const schoolName = parts[0];
      const className = parts.slice(1).join(' - ');

      return { 
        class: className || name, 
        school: schoolName,
        fullClass: name,
        score: Math.round(score), 
        diagnostic: text 
      };
    }).sort((a, b) => a.fullClass.localeCompare(b.fullClass));

    // Lista individual de alunos para o relatório
    const studentsData = assessments.map(a => {
      const hits = a.answers.filter(ans => ans.isCorrect).length;
      const total = a.answers.length;
      const score = total > 0 ? Math.round((hits / total) * 100) : 0;
      const weightedAvg = total > 0 ? (hits / total) * 10 : 0;
      
      return {
        id: a.id,
        student: a.intervieweeName,
        school: a.schoolName,
        class: a.schoolClass,
        grade: a.grade,
        zone: a.zone,
        schoolNetwork: a.schoolNetwork,
        operator: a.operatorName,
        hits: hits,
        misses: total - hits,
        score: score, // Para o dashboard principal
        weightedAvg: weightedAvg, // Para o dashboard admin
        date: a.date
      };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({
      global: globalStats,
      schools: Object.entries(schoolStats).map(([name, stats]) => ({
        school: name,
        score: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
      })),
      categories: categoriesData,
      classes: classesData,
      grades: gradesData,
      zones: zonesData,
      schoolNetworks: schoolNetworksData,
      distribution: distribution,
      diagnostics: classDiagnostics,
      students: studentsData
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
