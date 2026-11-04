// Conteúdo do jogo. Corrija textos e números aqui; a lógica fica em App.jsx.

export const TITULO = 'Missão Solar'
export const SUBTITULO = 'PEA3100 · Relatório 4 · Grupo 07'
export const DESCRICAO =
  'Responda ao quiz e monte o sistema fotovoltaico de um apartamento em Resende (RJ): quem fizer mais pontos, mais rápido, vence!'

// Parte 1: quiz. Marque a alternativa certa com `certa: true`.
export const QUIZ = [
  {
    tema: 'Contexto e residência',
    pergunta:
      'O apartamento em Resende consumiu 2.451 kWh em 12 contas. Qual é o consumo médio mensal?',
    opcoes: [
      { texto: '204,25 kWh/mês', certa: true },
      { texto: '188,54 kWh/mês' },
      { texto: '245,10 kWh/mês' },
      { texto: '163,40 kWh/mês' },
    ],
    explicacao:
      '2.451 ÷ 12 = 204,25 kWh/mês. Novembro, mês da mudança dos moradores, teve só 38 kWh.',
  },
  {
    tema: 'Instalação e custos',
    pergunta: 'Qual foi o investimento total do sistema fotovoltaico?',
    opcoes: [
      { texto: 'R$ 7.184,00', certa: true },
      { texto: 'R$ 4.184,00' },
      { texto: 'R$ 4.353,94' },
      { texto: 'R$ 9.718,00' },
    ],
    explicacao:
      'Módulos + inversor + instalação (R$ 3.000,00) somam R$ 7.184,00. R$ 4.353,94 é o custo por kWp.',
  },
  {
    tema: 'Fatores calculados',
    pergunta: 'Qual taxa de desempenho (TD) foi adotada no dimensionamento?',
    opcoes: [
      { texto: '80 %', certa: true },
      { texto: '85 %' },
      { texto: '70 %' },
      { texto: '92,9 %' },
    ],
    explicacao:
      'A TD teórica deu 0,850, mas foi adotada de forma conservadora em 80 %, dentro da faixa de 70 a 80 % do roteiro. A maior perda é a de temperatura das células (7,1 %).',
  },
  {
    tema: 'Compensação de energia',
    pergunta:
      'Com o sistema, em quantos meses do ano paga-se apenas a disponibilidade de 50 kWh?',
    opcoes: [
      { texto: '10 meses', certa: true },
      { texto: '12 meses' },
      { texto: '11 meses' },
      { texto: '8 meses' },
    ],
    explicacao:
      'As exceções são janeiro e março. A sobra vira crédito no mês seguinte, e a economia na conta chega a R$ 1.831,79/ano (70,5 %).',
  },
  {
    tema: 'Retorno e conclusão',
    pergunta: 'Qual é o payback simples (PBS) do sistema?',
    opcoes: [
      { texto: '4,08 anos', certa: true },
      { texto: '3,92 anos' },
      { texto: '6,50 anos' },
      { texto: '20 anos' },
    ],
    explicacao:
      'PBS = R$ 7.184,00 ÷ R$ 1.759,95 = 4,08 anos, contra 20 anos de vida útil. O valor de R$ 1.759,95 já desconta o O&M.',
  },
]

const FICTICIO = 'Modelo fictício criado para o jogo.'

