import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    if (!prisma) {
      throw new Error("Prisma client not initialized");
    }

    const body = await request.json();
    const { operatorName, intervieweeName, schoolName, schoolClass, grade, zone, schoolNetwork, answers } = body;

    const result = await prisma.$transaction(async (tx) => {
      const assessment = await tx.assessment.create({
        data: {
          operatorName,
          intervieweeName,
          schoolName,
          schoolClass,
          grade: parseInt(grade),
          zone,
          schoolNetwork,
          answers: {
            create: answers.map((a: any) => ({
              questionId: a.questionId,
              selectedIdx: a.selectedIdx,
              isCorrect: a.isCorrect
            }))
          }
        }
      });
      return assessment;
    });

    return NextResponse.json({ id: result.id, status: "success" });

  } catch (error: any) {
    console.error("ERRO AO SALVAR NO BANCO COM PRISMA:", error);
    return NextResponse.json({ 
      error: error.message,
      status: "error"
    }, { status: 500 });
  }
}
