import type {
  CheckboxQuestionDto,
  DragAndDropQuestionDto,
  OpenQuestionDto,
} from '@stardust/core/lesson/dtos'

type Questions = [
  CheckboxQuestionDto,
  DragAndDropQuestionDto,
  DragAndDropQuestionDto,
  CheckboxQuestionDto,
  OpenQuestionDto,
]

export const question: Questions = [
  {
    type: 'checkbox',
    stem: 'Por algum motivo, aparentemente há um robô passando perto de nós, mas não tenho certeza. Quais os possíveis valores que o parâmetro *robo* poderia ter para que fosse escrito "Isso é um robô"?',
    code: `funcao verificarRobo(robo) {
    retorna robo.inclui("Robô")
}

se (verificarRobo(robo)) {
    escreva("Isso é um robô")
}`,
    options: ['AstroRobô', 'RobôCop', 'Blitz', 'Wall-E'],
    correctOptions: ['AstroRobô', 'RobôCop'],
    picture: 'panda.jpg',
  },
  {
    type: 'drag-and-drop',
    stem: 'Vamos verificar antes se esse planeta (que se chama "Haskell") é habitável. Complete a função abaixo para que ela retorne "Habitável"',
    lines: [
      {
        number: 1,
        texts: ['funcao verifiquePlaneta(', 'dropZone', ') {'],
        indentation: 0,
      },
      {
        number: 2,
        texts: ['var planetaHabitaveis = ["Scala", "Haskell"]'],
        indentation: 2,
      },
      {
        number: 3,
        texts: ['se (planetaHabitaveis.inclui(planeta)) {'],
        indentation: 2,
      },
      {
        number: 4,
        texts: ['dropZone', '"Habitável"'],
        indentation: 4,
      },
      {
        number: 5,
        texts: ['}'],
        indentation: 2,
      },
      {
        number: 6,
        texts: ['retorna', ' dropZone'],
        indentation: 2,
      },
      {
        number: 7,
        texts: ['escreva(verifiquePlaneta(', 'dropZone', '))'],
        indentation: 0,
      },
    ],
    items: [
      {
        index: 1,
        label: 'retorna',
      },
      {
        index: 2,
        label: '"Elixir"',
      },
      {
        index: 3,
        label: 'planeta',
      },
      {
        index: 4,
        label: '"Haskell"',
      },
    ],
    correctItemsIndexesSequence: [3, 1, 4],
    picture: 'panda.jpg',
  },
  {
    type: 'drag-and-drop',
    stem: 'Complete a função anônima adequadamente para descobrir a população do planeta "Haskell"',
    lines: [
      {
        number: 1,
        texts: ['dropZone', 'obtenhaPopulacao', 'dropZone', 'funcao() {'],
        indentation: 0,
      },
      {
        number: 2,
        texts: ['dropZone', '12200'],
        indentation: 2,
      },
      {
        number: 3,
        texts: ['}'],
        indentation: 0,
      },
    ],
    items: [
      {
        index: 1,
        label: 'retorna',
      },
      {
        index: 2,
        label: 'funcao',
      },
      {
        index: 3,
        label: 'var',
      },
      {
        index: 4,
        label: '=',
      },
    ],
    correctItemsIndexesSequence: [3, 4, 1],
    picture: 'panda.jpg',
  },
  {
    type: 'checkbox',
    stem: 'Vamos utilizar funções anônimas para descobrir o nome da estrela desse planeta. Quais dessas funções SÃO anônimas?',
    code: `var obtenhaNomeDeEstrela = funcao() {
        retorna "Arrakis"
}
funcao concateneNomeDeEstrela (estrela) {
    estrelas += "Arrakis"
}
var adicioneNomeDeEstrela = funcao(estrelas) {
    retorna estrelas.adicionar(["Arrakis"])
}`,
    options: [
      'concateneNomeDeEstrela',
      'obtenhaNomeDeEstrela',
      'adicioneNomeDeEstrela',
      'calculeGravidade',
    ],
    correctOptions: ['adicioneNomeDeEstrela', 'obtenhaNomeDeEstrela'],
    picture: 'panda.jpg',
  },
  {
    type: 'open',
    stem: 'Estamos nos aproximando cada vez mais do novo planeta. A função abaixo retorna a distância entre nós e ele. Qual é ela na medida de distância chamada Jp?',
    lines: [
      {
        number: 1,
        indentation: 0,
        texts: ['funcao calculeDistancia(fogueteJp, planetaJp) {'],
      },
      {
        number: 2,
        indentation: 2,
        texts: ['input-1', 'planetaJp - fogueteJp'],
      },
      {
        number: 3,
        indentation: 0,
        texts: ['}'],
      },
      {
        number: 4,
        indentation: 0,
        texts: ['var subtracao =', 'input-2', '(12, 2)'],
      },
      {
        number: 5,
        indentation: 0,
        texts: ['escreva(subtracao *', 'input-3', ')'],
      },
    ],
    answers: ['retorna', 'calculeDistancia', '2'],
    picture: 'panda.jpg',
  },
]
