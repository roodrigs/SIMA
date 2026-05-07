import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Limpando banco de dados para nova carga de questões (30 por matéria)...');
  await prisma.answer.deleteMany({});
  await prisma.assessment.deleteMany({});
  await prisma.question.deleteMany({});

  const questions = [
    // --- MATEMATICA (10 Originais + 20 Novas = 30) ---
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
    // MATEMATICA - NOVAS (20)
    {
      category: 'MATEMATICA',
      grade: 12,
      text: 'Qual o volume de uma esfera de raio 3 cm? (Considere pi = 3)',
      options: ['36 cm³', '108 cm³', '27 cm³', '81 cm³'],
      correctAnswer: 1,
      description: 'A fórmula do volume da esfera é V = (4/3) * pi * r³. Com r=3 e pi=3: V = (4/3) * 3 * 3³ = 4 * 27 = 108 cm³.'
    },
    {
      category: 'MATEMATICA',
      grade: 12,
      text: 'Em um triângulo retângulo, se os catetos medem 6 e 8, qual a medida da hipotenusa?',
      options: ['10', '12', '14', '16'],
      correctAnswer: 0,
      description: 'Pelo Teorema de Pitágoras: h² = 6² + 8² = 36 + 64 = 100. Logo, h = raiz(100) = 10.'
    },
    {
      category: 'MATEMATICA',
      grade: 12,
      text: 'Qual é o valor de cos(60°)?',
      options: ['1/2', 'raiz(3)/2', 'raiz(2)/2', '1'],
      correctAnswer: 0,
      description: 'De acordo com a tabela de razões trigonométricas dos ângulos notáveis, o cosseno de 60 graus é exatamente 0,5 ou 1/2.'
    },
    {
      category: 'MATEMATICA',
      grade: 12,
      text: 'A média aritmética de cinco números é 20. Se retirarmos o número 12, qual será a nova média?',
      options: ['18', '20', '22', '24'],
      correctAnswer: 2,
      description: 'A soma original é 5 * 20 = 100. Retirando 12, a nova soma é 88. Dividindo pelos 4 números restantes: 88 / 4 = 22.'
    },
    {
      category: 'MATEMATICA',
      grade: 12,
      text: 'Qual a distância entre os pontos A(1, 2) e B(4, 6) no plano cartesiano?',
      options: ['3', '4', '5', '7'],
      correctAnswer: 2,
      description: 'A fórmula da distância é d = raiz((x2-x1)² + (y2-y1)²). d = raiz((4-1)² + (6-2)²) = raiz(3² + 4²) = raiz(9 + 16) = raiz(25) = 5.'
    },
    {
      category: 'MATEMATICA',
      grade: 12,
      text: 'O que representa o coeficiente linear "b" em uma função do 1º grau f(x) = ax + b?',
      options: ['A inclinação da reta', 'O ponto onde a reta cruza o eixo y', 'A raiz da função', 'O ponto onde a reta cruza o eixo x'],
      correctAnswer: 1,
      description: 'O coeficiente linear "b" indica o valor de f(0), ou seja, a ordenada do ponto de interseção da reta com o eixo vertical (y).'
    },
    {
      category: 'MATEMATICA',
      grade: 12,
      text: 'Quantas comissões de 3 pessoas podem ser formadas a partir de um grupo de 5 pessoas?',
      options: ['10', '15', '20', '60'],
      correctAnswer: 0,
      description: 'Trata-se de uma combinação (a ordem não importa): C(5,3) = 5! / (3! * 2!) = (5 * 4 * 3!) / (3! * 2) = 20 / 2 = 10.'
    },
    {
      category: 'MATEMATICA',
      grade: 12,
      text: 'Qual o valor de x na equação 3^(x+1) = 27?',
      options: ['1', '2', '3', '4'],
      correctAnswer: 1,
      description: 'Como 27 = 3³, temos 3^(x+1) = 3³. Igualando os expoentes: x + 1 = 3, logo x = 2.'
    },
    {
      category: 'MATEMATICA',
      grade: 12,
      text: 'Uma aplicação de R$ 500,00 a juros compostos de 10% ao mês, após 2 meses, resulta em qual montante?',
      options: ['R$ 600,00', 'R$ 605,00', 'R$ 550,00', 'R$ 610,00'],
      correctAnswer: 1,
      description: 'M = C * (1 + i)^t. M = 500 * (1.1)² = 500 * 1.21 = 605. No primeiro mês vai para 550, e no segundo 10% sobre 550 é 55, totalizando 605.'
    },
    {
      category: 'MATEMATICA',
      grade: 12,
      text: 'Qual a área de um círculo com diâmetro de 10 cm? (Considere pi = 3,14)',
      options: ['31,4 cm²', '78,5 cm²', '314 cm²', '100 cm²'],
      correctAnswer: 1,
      description: 'Se o diâmetro é 10, o raio r é 5. A área é A = pi * r² = 3,14 * 5² = 3,14 * 25 = 78,5 cm².'
    },
    {
      category: 'MATEMATICA',
      grade: 12,
      text: 'Em uma PG, o primeiro termo é 2 e a razão é 3. Qual o quarto termo?',
      options: ['18', '24', '54', '162'],
      correctAnswer: 2,
      description: 'an = a1 * q^(n-1). a4 = 2 * 3^(4-1) = 2 * 3³ = 2 * 27 = 54.'
    },
    {
      category: 'MATEMATICA',
      grade: 12,
      text: 'Qual o valor de x que satisfaz a equação log(x) + log(2) = log(10)?',
      options: ['2', '5', '8', '12'],
      correctAnswer: 1,
      description: 'Usando a propriedade da soma de logaritmos: log(2x) = log(10). Portanto, 2x = 10, o que resulta em x = 5.'
    },
    {
      category: 'MATEMATICA',
      grade: 12,
      text: 'Qual a soma das raízes da equação x² - 5x + 6 = 0?',
      options: ['-5', '5', '6', '-6'],
      correctAnswer: 1,
      description: 'Pelas relações de Girard, a soma das raízes de ax² + bx + c = 0 é dada por -b/a. Aqui, -(-5)/1 = 5.'
    },
    {
      category: 'MATEMATICA',
      grade: 12,
      text: 'Um polígono regular tem ângulos internos de 120°. Quantos lados tem esse polígono?',
      options: ['4', '5', '6', '8'],
      correctAnswer: 2,
      description: 'O ângulo externo é 180° - 120° = 60°. A soma dos ângulos externos é sempre 360°. O número de lados n = 360 / 60 = 6 (Hexágono).'
    },
    {
      category: 'MATEMATICA',
      grade: 12,
      text: 'Qual o valor da expressão sen²(x) + cos²(x)?',
      options: ['0', '1', '2', 'Depende de x'],
      correctAnswer: 1,
      description: 'Esta é a Relação Fundamental da Trigonometria, que afirma que para qualquer ângulo x, a soma dos quadrados do seno e do cosseno é sempre igual a 1.'
    },
    {
      category: 'MATEMATICA',
      grade: 12,
      text: 'Se f(x) = 2x + 3, qual o valor da função inversa f⁻¹(7)?',
      options: ['2', '5', '17', '1/2'],
      correctAnswer: 0,
      description: 'Queremos encontrar x tal que f(x) = 7. Então 2x + 3 = 7 => 2x = 4 => x = 2. Portanto f⁻¹(7) = 2.'
    },
    {
      category: 'MATEMATICA',
      grade: 12,
      text: 'Em um lançamento de dois dados, qual a probabilidade da soma ser 7?',
      options: ['1/6', '1/12', '1/36', '5/36'],
      correctAnswer: 0,
      description: 'Os pares que somam 7 são: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1). São 6 casos favoráveis em 36 totais. 6/36 = 1/6.'
    },
    {
      category: 'MATEMATICA',
      grade: 12,
      text: 'Qual a derivada da função f(x) = x³?',
      options: ['x²', '2x', '3x²', '3x'],
      correctAnswer: 2,
      description: 'Pela regra do tombo (ou regra da potência), a derivada de x^n é n * x^(n-1). Para n=3, temos 3x².'
    },
    {
      category: 'MATEMATICA',
      grade: 12,
      text: 'Qual o valor de 2 + 2 * 2?',
      options: ['8', '4', '6', '2'],
      correctAnswer: 2,
      description: 'Pela ordem de precedência das operações matemáticas, a multiplicação deve ser realizada antes da adição: 2 + (2 * 2) = 2 + 4 = 6.'
    },
    {
      category: 'MATEMATICA',
      grade: 12,
      text: 'O que é um número irracional?',
      options: ['Número que pode ser escrito como fração', 'Número que não pode ser escrito como fração de inteiros', 'Número negativo', 'Número primo'],
      correctAnswer: 1,
      description: 'Números irracionais são aqueles que possuem representação decimal infinita e não periódica, como pi ou raiz(2), impossibilitando sua escrita como razão de dois inteiros.'
    },

    // --- PORTUGUES (10 Originais + 20 Novas = 30) ---
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
    // PORTUGUES - NOVAS (20)
    {
      category: 'PORTUGUES',
      grade: 12,
      text: 'Assinale a alternativa que apresenta uma figura de linguagem chamada Hipérbole:',
      options: ['O sol beijava o mar.', 'Morri de rir com aquela história.', 'Ele é um doce de pessoa.', 'O carro voava pelas ruas.'],
      correctAnswer: 1,
      description: 'Hipérbole é a figura de linguagem que consiste no exagero intencional para dar ênfase, como em "morri de rir".'
    },
    {
      category: 'PORTUGUES',
      grade: 12,
      text: 'Em qual das frases o "porquê" está escrito corretamente?',
      options: ['Não sei porque você se foi.', 'Você está rindo por que?', 'O porquê de tudo isso é o amor.', 'Eles viajaram porquê queriam.'],
      correctAnswer: 2,
      description: '"O porquê" (substantivado) é usado quando precedido de artigo, pronome ou numeral, significando "o motivo".'
    },
    {
      category: 'PORTUGUES',
      grade: 12,
      text: 'Qual o principal objetivo do movimento literário chamado Arcadismo?',
      options: ['Exaltar a vida urbana', 'Valorizar a vida bucólica e a natureza', 'Explorar o subconsciente', 'Criticar a burguesia'],
      correctAnswer: 1,
      description: 'O Arcadismo buscava a simplicidade, o equilíbrio e o retorno à natureza (fugere urbem), inspirando-se nos modelos clássicos e na vida pastoril.'
    },
    {
      category: 'PORTUGUES',
      grade: 12,
      text: 'A obra "Memórias Póstumas de Brás Cubas" marca o início de qual movimento no Brasil?',
      options: ['Romantismo', 'Realismo', 'Naturalismo', 'Modernismo'],
      correctAnswer: 1,
      description: 'Publicada em 1881 por Machado de Assis, esta obra inaugurou o Realismo brasileiro com sua análise psicológica e ironia mordaz.'
    },
    {
      category: 'PORTUGUES',
      grade: 12,
      text: 'Assinale a opção em que a regência verbal está INCORRETA:',
      options: ['Assisti ao filme ontem.', 'Chegamos no colégio cedo.', 'Esqueci o nome dele.', 'Visamos ao sucesso.'],
      correctAnswer: 1,
      description: 'O verbo "chegar" rege a preposição "a". O correto, segundo a norma culta, seria "Chegamos ao colégio".'
    },
    {
      category: 'PORTUGUES',
      grade: 12,
      text: 'O que caracteriza a função Metalinguística da linguagem?',
      options: ['O foco na emoção do emissor', 'O uso do código para explicar o próprio código', 'O foco no receptor', 'O foco no canal'],
      correctAnswer: 1,
      description: 'A metalinguagem ocorre quando a linguagem fala dela mesma, como um dicionário definindo palavras ou um poema sobre o ato de escrever.'
    },
    {
      category: 'PORTUGUES',
      grade: 12,
      text: 'No Romantismo, a "Geração Condoreira" tinha como principal temática:',
      options: ['O amor platônico', 'O nacionalismo ufanista', 'A luta social e abolicionista', 'A morte e o pessimismo'],
      correctAnswer: 2,
      description: 'A 3ª geração romântica, liderada por Castro Alves, focava em questões sociais, especialmente na defesa da abolição da escravidão.'
    },
    {
      category: 'PORTUGUES',
      grade: 12,
      text: 'Qual a classe gramatical da palavra destacada: "Ele agiu MUITO mal"?',
      options: ['Adjetivo', 'Pronome', 'Advérbio', 'Conjunção'],
      correctAnswer: 2,
      description: '"Muito" está modificando o advérbio "mal", intensificando seu sentido, logo funciona como um advérbio de intensidade.'
    },
    {
      category: 'PORTUGUES',
      grade: 12,
      text: 'Qual o significado de "Ambiguidade"?',
      options: ['Uso de palavras difíceis', 'Presença de mais de um sentido em uma frase', 'Erro de ortografia', 'Repetição de sons'],
      correctAnswer: 1,
      description: 'Ambiguidade é a propriedade de um termo ou enunciado apresentar múltiplos sentidos, muitas vezes causando confusão na interpretação.'
    },
    {
      category: 'PORTUGUES',
      grade: 12,
      text: 'Assinale a frase com o uso correto da pontuação:',
      options: ['Maria, comprou pão.', 'Eu gosto de doces, ela de salgados.', 'O aluno, estudou muito para a prova.', 'Ontem eu, fui ao cinema.'],
      correctAnswer: 1,
      description: 'Nesta frase, a vírgula indica a omissão do verbo "gostar" na segunda oração (zeugma), o que está correto. Nas outras, separa-se incorretamente o sujeito do verbo.'
    },
    {
      category: 'PORTUGUES',
      grade: 12,
      text: 'Quem escreveu "A Hora da Estrela"?',
      options: ['Rachel de Queiroz', 'Cecília Meireles', 'Clarice Lispector', 'Lygia Fagundes Telles'],
      correctAnswer: 2,
      description: 'Clarice Lispector é a autora desta obra, que narra a história da retirante nordestina Macabéa no Rio de Janeiro.'
    },
    {
      category: 'PORTUGUES',
      grade: 12,
      text: 'O que é um "Texto Dissertativo-Argumentativo"?',
      options: ['Um texto que conta uma história', 'Um texto que descreve uma cena', 'Um texto que defende um ponto de vista com argumentos', 'Um texto poético'],
      correctAnswer: 2,
      description: 'É o gênero exigido no ENEM, onde o autor deve expor um tema e defender uma tese através de argumentos lógicos e provas.'
    },
    {
      category: 'PORTUGUES',
      grade: 12,
      text: 'Qual destas palavras é um exemplo de Neologismo?',
      options: ['Casa', 'Deletar', 'Janela', 'Livro'],
      correctAnswer: 1,
      description: 'Neologismo é a criação de uma nova palavra ou atribuição de novo sentido a uma já existente. "Deletar" veio do inglês "delete" e foi incorporado ao português.'
    },
    {
      category: 'PORTUGUES',
      grade: 12,
      text: 'O prefixo "An-" em "Analfabeto" e "Anarquia" indica:',
      options: ['Repetição', 'Aproximação', 'Negação/Privação', 'Superioridade'],
      correctAnswer: 2,
      description: 'O prefixo grego "an-" (ou "a-") indica negação, ausência ou privação de algo.'
    },
    {
      category: 'PORTUGUES',
      grade: 12,
      text: 'Assinale a alternativa que contém apenas substantivos abstratos:',
      options: ['Amor, beleza, tristeza', 'Mesa, cadeira, lápis', 'Fada, duende, deus', 'Brasil, Pedro, Totó'],
      correctAnswer: 0,
      description: 'Substantivos abstratos designam ações, estados, qualidades ou sentimentos que dependem de um ser para existir.'
    },
    {
      category: 'PORTUGUES',
      grade: 12,
      text: 'Qual a principal característica do Naturalismo?',
      options: ['Idealização da mulher', 'Análise do homem como produto do meio e da hereditariedade', 'Busca pela perfeição formal', 'Foco no eu lírico'],
      correctAnswer: 1,
      description: 'O Naturalismo radicaliza o Realismo, usando um olhar "científico" para mostrar o lado mais animalesco e patológico do ser humano.'
    },
    {
      category: 'PORTUGUES',
      grade: 12,
      text: 'Na frase "Faz dois anos que não o vejo", o verbo fazer indica:',
      options: ['Ação do sujeito', 'Tempo decorrido', 'Clima', 'Desejo'],
      correctAnswer: 1,
      description: 'O verbo "fazer", quando indica tempo decorrido, é impessoal e deve permanecer sempre na 3ª pessoa do singular.'
    },
    {
      category: 'PORTUGUES',
      grade: 12,
      text: 'O que é Eufemismo?',
      options: ['Suavização de uma expressão desagradável', 'Exagero de uma ideia', 'Comparação direta', 'Repetição de palavras'],
      correctAnswer: 0,
      description: 'Eufemismo é usar termos mais leves para evitar palavras chocantes ou tristes, como "partiu desta para melhor" em vez de "morreu".'
    },
    {
      category: 'PORTUGUES',
      grade: 12,
      text: 'A conjunção "PORÉM" estabelece uma relação de:',
      options: ['Causa', 'Explicação', 'Adição', 'Oposição'],
      correctAnswer: 3,
      description: '"Porém" é uma conjunção adversativa, usada para introduzir uma ideia que contrasta com o que foi dito anteriormente.'
    },
    {
      category: 'PORTUGUES',
      grade: 12,
      text: 'Qual movimento literário valorizava a "Arte pela Arte" e o rigor formal?',
      options: ['Parnasianismo', 'Simbolismo', 'Modernismo', 'Romantismo'],
      correctAnswer: 0,
      description: 'Os parnasianos buscavam a perfeição técnica, rimas ricas e objetividade, opondo-se ao sentimentalismo romântico.'
    },

    // --- CIENCIAS BIOLOGICAS (10 Originais + 20 Novas = 30) ---
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
      text: 'O processo de division celular que resulta em quatro células-filhas com metade do número de cromossomos da célula-mãe é a:',
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
    // CIENCIAS BIOLOGICAS - NOVAS (20)
    {
      category: 'CIENCIAS BIOLOGICAS',
      grade: 12,
      text: 'Qual a principal diferença entre células procariontes e eucariontes?',
      options: ['Presença de parede celular', 'Presença de membrana plasmática', 'Presença de núcleo delimitado por carioteca', 'Presença de ribossomos'],
      correctAnswer: 2,
      description: 'Células eucariontes possuem o material genético isolado por uma membrana (carioteca), formando um núcleo, enquanto nas procariontes o DNA fica livre no citoplasma.'
    },
    {
      category: 'CIENCIAS BIOLOGICAS',
      grade: 12,
      text: 'O que define uma relação ecológica do tipo Mutualismo?',
      options: ['Um se beneficia e o outro é prejudicado', 'Ambos se beneficiam e a relação é obrigatória para sobrevivência', 'Ambos se beneficiam mas podem viver separados', 'Apenas um se beneficia sem afetar o outro'],
      correctAnswer: 1,
      description: 'No mutualismo, a interação traz benefícios para ambas as espécies envolvidas e é essencial para a manutenção de suas vidas (ex: líquens).'
    },
    {
      category: 'CIENCIAS BIOLOGICAS',
      grade: 12,
      text: 'As plantas briófitas (como os musgos) caracterizam-se por:',
      options: ['Possuir vasos condutores de seiva', 'Produzir sementes e frutos', 'Serem avasculares e dependerem da água para reprodução', 'Terem flores exuberantes'],
      correctAnswer: 2,
      description: 'As briófitas são plantas simples, de pequeno porte, que não possuem vasos condutores (xilema/floema) e cujos gametas precisam de água para se encontrar.'
    },
    {
      category: 'CIENCIAS BIOLOGICAS',
      grade: 12,
      text: 'Qual hormônio é responsável por reduzir os níveis de glicose no sangue?',
      options: ['Glucagon', 'Adrenalina', 'Insulina', 'Cortisol'],
      correctAnswer: 2,
      description: 'A insulina, produzida pelo pâncreas, facilita a entrada da glicose nas células, diminuindo sua concentração na corrente sanguínea.'
    },
    {
      category: 'CIENCIAS BIOLOGICAS',
      grade: 12,
      text: 'O que são órgãos análogos na evolução?',
      options: ['Órgãos com mesma origem embrionária', 'Órgãos com funções parecidas mas origens diferentes', 'Órgãos que não servem para nada', 'Órgãos idênticos em espécies iguais'],
      correctAnswer: 1,
      description: 'Órgãos análogos resultam da convergência evolutiva, onde espécies diferentes desenvolvem estruturas para a mesma função (ex: asas de aves e de insetos) sem parentesco direto.'
    },
    {
      category: 'CIENCIAS BIOLOGICAS',
      grade: 12,
      text: 'Qual o principal bioma brasileiro caracterizado por solo ácido e árvores de troncos tortuosos?',
      options: ['Amazônia', 'Cerrado', 'Caatinga', 'Pantanal'],
      correctAnswer: 1,
      description: 'O Cerrado possui solos com alta concentração de alumínio (ácidos) e vegetação adaptada com cascas grossas e raízes profundas.'
    },
    {
      category: 'CIENCIAS BIOLOGICAS',
      grade: 12,
      text: 'No processo de fotossíntese, em qual organela ocorre a conversão de energia luminosa em química?',
      options: ['Mitocôndria', 'Cloroplasto', 'Vacúolo', 'Núcleo'],
      correctAnswer: 1,
      description: 'Os cloroplastos contêm clorofila, pigmento capaz de captar a luz solar para realizar a síntese de matéria orgânica.'
    },
    {
      category: 'CIENCIAS BIOLOGICAS',
      grade: 12,
      text: 'Qual a função das plaquetas no sangue?',
      options: ['Combater infecções', 'Transportar oxigênio', 'Atuar na coagulação sanguínea', 'Limpar o plasma'],
      correctAnswer: 2,
      description: 'As plaquetas (trombócitos) são fragmentos celulares que se agrupam para estancar sangramentos e iniciar a cicatrização de feridas.'
    },
    {
      category: 'CIENCIAS BIOLOGICAS',
      grade: 12,
      text: 'Um vírus é considerado um parasita intracelular obrigatório porque:',
      options: ['É muito grande', 'Só sobrevive fora das células', 'Não possui metabolismo próprio fora de uma célula hospedeira', 'Tem DNA e RNA ao mesmo tempo'],
      correctAnswer: 2,
      description: 'Vírus não possuem maquinário celular (ribossomos, enzimas) para se reproduzir sozinhos, precisando "sequestrar" o sistema de uma célula viva.'
    },
    {
      category: 'CIENCIAS BIOLOGICAS',
      grade: 12,
      text: 'A tradução gênica, processo de síntese de proteínas, ocorre no:',
      options: ['Núcleo', 'Ribossomo', 'Lisossomo', 'Complexo de Golgi'],
      correctAnswer: 1,
      description: 'A tradução acontece quando o RNA mensageiro é lido pelos ribossomos no citoplasma, orientando a sequência de aminoácidos da proteína.'
    },
    {
      category: 'CIENCIAS BIOLOGICAS',
      grade: 12,
      text: 'Qual a principal excreta nitrogenada dos mamíferos?',
      options: ['Amônia', 'Ácido Úrico', 'Ureia', 'Gás Carbônico'],
      correctAnswer: 2,
      description: 'Mamíferos transformam a amônia (tóxica) em ureia no fígado, que é menos tóxica e solúvel em água, facilitando a excreção pelos rins.'
    },
    {
      category: 'CIENCIAS BIOLOGICAS',
      grade: 12,
      text: 'O que caracteriza a Sucessão Ecológica Primária?',
      options: ['Ocorre em locais onde já havia vida', 'Ocorre em áreas virgens, como rochas nuas ou lavas vulcânicas', 'É o fim de uma comunidade', 'Ocorre após um incêndio florestal'],
      correctAnswer: 1,
      description: 'A sucessão primária inicia-se em ambientes onde nunca houve vida anteriormente, começando com organismos pioneiros como líquens.'
    },
    {
      category: 'CIENCIAS BIOLOGICAS',
      grade: 12,
      text: 'Qual o papel dos decompositores no ciclo do nitrogênio?',
      options: ['Fixar nitrogênio do ar', 'Transformar matéria orgânica em amônia', 'Converter nitrato em gás nitrogênio', 'Absorver nitrogênio pelas raízes'],
      correctAnswer: 1,
      description: 'Bactérias e fungos decompositores degradam restos orgânicos, liberando nitrogênio na forma de amônia para o solo (amonificação).'
    },
    {
      category: 'CIENCIAS BIOLOGICAS',
      grade: 12,
      text: 'A técnica de PCR (Reação em Cadeia da Polimerase) serve para:',
      options: ['Cortar o DNA', 'Mapear proteínas', 'Amplificar (fazer cópias) de segmentos específicos de DNA', 'Unir dois DNAs diferentes'],
      correctAnswer: 2,
      description: 'A PCR permite produzir milhões de cópias de uma pequena amostra de DNA, sendo fundamental em testes de paternidade, perícias criminais e diagnóstico de doenças.'
    },
    {
      category: 'CIENCIAS BIOLOGICAS',
      grade: 12,
      text: 'O que são animais hermafroditas (monoicos)?',
      options: ['Animais que não se reproduzem', 'Animais que possuem apenas órgãos masculinos', 'Animais que possuem ambos os sistemas reprodutores (masculino e feminino)', 'Animais que mudam de sexo'],
      correctAnswer: 2,
      description: 'Organismos monoicos produzem tanto gametas masculinos quanto femininos no mesmo indivíduo (ex: minhocas).'
    },
    {
      category: 'CIENCIAS BIOLOGICAS',
      grade: 12,
      text: 'Qual vitamina é sintetizada na pele humana através da exposição solar?',
      options: ['Vitamina A', 'Vitamina C', 'Vitamina D', 'Vitamina K'],
      correctAnswer: 2,
      description: 'A radiação ultravioleta B (UVB) é necessária para converter o precursor do colesterol na pele em vitamina D ativa, essencial para os ossos.'
    },
    {
      category: 'CIENCIAS BIOLOGICAS',
      grade: 12,
      text: 'O sistema nervoso autônomo Simpático é responsável por:',
      options: ['Relaxamento e digestão', 'Ações de "luta ou fuga", como aumento dos batimentos cardíacos', 'Pensamento consciente', 'Coordenação motora fina'],
      correctAnswer: 1,
      description: 'O sistema simpático prepara o corpo para situações de estresse ou emergência, liberando adrenalina e acelerando o metabolismo.'
    },
    {
      category: 'CIENCIAS BIOLOGICAS',
      grade: 12,
      text: 'Qual a função da clorofila nas plantas?',
      options: ['Dar sustentação ao caule', 'Absorver luz para a fotossíntese', 'Transportar água', 'Atrair insetos'],
      correctAnswer: 1,
      description: 'A clorofila é o pigmento verde que capta a energia dos fótons da luz solar para iniciar a fase clara da fotossíntese.'
    },
    {
      category: 'CIENCIAS BIOLOGICAS',
      grade: 12,
      text: 'O que é a Biorremediação?',
      options: ['Uso de remédios naturais', 'Uso de microrganismos para limpar áreas contaminadas', 'Destruição de pragas com veneno', 'Reflorestamento com árvores exóticas'],
      correctAnswer: 1,
      description: 'A biorremediação utiliza o metabolismo de bactérias ou fungos para degradar poluentes (como óleo ou metais pesados) no solo ou na água.'
    },
    {
      category: 'CIENCIAS BIOLOGICAS',
      grade: 12,
      text: 'Qual a principal função do intestino grosso?',
      options: ['Digestão de proteínas', 'Absorção de água e formação das fezes', 'Produção de bile', 'Absorção da maior parte dos nutrientes'],
      correctAnswer: 1,
      description: 'Enquanto o intestino delgado absorve nutrientes, o grosso foca em reabsorver água e sais, compactando os resíduos não digeridos.'
    },

    // --- HISTORIA (10 Originais + 20 Novas = 30) ---
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
    // HISTORIA - NOVAS (20)
    {
      category: 'HISTORIA',
      grade: 12,
      text: 'O que foi o "Coronelismo" na República Velha brasileira?',
      options: ['Um movimento militar', 'O poder político exercido por grandes latifundiários locais', 'Uma escola de oficiais', 'Um sistema de impostos'],
      correctAnswer: 1,
      description: 'O coronelismo era baseado no controle de votos pelos grandes fazendeiros (coronéis) através do "voto de cabresto", sustentando a política dos governadores.'
    },
    {
      category: 'HISTORIA',
      grade: 12,
      text: 'Qual civilização antiga construiu as Pirâmides de Gizé?',
      options: ['Inca', 'Grega', 'Egípcia', 'Mesopotâmica'],
      correctAnswer: 2,
      description: 'As pirâmides foram construídas pelo Império Egípcio para servirem de tumbas monumentais para os faraós Quéops, Quéfren e Miquerinos.'
    },
    {
      category: 'HISTORIA',
      grade: 12,
      text: 'O Iluminismo, movimento intelectual do século XVIII, defendia principalmente:',
      options: ['O poder absoluto dos reis', 'A fé acima da razão', 'A razão, a liberdade e o progresso científico', 'A manutenção do sistema feudal'],
      correctAnswer: 2,
      description: 'O Iluminismo criticava o Antigo Regime e defendia que a razão humana era a ferramenta para combater a ignorância e a tirania.'
    },
    {
      category: 'HISTORIA',
      grade: 12,
      text: 'Quem foi o líder da Revolução Cubana em 1959?',
      options: ['Che Guevara', 'Fidel Castro', 'Hugo Chávez', 'Simón Bolívar'],
      correctAnswer: 1,
      description: 'Fidel Castro liderou o movimento guerrilheiro que derrubou a ditadura de Fulgencio Batista, instaurando um regime socialista em Cuba.'
    },
    {
      category: 'HISTORIA',
      grade: 12,
      text: 'Qual foi o principal motivo para a entrada dos Estados Unidos na Segunda Guerra Mundial?',
      options: ['O ataque a Pearl Harbor pelo Japão', 'A invasão da Polônia pela Alemanha', 'O bombardeio de Londres', 'A Revolução Russa'],
      correctAnswer: 0,
      description: 'Em 7 de dezembro de 1941, o Japão atacou a base naval dos EUA no Havaí, forçando o país a abandonar sua neutralidade no conflito.'
    },
    {
      category: 'HISTORIA',
      grade: 12,
      text: 'O período da história brasileira entre 1964 e 1985 é caracterizado por:',
      options: ['Democracia Plena', 'Ditadura Militar', 'Monarquia Parlamentarista', 'Anarquia'],
      correctAnswer: 1,
      description: 'Este período iniciou-se com o golpe que derrubou João Goulart e foi marcado pela censura, repressão política e centralização do poder nas mãos dos militares.'
    },
    {
      category: 'HISTORIA',
      grade: 12,
      text: 'A "Conferência de Berlim" (1884-1885) teve como objetivo:',
      options: ['Acabar com a escravidão na Europa', 'Organizar a partilha do continente africano entre as potências europeias', 'Declarar guerra à Rússia', 'Fundar a ONU'],
      correctAnswer: 1,
      description: 'Nesta reunião, os países europeus definiram as fronteiras e regras para a ocupação e exploração da África, ignorando as populações locais.'
    },
    {
      category: 'HISTORIA',
      grade: 12,
      text: 'Qual imperador romano oficializou o Cristianismo no Império através do Edito de Tessalônica?',
      options: ['Júlio César', 'Nero', 'Constantino', 'Teodósio'],
      correctAnswer: 3,
      description: 'Embora Constantino tenha dado liberdade de culto, foi Teodósio quem tornou o Cristianismo a religião oficial do Estado Romano em 380 d.C.'
    },
    {
      category: 'HISTORIA',
      grade: 12,
      text: 'O que foi o "Renascimento" cultural e artístico?',
      options: ['Uma volta aos valores da Idade Média', 'Um movimento de valorização da Antiguidade Clássica (Grécia e Roma)', 'A invenção do cinema', 'A descoberta da pólvora'],
      correctAnswer: 1,
      description: 'O Renascimento surgiu na Itália e colocava o homem no centro (antropocentrismo), buscando inspiração nas artes e filosofia greco-romanas.'
    },
    {
      category: 'HISTORIA',
      grade: 12,
      text: 'Quem era o presidente do Brasil durante a construção de Brasília?',
      options: ['Getúlio Vargas', 'Jânio Quadros', 'Juscelino Kubitschek', 'João Goulart'],
      correctAnswer: 2,
      description: 'JK cumpriu sua meta de "50 anos em 5", tendo a interiorização do país e a construção da nova capital como marcos de seu governo.'
    },
    {
      category: 'HISTORIA',
      grade: 12,
      text: 'A "Crise de 1929" começou com o colapso de qual instituição?',
      options: ['Banco da Inglaterra', 'Bolsa de Valores de Nova York', 'Fundo Monetário Internacional', 'Banco Central do Brasil'],
      correctAnswer: 1,
      description: 'A quebra da Bolsa de Nova York (Quinta-Feira Negra) gerou uma depressão econômica mundial sem precedentes.'
    },
    {
      category: 'HISTORIA',
      grade: 12,
      text: 'O Tratado de Tordesilhas dividia as terras descobertas entre quais países?',
      options: ['Espanha e França', 'Portugal e Inglaterra', 'Portugal e Espanha', 'França e Holanda'],
      correctAnswer: 2,
      description: 'Assinado em 1494, o tratado definiu uma linha imaginária que repartia o "Novo Mundo" entre as duas potências ibéricas.'
    },
    {
      category: 'HISTORIA',
      grade: 12,
      text: 'Qual filósofo é o autor de "O Manifesto Comunista"?',
      options: ['Adam Smith', 'Immanuel Kant', 'Karl Marx e Friedrich Engels', 'Jean-Jacques Rousseau'],
      correctAnswer: 2,
      description: 'Marx e Engels escreveram o manifesto em 1848, lançando as bases do socialismo científico e da luta de classes.'
    },
    {
      category: 'HISTORIA',
      grade: 12,
      text: 'O que foi o "Apartheid" na África do Sul?',
      options: ['Um festival de música', 'Um regime de segregação racial institucionalizada', 'Uma aliança militar', 'Um plano econômico'],
      correctAnswer: 1,
      description: 'O Apartheid foi um sistema legal que privilegiava a minoria branca e retirava direitos básicos da maioria negra, durando até os anos 90.'
    },
    {
      category: 'HISTORIA',
      grade: 12,
      text: 'A Guerra Fria foi uma disputa ideológica entre quais blocos?',
      options: ['Eixo e Aliados', 'Capitalista (EUA) e Socialista (URSS)', 'Cristãos e Muçulmanos', 'Norte e Sul'],
      correctAnswer: 1,
      description: 'Após a 2ª Guerra, o mundo tornou-se bipolar, com EUA e URSS competindo por influência sem entrar em conflito armado direto.'
    },
    {
      category: 'HISTORIA',
      grade: 12,
      text: 'Qual a principal característica do Absolutismo?',
      options: ['Poder dividido em três poderes', 'Poder total e centralizado nas mãos do Rei', 'Eleições periódicas', 'Participação direta do povo'],
      correctAnswer: 1,
      description: 'No Absolutismo, o monarca possuía poder ilimitado, muitas vezes justificado pelo "Direito Divino dos Reis".'
    },
    {
      category: 'HISTORIA',
      grade: 12,
      text: 'O que motivou as Cruzadas na Idade Média?',
      options: ['Interesse em descobrir novas terras', 'A retomada da Terra Santa (Jerusalém) das mãos dos muçulmanos', 'A fuga da Peste Negra', 'A busca por ouro na América'],
      correctAnswer: 1,
      description: 'As Cruzadas foram expedições militares de caráter religioso convocadas pela Igreja Católica para reconquistar lugares sagrados no Oriente.'
    },
    {
      category: 'HISTORIA',
      grade: 12,
      text: 'O que foi a "Inconfidência Mineira" em 1789?',
      options: ['Um festival de arte em Minas', 'Uma revolta separatista contra a cobrança excessiva de impostos por Portugal', 'Uma guerra entre mineradores', 'A fundação da cidade de Tiradentes'],
      correctAnswer: 1,
      description: 'Inspirada nos ideais iluministas, a revolta planejava a independência de Minas Gerais devido à "derrama" (cobrança de impostos atrasados).'
    },
    {
      category: 'HISTORIA',
      grade: 12,
      text: 'Quem foi a primeira mulher a ser eleita Presidente do Brasil?',
      options: ['Marina Silva', 'Dilma Rousseff', 'Simone Tebet', 'Zélia Cardoso de Mello'],
      correctAnswer: 1,
      description: 'Dilma Rousseff foi eleita em 2010 e reeleita em 2014, sendo a primeira mulher a ocupar o cargo máximo da República.'
    },
    {
      category: 'HISTORIA',
      grade: 12,
      text: 'O que foi o "Holocausto"?',
      options: ['Uma batalha naval', 'O genocídio de judeus e outros grupos pelo regime nazista', 'A descoberta da cura da pólio', 'Um acordo de paz'],
      correctAnswer: 1,
      description: 'O Holocausto foi a perseguição e o extermínio sistemático de cerca de 6 milhões de judeus, além de ciganos, homossexuais e dissidentes, pelos nazistas na 2ª Guerra.'
    },
  ];

  console.log(`Inserindo ${questions.length} questões (30 por categoria)...`);
  for (const q of questions) {
    await prisma.question.create({ data: q });
  }

  console.log('✅ Banco de dados populado com sucesso! Agora temos 30 questões por matéria com explicações reais.');
  }

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
