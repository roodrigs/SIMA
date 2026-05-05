import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET(request: Request) {
  try {
    if (!prisma) {
      throw new Error("Prisma client not initialized");
    }

    const { searchParams } = new URL(request.url);
    const grade = searchParams.get('grade');

    const where: any = {};
    if (grade) {
      where.grade = parseInt(grade);
    }

    // Busca as questões do banco filtrando por série se fornecido
    const allQuestions = await prisma.question.findMany({
      where
    });
    
    if (!allQuestions || allQuestions.length === 0) {
      return NextResponse.json({ error: "Nenhuma questão encontrada para esta série" }, { status: 404 });
    }

    const grouped: any = {};
    
    // Organiza por categoria
    allQuestions.forEach((q: any) => {
      if (!grouped[q.category]) grouped[q.category] = [];
      grouped[q.category].push({
        id: q.id,
        category: q.category,
        grade: q.grade,
        text: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
        description: `A alternativa correta é a baseada nos fundamentos de ${q.category.toLowerCase()}.`
      });
    });

    // Sorteia 10 aleatórias de cada categoria
    const limitedGrouped: any = {};
    Object.keys(grouped).forEach(cat => {
      limitedGrouped[cat] = grouped[cat]
        .sort(() => 0.5 - Math.random()) // Embaralha
        .slice(0, 10); // Pega 10
    });

    return NextResponse.json(limitedGrouped);
  } catch (error: any) {
    console.error("ERRO API QUESTIONS:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}