import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export async function GET() {
  try {
    if (!prisma) {
      throw new Error("Prisma client not initialized");
    }

    // Busca todas as questões do banco usando Prisma
    const allQuestions = await prisma.question.findMany();
    
    if (!allQuestions || allQuestions.length === 0) {
      return NextResponse.json({ error: "Banco vazio" }, { status: 404 });
    }

    const grouped: any = {};
    
    // Organiza por categoria
    allQuestions.forEach((q: any) => {
      if (!grouped[q.category]) grouped[q.category] = [];
      grouped[q.category].push({
        id: q.id,
        category: q.category,
        text: q.text,
        options: JSON.parse(q.options),
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
