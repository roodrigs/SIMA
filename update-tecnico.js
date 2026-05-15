import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

const prisma = new PrismaClient();

async function updateTecnico() {
    try {
        // Atualizar schoolClass
        const updateClass = await prisma.assessment.updateMany({
            where: {
                schoolClass: {
                    equals: 'Tecnico',
                    mode: 'insensitive'
                }
            },
            data: {
                schoolClass: 'Técnico'
            }
        });
        console.log(`Turmas atualizadas: ${updateClass.count}`);

        // Atualizar schoolName (caso exista alguma exatamente como "tecnico")
        const updateName = await prisma.assessment.updateMany({
            where: {
                schoolName: {
                    equals: 'Tecnico',
                    mode: 'insensitive'
                }
            },
            data: {
                schoolName: 'Técnico'
            }
        });
        console.log(`Nomes de escolas atualizados: ${updateName.count}`);

    } catch (error) {
        console.error('Erro ao atualizar:', error);
    } finally {
        await prisma.$disconnect();
    }
}

updateTecnico();
