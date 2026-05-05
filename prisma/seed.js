import { PrismaClient } from '@prisma/client';
import 'dotenv/config';

// No Prisma 7, o construtor parece exigir ao menos um objeto vazio {}
// para não disparar o erro de "non-empty options".
const prisma = new PrismaClient({});

async function main() {
  const subjects = [
    {
      name: 'MATEMATICA',
      questions: [
        { text: "Quanto é 7 x 8?", options: ["54", "56", "64", "48"], correct: 1 },
        { text: "Qual a raiz quadrada de 144?", options: ["10", "11", "12", "14"], correct: 2 },
        { text: "Se x + 5 = 12, quanto vale x?", options: ["5", "7", "8", "6"], correct: 1 },
        { text: "Qual o valor de pi (aproximado)?", options: ["3,12", "3,14", "3,16", "3,18"], correct: 1 },
        { text: "Quanto é 15% de 200?", options: ["20", "25", "30", "35"], correct: 2 },
        { text: "Qual o resultado de 100 ÷ 4?", options: ["20", "25", "30", "40"], correct: 1 },
        { text: "Qual o volume de um cubo de lado 3?", options: ["9", "18", "27", "81"], correct: 2 },
        { text: "Quanto é 2 elevado a 5?", options: ["10", "16", "32", "64"], correct: 2 },
        { text: "Qual a soma dos ângulos internos de um triângulo?", options: ["90°", "180°", "270°", "360°"], correct: 1 },
        { text: "Se um carro percorre 60km em 1h, quanto percorre em 3h?", options: ["120km", "150km", "180km", "200km"], correct: 2 },
        { text: "Quanto é 1/2 + 1/4?", options: ["1/6", "2/4", "3/4", "1/2"], correct: 2 },
        { text: "Qual o perímetro de um quadrado de lado 5?", options: ["10", "20", "25", "15"], correct: 1 },
        { text: "Quanto é 9 x 9?", options: ["72", "81", "90", "99"], correct: 1 },
        { text: "Qual o sucessor de 999?", options: ["998", "1000", "1001", "1100"], correct: 1 },
        { text: "O que é um triângulo isósceles?", options: ["3 lados iguais", "2 lados iguais", "Nenhum lado igual", "Tem um ângulo de 90°"], correct: 1 },
        { text: "Quanto é 50 x 20?", options: ["100", "500", "1000", "5000"], correct: 2 },
        { text: "Quanto é 1000 - 345?", options: ["655", "755", "645", "745"], correct: 0 },
        { text: "Qual o resultado de 12 x 12?", options: ["124", "134", "144", "154"], correct: 2 },
        { text: "O que é um número primo?", options: ["Número par", "Divisível por 1 e por ele mesmo", "Divisível por 2", "Número terminado em 0"], correct: 1 },
        { text: "Quanto é 5! (fatorial de 5)?", options: ["25", "60", "120", "150"], correct: 2 },
        { text: "Qual a área de um retângulo 4x6?", options: ["10", "20", "24", "28"], correct: 2 },
        { text: "Quanto é 0,5 em porcentagem?", options: ["5%", "50%", "0,5%", "500%"], correct: 1 },
        { text: "Qual o MMC de 4 e 6?", options: ["12", "18", "24", "10"], correct: 0 },
        { text: "Quanto é 10³?", options: ["30", "100", "300", "1000"], correct: 3 },
        { text: "Qual o valor de x em 2x = 10?", options: ["2", "5", "8", "20"], correct: 1 }
      ]
    },
    {
      name: 'CIENCIAS',
      questions: [
        { text: "Qual o planeta mais próximo do Sol?", options: ["Vênus", "Marte", "Mercúrio", "Terra"], correct: 2 },
        { text: "Qual o maior órgão do corpo humano?", options: ["Coração", "Fígado", "Pele", "Pulmão"], correct: 2 },
        { text: "O que as plantas produzem na fotossíntese?", options: ["Oxigênio e Glicose", "Gás Carbônico", "Água", "Nitrogênio"], correct: 0 },
        { text: "Qual o satélite natural da Terra?", options: ["Sol", "Lua", "Marte", "Europa"], correct: 1 },
        { text: "Qual gás os humanos precisam para respirar?", options: ["Nitrogênio", "Gás Carbônico", "Oxigênio", "Hidrogênio"], correct: 2 },
        { text: "Quantos planetas existem no sistema solar?", options: ["7", "8", "9", "10"], correct: 1 },
        { text: "O que é H2O?", options: ["Hélio", "Oxigênio", "Água", "Hidrogênio"], correct: 2 },
        { text: "Qual a principal fonte de energia da Terra?", options: ["Lua", "Sol", "Petróleo", "Eletricidade"], correct: 1 },
        { text: "Qual parte da planta absorve água?", options: ["Flor", "Folha", "Fruto", "Raiz"], correct: 3 },
        { text: "Quem formulou a teoria da evolução?", options: ["Einstein", "Newton", "Darwin", "Galileu"], correct: 2 },
        { text: "Qual o estado físico do gelo?", options: ["Líquido", "Sólido", "Gasoso", "Plasma"], correct: 1 },
        { text: "Quantos ossos tem um adulto médio?", options: ["150", "206", "300", "250"], correct: 1 },
        { text: "Onde fica o fêmur?", options: ["Braço", "Perna", "Costas", "Pé"], correct: 1 },
        { text: "Qual o metal líquido à temperatura ambiente?", options: ["Ouro", "Ferro", "Mercúrio", "Prata"], correct: 2 },
        { text: "Qual animal é um anfíbio?", options: ["Cobra", "Sapo", "Peixe", "Baleia"], correct: 1 },
        { text: "Qual a função do coração?", options: ["Respirar", "Bombear sangue", "Digerir comida", "Pensar"], correct: 1 },
        { text: "O que é o vácuo?", options: ["Espaço cheio de ar", "Ausência de matéria", "Um tipo de gás", "Água gelada"], correct: 1 },
        { text: "Qual o maior animal do mundo?", options: ["Elefante", "Baleia Azul", "Girafa", "Tubarão Branco"], correct: 1 },
        { text: "Como se chama o processo da lagarta virar borboleta?", options: ["Evolução", "Metamorfose", "Crescimento", "Mutação"], correct: 1 },
        { text: "O que protege a Terra dos raios UV?", options: ["Nuvens", "Camada de Ozônio", "Poluição", "Estrelas"], correct: 1 },
        { text: "Qual sistema transporta oxigênio?", options: ["Digestivo", "Nervoso", "Circulatório", "Excretor"], correct: 2 },
        { text: "Qual planeta é conhecido como Planeta Vermelho?", options: ["Vênus", "Júpiter", "Marte", "Saturno"], correct: 2 },
        { text: "O que é um animal herbívoro?", options: ["Come carne", "Come plantas", "Come de tudo", "Não come"], correct: 1 },
        { text: "Qual a velocidade da luz (aprox)?", options: ["300.000 km/s", "150.000 km/s", "1.000 km/h", "340 m/s"], correct: 0 },
        { text: "O que estuda a Botânica?", options: ["Animais", "Pedras", "Plantas", "Estrelas"], correct: 2 }
      ]
    },
    {
      name: 'GEOGRAFIA',
      questions: [
        { text: "Qual o maior país do mundo em território?", options: ["Brasil", "EUA", "China", "Rússia"], correct: 3 },
        { text: "Qual o continente onde fica o Brasil?", options: ["África", "Europa", "América do Sul", "Ásia"], correct: 2 },
        { text: "Qual a capital do Brasil?", options: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"], correct: 2 },
        { text: "Qual o oceano que banha o Brasil?", options: ["Pacífico", "Índico", "Atlântico", "Glacial Ártico"], correct: 2 },
        { text: "Qual o maior rio do mundo em volume?", options: ["Nilo", "Amazonas", "Mississipi", "Ganges"], correct: 1 },
        { text: "Em qual continente fica o Egito?", options: ["Ásia", "Europa", "África", "Oceania"], correct: 2 },
        { text: "Qual a maior floresta tropical do mundo?", options: ["Congo", "Taiga", "Amazônica", "Mata Atlântica"], correct: 2 },
        { text: "Quantos continentes existem?", options: ["4", "5", "6", "7"], correct: 2 },
        { text: "Qual o ponto mais alto da Terra?", options: ["Monte Kilimanjaro", "Monte Everest", "Andes", "Pico da Neblina"], correct: 1 },
        { text: "Qual país tem o formato de uma bota?", options: ["Grécia", "Portugal", "Itália", "Espanha"], correct: 2 },
        { text: "Qual o desertos mais seco do mundo?", options: ["Saara", "Atacama", "Gobi", "Kalahari"], correct: 1 },
        { text: "Qual a capital da França?", options: ["Londres", "Madri", "Berlim", "Paris"], correct: 3 },
        { text: "Qual país é conhecido como o 'Sol Nascente'?", options: ["China", "Japão", "Coreia", "Vietnã"], correct: 1 },
        { text: "Onde fica a Muralha da China?", options: ["Japão", "China", "Mongólia", "Tailândia"], correct: 1 },
        { text: "Qual o menor país do mundo?", options: ["Mônaco", "Malta", "Vaticano", "San Marino"], correct: 2 },
        { text: "Qual linha divide a Terra em Norte e Sul?", options: ["Meridiano de Greenwich", "Trópico de Câncer", "Linha do Equador", "Círculo Polar"], correct: 2 },
        { text: "Qual a capital de Portugal?", options: ["Porto", "Lisboa", "Braga", "Coimbra"], correct: 1 },
        { text: "Qual o maior oceano do planeta?", options: ["Atlântico", "Índico", "Glacial Antártico", "Pacífico"], correct: 3 },
        { text: "Onde se localiza o Canal do Panamá?", options: ["América do Norte", "América Central", "América do Sul", "Europa"], correct: 1 },
        { text: "Qual país é famoso pelas Pirâmides?", options: ["México", "Egito", "Peru", "Grécia"], correct: 1 },
        { text: "Qual a língua mais falada no mundo?", options: ["Espanhol", "Inglês", "Mandarim", "Português"], correct: 2 },
        { text: "Em que hemisfério fica a maior parte do Brasil?", options: ["Norte", "Sul", "Leste", "Oeste"], correct: 1 },
        { text: "Qual o estado brasileiro com maior território?", options: ["Minas Gerais", "Mato Grosso", "Amazonas", "Bahia"], correct: 2 },
        { text: "O que é o efeito estufa?", options: ["Resfriamento da terra", "Aquecimento da atmosfera", "Chuva ácida", "Tsunami"], correct: 1 },
        { text: "Qual a capital da Argentina?", options: ["Santiago", "Montevidéu", "Assunção", "Buenos Aires"], correct: 3 }
      ]
    }
  ];

  console.log('Iniciando limpeza do banco...');
  await prisma.answer.deleteMany();
  await prisma.assessment.deleteMany();
  await prisma.question.deleteMany();
  await prisma.user.deleteMany();

  console.log('Criando usuário admin...');
  await prisma.user.create({
    data: {
      username: 'admin',
      password: '123'
    }
  });

  const grades = [5, 6, 7, 8, 9];

  console.log('Populando questões...');
  for (const grade of grades) {
    for (const subject of subjects) {
      for (const q of subject.questions) {
        await prisma.question.create({
          data: {
            category: subject.name,
            grade: grade,
            text: q.text,
            options: q.options,
            correctAnswer: q.correct
          }
        });
      }
    }
  }

  console.log('✅ Seed completo: Usuário admin criado e questões geradas para todas as séries.');
}

main()
  .catch((e) => {
    console.error('❌ Erro no Seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
