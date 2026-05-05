import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    if (!prisma) {
      return NextResponse.json({ error: "Serviço de banco de dados indisponível" }, { status: 500 });
    }

    const { username, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Usuário ou senha inválidos" }, { status: 401 });
    }

    // Em um sistema real, usaríamos JWT ou Sessions. 
    // Para simplificar localmente, retornaremos sucesso.
    return NextResponse.json({ success: true, user: { username: user.username } });
  } catch (error) {
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
