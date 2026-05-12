import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function clearData() {
    try {
        // Limpa apenas os dados de execuções (Avaliações e Respostas)
        // Mantém as questões (Question) e Usuários (User)
        await prisma.answer.deleteMany();
        await prisma.assessment.deleteMany();
        console.log('Dados de avaliações e respostas limpos com sucesso!');
    } catch (error) {
        console.error('Erro ao limpar o banco:', error);
    } finally {
        await prisma.$disconnect();
    }
}

clearData();
