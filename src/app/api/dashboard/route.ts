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
    const categoryStats: Record<string, { correct: number; total: number }> = {};

    assessments.forEach(a => {
      const school = a.schoolName || "Outros";
      const sClass = a.schoolClass || "Sem Turma";

      if (!schoolStats[school]) schoolStats[school] = { correct: 0, total: 0 };
      if (!classStats[sClass]) classStats[sClass] = { correct: 0, total: 0 };

      a.answers.forEach(ans => {
        const cat = ans.question.category;
        if (!categoryStats[cat]) categoryStats[cat] = { correct: 0, total: 0 };

        schoolStats[school].total++;
        classStats[sClass].total++;
        categoryStats[cat].total++;

        if (ans.isCorrect) {
          schoolStats[school].correct++;
          classStats[sClass].correct++;
          categoryStats[cat].correct++;
        }
      });
    });

    const categoriesData = Object.entries(categoryStats).map(([name, stats]) => ({
      name: name === 'MATEMATICA' ? 'Matemática' : name === 'CIENCIAS' ? 'Ciências' : name === 'GEOGRAFIA' ? 'Geografia' : name,
      value: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
    }));

    const classesData = Object.entries(classStats).map(([name, stats]) => ({
      class: name,
      score: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
    }));

    // Geração de Diagnóstico da Turma
    const classDiagnostics = Object.entries(classStats).map(([name, stats]) => {
      const score = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
      let text = "";
      if (score >= 80) text = "Desempenho excelente. A turma domina a maioria dos conceitos.";
      else if (score >= 60) text = "Bom desempenho, mas requer reforço em tópicos específicos.";
      else if (score >= 40) text = "Atenção necessária. Grande parte da turma apresenta dificuldades básicas.";
      else text = "Crítico. Necessário revisão completa dos fundamentos com a turma.";
      
      return { class: name, score: Math.round(score), diagnostic: text };
    });

    // Lista individual de alunos para o relatório
    const studentsData = assessments.map(a => {
      const correct = a.answers.filter(ans => ans.isCorrect).length;
      const total = a.answers.length;
      const score = total > 0 ? Math.round((correct / total) * 100) : 0;
      
      return {
        id: a.id,
        student: a.intervieweeName,
        school: a.schoolName,
        class: a.schoolClass,
        operator: a.operatorName,
        score: score,
        date: a.date
      };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Mais recentes primeiro

    return NextResponse.json({
      schools: Object.entries(schoolStats).map(([name, stats]) => ({
        school: name,
        score: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0
      })),
      categories: categoriesData,
      classes: classesData,
      diagnostics: classDiagnostics,
      students: studentsData
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
