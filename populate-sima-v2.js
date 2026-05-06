import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Limpando banco de dados para correção de categorias...');
  await prisma.answer.deleteMany({});
  await prisma.assessment.deleteMany({});
  await prisma.question.deleteMany({});

  const questions = [
    // MATEMATICA (10)
    {
      category: 'MATEMATICA',
      grade: 12,
      text: 'Uma função do 2º grau tem a forma f(x) = ax² + bx + c. Se o gráfico dessa função é uma parábola com concavidade voltada para cima e não intercepta o eixo x, pode-se afirmar que:',
      options: ['a > 0 e delta < 0', 'a < 0 e delta > 0', 'a > 0 e delta > 0', 'a < 0 e delta < 0'],
      correctAnswer: 0,
      description: 'Se a concavidade é para cima, o coeficiente "a" deve ser positivo (a > 0). Se não intercepta o eixo x, a equação não possui raízes reais, o que significa que o discriminante (delta) deve ser negativo (delta < 0).'
    },
    {
      category: 'MATEMATICA',
      grade: 12,
      text: 'Em uma progressão aritmética (PA), o primeiro termo é 4 e a razão é 7. Qual é o valor do 10º termo dessa sequência?',
      options: ['63', '67', '71', '74'],
      correctAnswer: 1,
      description: 'A fórmula do termo geral da PA é an = a1 + (n - 1) * r. Substituindo os valores: a10 = 4 + (10 - 1) * 7 = 4 + 9 * 7 = 4 + 63 = 67.'
    },
    {
      category: 'MATEMATICA',
      grade: 12,
      text: 'Qual é a probabilidade de se obter um número primo ao lançar um dado justo de 6 faces?',
      options: ['1/6', '1/3', '1/2', '2/3'],
      correctAnswer: 2,
      description: 'Os números primos em um dado de 6 faces são 2, 3 e 5. Portanto, são 3 casos favoráveis em um total de 6 faces. Probabilidade = 3/6 = 1/2.'
    },
    {
      category: 'MATEMATICA',
      grade: 12,
      text: 'O valor de log₂ (32) é igual a:',
      options: ['3', '4', '5', '6'],
      correctAnswer: 2,
      description: 'O logaritmo de 32 na base 2 é o expoente ao qual devemos elevar 2 para obter 32. Como 2⁵ = 32, o resultado é 5.'
    },
    {
      category: 'MATEMATICA',
      grade: 12,
      text: 'Se a base de um triângulo aumenta 10% e sua altura diminui 10%, a área do triângulo:',
      options: ['Permanece a mesma', 'Aumenta 1%', 'Diminui 1%', 'Diminui 5%'],
      correctAnswer: 2,
      description: 'A área original é (B * H) / 2. A nova área é (1.1B * 0.9H) / 2 = 0.99 * (B * H) / 2. Isso representa uma redução de 1% (100% - 99%).'
    },
    {
      category: 'MATEMATICA',
      grade: 12,
      text: 'Quantos anagramas possui a palavra "SIMA"?',
      options: ['4', '12', '24', '48'],
      correctAnswer: 2,
      description: 'A palavra SIMA possui 4 letras distintas. O número de anagramas é a permutação de 4 (4!): 4 * 3 * 2 * 1 = 24.'
    },
    {
      category: 'MATEMATICA',
      grade: 12,
      text: 'Em um sistema de coordenadas, o ponto (3, -4) pertence a qual quadrante?',
      options: ['1º Quadrante', '2º Quadrante', '3º Quadrante', '4º Quadrante'],
      correctAnswer: 3,
      description: 'No 4º quadrante, os valores de x são positivos e os valores de y são negativos.'
    },
    {
      category: 'MATEMATICA',
      grade: 12,
      text: 'Qual o valor do determinante da matriz [[2, 3], [1, 5]]?',
      options: ['7', '10', '13', '17'],
      correctAnswer: 0,
      description: 'O determinante de uma matriz 2x2 [[a, b], [c, d]] é (ad - bc). Então: (2*5 - 3*1) = 10 - 3 = 7.'
    },
    {
      category: 'MATEMATICA',
      grade: 12,
      text: 'Um capital de R$ 1.000,00 aplicado a juros simples de 2% ao mês, após 5 meses, resultará em um montante de:',
      options: ['R$ 1.100,00', 'R$ 1.050,00', 'R$ 1.200,00', 'R$ 1.120,00'],
      correctAnswer: 0,
      description: 'Juros = C * i * t = 1000 * 0.02 * 5 = 100. Montante = Capital + Juros = 1000 + 100 = 1100.'
    },
    {
      category: 'MATEMATICA',
      grade: 12,
      text: 'Se todos os A são B e algum C é A, então podemos concluir que:',
      options: ['Todo C é B', 'Algum C é B', 'Nenhum C é B', 'Algum B não é A'],
      correctAnswer: 1,
      description: 'Se algum C é A, e todo A é B, então esse "C que é A" obrigatoriamente também é B. Logo, algum C é B.'
    },

    // PORTUGUES (10)
    {
      category: 'PORTUGUES',
      grade: 12,
      text: 'No trecho "A vida é um incêndio: a gente se queima, mas se diverte", a figura de linguagem predominante é:',
      options: ['Metonímia', 'Metáfora', 'Hipérbole', 'Eufemismo'],
      correctAnswer: 1,
      description: 'A frase estabelece uma comparação implícita entre a vida e um incêndio, sem o uso de conectivos comparativos (como "como"), o que caracteriza uma metáfora.'
    },
    {
      category: 'PORTUGUES',
      grade: 12,
      text: 'Qual das alternativas abaixo apresenta erro de concordância nominal?',
      options: ['Elas mesmos fizeram o trabalho.', 'É proibida a entrada.', 'Seguem anexos os documentos.', 'A comida estava meio estragada.'],
      correctAnswer: 0,
      description: 'O correto seria "Elas mesmas fizeram o trabalho".'
    },
    {
      category: 'PORTUGUES',
      grade: 12,
      text: 'O uso da crase está CORRETO em:',
      options: ['Fui à escola ontem.', 'Entreguei o presente à ele.', 'Andamos à cavalo na fazenda.', 'Referiu-se à uma situação estranha.'],
      correctAnswer: 0,
      description: 'Usa-se crase antes de substantivos femininos que pedem a preposição "a" e o artigo "a". Não se usa crase antes de pronomes masculinos (ele), verbos ou artigos indefinidos (uma).'
    },
    {
      category: 'PORTUGUES',
      grade: 12,
      text: 'Qual o sujeito da frase: "Vive-se bem nesta cidade"?',
      options: ['Oculto', 'Simples', 'Indeterminado', 'Inexistente'],
      correctAnswer: 2,
      description: 'O verbo na 3ª pessoa do singular acompanhado da partícula "se" (índice de indeterminação do sujeito), sem um substantivo que funcione como sujeito, caracteriza o sujeito indeterminado.'
    },
    {
      category: 'PORTUGUES',
      grade: 12,
      text: 'Assinale a alternativa em que a palavra é acentuada pela mesma regra de "história":',
      options: ['café', 'saúde', 'relógio', 'lâmpada'],
      correctAnswer: 2,
      description: '"História" e "Relógio" são paroxítonas terminadas em ditongo crescente.'
    },
    {
      category: 'PORTUGUES',
      grade: 12,
      text: 'No Modernismo brasileiro, a "Semana de Arte Moderna" ocorreu em qual ano e cidade?',
      options: ['1922, Rio de Janeiro', '1930, São Paulo', '1922, São Paulo', '1945, Belo Horizonte'],
      correctAnswer: 2,
      description: 'A Semana de Arte Moderna ocorreu em fevereiro de 1922 no Teatro Municipal de São Paulo, sendo o marco inicial do Modernismo no Brasil.'
    },
    {
      category: 'PORTUGUES',
      grade: 12,
      text: 'Qual o significado da palavra "efêmero"?',
      options: ['Duradouro', 'Passageiro', 'Inútil', 'Essencial'],
      correctAnswer: 1,
      description: 'Efêmero é algo que dura pouco tempo, transitório ou passageiro.'
    },
    {
      category: 'PORTUGUES',
      grade: 12,
      text: 'Quem é o autor da obra "Dom Casmurro"?',
      options: ['Machado de Assis', 'José de Alencar', 'Clarice Lispector', 'Guimarães Rosa'],
      correctAnswer: 0,
      description: 'Machado de Assis é o autor de "Dom Casmurro", um dos maiores clássicos do Realismo brasileiro.'
    },
    {
      category: 'PORTUGUES',
      grade: 12,
      text: 'A função da linguagem focada no canal de comunicação é chamada de:',
      options: ['Fática', 'Metalinguística', 'Referencial', 'Poética'],
      correctAnswer: 0,
      description: 'A função fática tem como objetivo estabelecer, prolongar ou interromper a comunicação, verificando se o canal está funcionando (ex: "Alô?", "Entendeu?").'
    },
    {
      category: 'PORTUGUES',
      grade: 12,
      text: 'Qual o tempo verbal de "Se eu estudasse, passaria"?',
      options: ['Pretérito Imperfeito do Subjuntivo', 'Futuro do Presente', 'Pretérito Perfeito', 'Presente do Indicativo'],
      correctAnswer: 0,
      description: '"Estudasse" está no Pretérito Imperfeito do Subjuntivo, indicando uma condição hipotética.'
    },

    // CIENCIAS BIOLOGICAS (10)
    {
      category: 'CIENCIAS BIOLOGICAS',
      grade: 12,
      text: 'Na genética, um indivíduo que possui dois alelos iguais para uma mesma característica é chamado de:',
      options: ['Heterozigoto', 'Hemizigoto', 'Homozigoto', 'Híbrido'],
      correctAnswer: 2,
      description: 'Indivíduos homozigotos possuem pares de alelos idênticos (ex: AA ou aa) para um determinado gene.'
    },
    {
      category: 'CIENCIAS BIOLOGICAS',
      grade: 12,
      text: 'Qual organela celular é responsável pela respiração celular e produção de ATP?',
      options: ['Ribossomo', 'Lisossomo', 'Mitocôndria', 'Complexo de Golgi'],
      correctAnswer: 2,
      description: 'As mitocôndrias são as "usinas de energia" da célula, onde ocorre a respiração celular aeróbica.'
    },
    {
      category: 'CIENCIAS BIOLOGICAS',
      grade: 12,
      text: 'O processo de divisão celular que resulta em quatro células-filhas com metade do número de cromossomos da célula-mãe é a:',
      options: ['Mitose', 'Meiose', 'Fissão Binária', 'Brotamento'],
      correctAnswer: 1,
      description: 'A meiose é uma divisão reducional essencial para a formação de gametas, garantindo a constância do número de cromossomos da espécie após a fecundação.'
    },
    {
      category: 'CIENCIAS BIOLOGICAS',
      grade: 12,
      text: 'No sistema circulatório humano, o sangue rico em oxigênio (arterial) entra no coração pelo:',
      options: ['Átrio Direito', 'Ventrículo Direito', 'Átrio Esquerdo', 'Ventrículo Esquerdo'],
      correctAnswer: 2,
      description: 'O sangue oxigenado vem dos pulmões pelas veias pulmonares e entra no átrio esquerdo do coração.'
    },
    {
      category: 'CIENCIAS BIOLOGICAS',
      grade: 12,
      text: 'A Teoria da Evolução proposta por Charles Darwin baseia-se principalmente no mecanismo de:',
      options: ['Uso e Desuso', 'Seleção Natural', 'Transmissão de caracteres adquiridos', 'Mutação induzida'],
      correctAnswer: 1,
      description: 'A seleção natural propõe que os indivíduos mais aptos ao ambiente têm maior probabilidade de sobreviver e se reproduzir, passando suas características adiante.'
    },
    {
      category: 'CIENCIAS BIOLOGICAS',
      grade: 12,
      text: 'Qual o principal gás responsável pelo efeito estufa gerado por atividades humanas?',
      options: ['Oxigênio', 'Nitrogênio', 'Dióxido de Carbono (CO₂)', 'Hélio'],
      correctAnswer: 2,
      description: 'O CO₂ é o principal gás emitido pela queima de combustíveis fósseis e desmatamento, intensificando o efeito estufa.'
    },
    {
      category: 'CIENCIAS BIOLOGICAS',
      grade: 12,
      text: 'Os fungos são organismos:',
      options: ['Autótrofos', 'Heterótrofos por absorção', 'Procariontes', 'Fotossintetizantes'],
      correctAnswer: 1,
      description: 'Fungos não produzem seu próprio alimento (heterótrofos) e obtêm nutrientes absorvendo moléculas orgânicas do ambiente.'
    },
    {
      category: 'CIENCIAS BIOLOGICAS',
      grade: 12,
      text: 'Qual a função dos glóbulos brancos (leucócitos) no sangue?',
      options: ['Transporte de oxigênio', 'Coagulação sanguínea', 'Defesa do organismo', 'Transporte de nutrientes'],
      correctAnswer: 2,
      description: 'Os leucócitos são células do sistema imunológico responsáveis por combater agentes invasores como bactérias e vírus.'
    },
    {
      category: 'CIENCIAS BIOLOGICAS',
      grade: 12,
      text: 'Na cadeia alimentar, os organismos que transformam matéria orgânica morta em sais minerais são os:',
      options: ['Produtores', 'Consumidores Primários', 'Decompositores', 'Consumidores Terciários'],
      correctAnswer: 2,
      description: 'Decompositores (fungos e bactérias) fecham o ciclo da matéria, devolvendo nutrientes ao solo.'
    },
    {
      category: 'CIENCIAS BIOLOGICAS',
      grade: 12,
      text: 'O DNA é composto por bases nitrogenadas. Qual base se emparelha sempre com a Citosina?',
      options: ['Adenina', 'Timina', 'Guanina', 'Uracila'],
      correctAnswer: 2,
      description: 'No DNA, a Citosina (C) sempre se liga à Guanina (G), e a Adenina (A) à Timina (T).'
    },

    // HISTORIA (10)
    {
      category: 'HISTORIA',
      grade: 12,
      text: 'O período da história brasileira conhecido como "Estado Novo" (1937-1945) foi liderado por:',
      options: ['Juscelino Kubitschek', 'Getúlio Vargas', 'Marechal Deodoro', 'Dom Pedro II'],
      correctAnswer: 1,
      description: 'O Estado Novo foi a fase ditatorial da Era Vargas, iniciada com o golpe de 1937.'
    },
    {
      category: 'HISTORIA',
      grade: 12,
      text: 'Qual foi o principal conflito mundial entre 1914 e 1918?',
      options: ['Segunda Guerra Mundial', 'Guerra Fria', 'Primeira Guerra Mundial', 'Guerra do Vietnã'],
      correctAnswer: 2,
      description: 'A Primeira Guerra Mundial ocorreu nesse período, envolvendo as principais potências mundiais da época.'
    },
    {
      category: 'HISTORIA',
      grade: 12,
      text: 'A Revolução Industrial teve seu início em qual país?',
      options: ['França', 'Estados Unidos', 'Alemanha', 'Inglaterra'],
      correctAnswer: 3,
      description: 'A Inglaterra foi pioneira na Revolução Industrial no século XVIII, devido ao seu acúmulo de capital e recursos naturais como carvão e ferro.'
    },
    {
      category: 'HISTORIA',
      grade: 12,
      text: 'O regime político-econômico da Idade Média na Europa Ocidental é chamado de:',
      options: ['Capitalismo', 'Feudalismo', 'Absolutismo', 'Socialismo'],
      correctAnswer: 1,
      description: 'O feudalismo baseava-se em relações de suserania e vassalagem e na economia agrária dos feudos.'
    },
    {
      category: 'HISTORIA',
      grade: 12,
      text: 'Quem foi o principal líder do movimento pelos direitos civis dos negros nos EUA nos anos 60?',
      options: ['Malcolm X', 'Martin Luther King Jr.', 'Barack Obama', 'Nelson Mandela'],
      correctAnswer: 1,
      description: 'Martin Luther King Jr. foi o líder pacifista que lutou contra a segregação racial nos Estados Unidos.'
    },
    {
      category: 'HISTORIA',
      grade: 12,
      text: 'A queda do Muro de Berlim, em 1989, simbolizou o fim de qual período histórico?',
      options: ['Segunda Guerra Mundial', 'Iluminismo', 'Guerra Fria', 'Império Romano'],
      correctAnswer: 2,
      description: 'A queda do muro representou o colapso do bloco socialista e o início do fim da Guerra Fria.'
    },
    {
      category: 'HISTORIA',
      grade: 12,
      text: 'Qual o principal objetivo da Revolução Francesa (1789)?',
      options: ['Restaurar a Monarquia', 'Fim do Absolutismo e busca por Igualdade', 'Expandir o território francês', 'Apoiar a Igreja Católica'],
      correctAnswer: 1,
      description: 'Inspirada por ideais iluministas, a revolução buscou o fim dos privilégios da nobreza e do poder absoluto do Rei.'
    },
    {
      category: 'HISTORIA',
      grade: 12,
      text: 'O sistema de trabalho compulsório utilizado pelos portugueses no início da colonização do Brasil foi:',
      options: ['Escravidão Indígena e Africana', 'Trabalho Assalariado', 'Servidão de Gleba', 'Parceria'],
      correctAnswer: 0,
      description: 'A colonização baseou-se na exploração de mão de obra escravizada, inicialmente indígena e depois predominantemente africana.'
    },
    {
      category: 'HISTORIA',
      grade: 12,
      text: 'A "Guerra do Paraguai" foi o maior conflito armado da América do Sul. Quais países formavam a Tríplice Aliança contra o Paraguai?',
      options: ['Brasil, Argentina e Chile', 'Brasil, Uruguai e Argentina', 'Argentina, Chile e Peru', 'Brasil, Bolívia e Uruguai'],
      correctAnswer: 1,
      description: 'A Tríplice Aliança era composta por Império do Brasil, Argentina e Uruguai.'
    },
    {
      category: 'HISTORIA',
      grade: 12,
      text: 'Quem proclamou a Independência do Brasil em 1822?',
      options: ['Dom Pedro II', 'Dom João VI', 'Dom Pedro I', 'Tiradentes'],
      correctAnswer: 2,
      description: 'Dom Pedro I proclamou a independência em 7 de setembro de 1822, tornando-se o primeiro Imperador do Brasil.'
    },
  ];

  console.log(`Inserindo ${questions.length} questões com categorias corrigidas...`);
  for (const q of questions) {
    await prisma.question.create({ data: q });
  }

  console.log('✅ Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