// Parte 2: minigame. Cada etapa tem exatamente um card com `certa: true`.
export const MINIGAME = [
  {
    titulo: 'Escolha o módulo',
    objetivo: 'Escolha o módulo fotovoltaico do sistema.',
    criterios: [
      'Potência total de pelo menos 1.350 Wp',
      'Certificação Inmetro',
      'Menor custo total entre os que atendem',
    ],
    cards: [
      {
        nome: 'Canadian Solar CS6W-550MS',
        certa: true,
        specs: [
          ['Potência', '550 Wp'],
          ['Preço unitário', 'R$ 550,00'],
          ['Módulos necessários', '3 (1.650 Wp)'],
          ['Custo total', 'R$ 1.650,00'],
          ['Área total', '7,75 m²'],
          ['Eficiência', '21,5 %'],
          ['Garantia', '25 anos, linear de potência'],
          ['Inmetro', 'Sim'],
        ],
        feedback:
          'Com 3 módulos chega a 1.650 Wp, tem Inmetro e o menor custo total entre os certificados: R$ 1.650,00 (1,00 R$/Wp).',
      },
      {
        nome: 'Sunova SS-610-66MDH',
        specs: [
          ['Potência', '610 Wp'],
          ['Preço unitário', 'R$ 800,00'],
          ['Módulos necessários', '3 (1.830 Wp)'],
          ['Custo total', 'R$ 2.400,00'],
          ['Área total', '8,11 m²'],
          ['Eficiência', '22,6 %'],
          ['Garantia', '30 anos'],
          ['Inmetro', 'Não informado'],
        ],
        feedback:
          'Também exige 3 módulos, mas custa R$ 750,00 a mais (R$ 2.400,00). A eficiência e a garantia são maiores, mas a potência excedente não traz benefício proporcional ao custo.',
      },
      {
        nome: 'Solaris Lume 400',
        specs: [
          ['Potência', '400 Wp'],
          ['Preço unitário', 'R$ 380,00'],
          ['Módulos necessários', '4 (1.600 Wp)'],
          ['Custo total', 'R$ 1.520,00'],
          ['Área total', '7,80 m²'],
          ['Eficiência', '20,5 %'],
          ['Garantia', '12 anos'],
          ['Inmetro', 'Não'],
        ],
        feedback:
          'É o mais barato, mas não tem certificação Inmetro, que é obrigatória na missão. ' +
          FICTICIO,
      },
      {
        nome: 'Heliora HX-440',
        specs: [
          ['Potência', '440 Wp'],
          ['Preço unitário', 'R$ 470,00'],
          ['Módulos necessários', '4 (1.760 Wp)'],
          ['Custo total', 'R$ 1.880,00'],
          ['Área total', '8,40 m²'],
          ['Eficiência', '21,0 %'],
          ['Garantia', '25 anos'],
          ['Inmetro', 'Sim'],
        ],
        feedback:
          'O preço unitário é baixo, mas 3 módulos dariam só 1.320 Wp. Com 4, o custo total sobe para R$ 1.880,00. ' +
          FICTICIO,
      },
    ],
  },
  {
    titulo: 'Escolha o tipo de inversor',
    objetivo: 'Escolha como ligar os 3 módulos da etapa 1 ao inversor.',
    criterios: ['Tensão de entrada de pelo menos 48 V'],
    dado: 'Cada módulo tem Vmp de 41,7 V.',
    cards: [
      {
        nome: 'Inversor string',
        certa: true,
        specs: [
          ['Ligação', 'Vários módulos em série numa mesma entrada'],
          ['Tensão máx. de entrada', 'Centenas de volts'],
        ],
        feedback:
          'Aceita os 3 módulos em série: 3 × 41,7 V = 125,1 V, bem acima do mínimo de 48 V.',
      },
      {
        nome: 'Microinversor (Growatt NEO 2000M-X / GoodWe GW2000-MIS)',
        specs: [
          ['Ligação', 'Um módulo por entrada'],
          ['Tensão máx. de entrada', '60–65 V'],
        ],
        feedback:
          'Com limite de 60–65 V, cada módulo é ligado separadamente e fornece só 41,7 V, abaixo dos 48 V.',
      },
      {
        nome: 'Microinversor Brisa MX-75',
        specs: [
          ['Ligação', 'Módulos por entrada, até o limite de tensão'],
          ['Tensão máx. de entrada', '75 V'],
        ],
        feedback:
          'Dois módulos em série dariam 83,4 V, acima dos 75 V. Então cada módulo também fica sozinho, com 41,7 V, abaixo dos 48 V. ' +
          FICTICIO,
      },
    ],
  },
  {
    titulo: 'Escolha o modelo do inversor',
    objetivo: 'Escolha o modelo do inversor string.',
    criterios: [
      'Potência de pelo menos 1,98 kW (1,2 × 1,65 kWp)',
      'Corrente máx. de entrada acima de 13,2 A',
      'Faixa de MPPT que cubra de 108 V a 125,1 V',
      'Menor preço entre os que atendem',
    ],
    cards: [
      {
        nome: 'Intelbras EGT 2500 PRO',
        certa: true,
        specs: [
          ['Potência', '2,5 kW'],
          ['Preço', 'R$ 2.534,00'],
          ['Corrente máx. de entrada', '13,5 A'],
          ['Faixa de MPPT', '80–500 V (partida em 100 V)'],
        ],
        feedback:
          'Atende a todos os requisitos: 2,5 kW ≥ 1,98 kW, 13,5 A > 13,2 A e MPPT de 80–500 V cobre de 108 V a 125,1 V. Os modelos mais baratos falham em algum requisito.',
      },
      {
        nome: 'SAJ R5-2K-S1',
        specs: [
          ['Potência', '2 kW'],
          ['Preço', 'R$ 2.838,00'],
          ['Corrente máx. de entrada', '12,5 A'],
          ['Faixa de MPPT', 'Não informada'],
        ],
        feedback:
          'A corrente máxima de 12,5 A fica abaixo dos 13,2 A do módulo, e o preço é maior: R$ 2.838,00.',
      },
      {
        nome: 'Raiar RS-2000',
        specs: [
          ['Potência', '2,0 kW'],
          ['Preço', 'R$ 2.290,00'],
          ['Corrente máx. de entrada', '15 A'],
          ['Faixa de MPPT', '140–500 V'],
        ],
        feedback:
          'É mais barato, mas o MPPT começa em 140 V, acima dos 125,1 V do arranjo (e dos 108 V em dias quentes). ' +
          FICTICIO,
      },
      {
        nome: 'Sollar Mini 1.5',
        specs: [
          ['Potência', '1,5 kW'],
          ['Preço', 'R$ 1.980,00'],
          ['Corrente máx. de entrada', '14 A'],
          ['Faixa de MPPT', '70–450 V'],
        ],
        feedback:
          'É o mais barato, mas 1,5 kW fica abaixo do mínimo de 1,98 kW. ' + FICTICIO,
      },
    ],
  },
]

// Grupos que podem jogar (o 07 apresenta). Se mudar, atualize também firestore.rules.
export const GRUPOS = ['01', '02', '03', '04', '05', '06', '08']

// Sala do ranking no Firestore. Use 'teste' (ou 'teste2', 'teste3'...) para testar
// e troque para 'aula' antes de publicar a versão da aula.
export const SALA = 'teste'

// Depois deste tempo sem terminar, um grupo "jogando" aparece como "não terminou".
export const MINUTOS_ABANDONO = 20

export const TOTAL = QUIZ.length + MINIGAME.length
export const REGRA =
  'Maior nota vence; em caso de empate, vence quem acabou antes.'
