import {
  CheckboxQuestion,
  DragAndDropQuestion,
  OpenQuestion,
} from "@/@types/Quiz";

type Questions = [
  CheckboxQuestion,
  DragAndDropQuestion,
  DragAndDropQuestion,
  CheckboxQuestion,
  OpenQuestion,
]

export const question: Questions = [

  {
    type: 'checkbox',
    title: 'Por algum motivo, aparentemente há um robô passando perto de nós, mas não tenho certeza. Quais os possíveis valores que o parâmetro *robo* poderia ter para que fosse escrito "Isso é um robô"?',
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
    title: 'Vamos verificar antes se esse planeta (que se chama "Haskell") é habitável. Complete a função abaixo para que ela retorne "Habitável"',
    lines: [
      {
        id: 1,
        texts: ['funcao verifiquePlaneta(', 'dropZone', ') {'],
        indentation: 0,
      },
      {
        id: 2,
        texts: ['var planetaHabitaveis = ["Scala", "Haskell"]'],
        indentation: 2,
      },
      {
        id: 3,
        texts: ['se (planetaHabitaveis.inclui(planeta)) {'],
        indentation: 2,
      },
      {
        id: 4,
        texts: ['dropZone', '"Habitável"'],
        indentation: 4,
      },
      {
        id: 5,
        texts: ['}'],
        indentation: 2,
      },
      {
        id: 6,
        texts: ['retorna', ' dropZone'],
        indentation: 2,
      },
      {
        id: 7,
        texts: ['escreva(verifiquePlaneta(', 'dropZone', '))'],
        indentation: 0,
      },
    ],
    dragItems: [
      {
        id: 1,
        label: 'retorna',
      },
      {
        id: 2,
        label: '"Elixir"',
      },
      {
        id: 3,
        label: 'planeta',
      },
      {
        id: 4,
        label: '"Haskell"',
      },
    ],
    correctDragItemsIdsSequence: [3, 1, 4],
    picture: 'panda.jpg',
  },
  {
    type: 'drag-and-drop',
    title: 'Complete a função anônima adequadamente para descobrir a população do planeta "Haskell"',
    lines: [
      {
        id: 1,
        texts: ['dropZone', 'obtenhaPopulacao', 'dropZone', 'funcao() {'],
        indentation: 0,
      },
      {
        id: 2,
        texts: ['dropZone', '12200'],
        indentation: 2,
      },
      {
        id: 3,
        texts: ['}'],
        indentation: 0,
      },
    ],
    dragItems: [
      {
        id: 1,
        label: 'retorna',
      },
      {
        id: 2,
        label: 'funcao',
      },
      {
        id: 3,
        label: 'var',
      },
      {
        id: 4,
        label: '=',
      },
    ],
    correctDragItemsIdsSequence: [3, 4, 1],
    picture: 'panda.jpg',
  },
  {
    type: 'checkbox',
    title: 'Vamos utilizar funções anônimas para descobrir o nome da estrela desse planeta. Quais dessas funções SÃO anônimas?',
    code: `var obtenhaNomeDeEstrela = funcao() {
        retorna "Arrakis"
}
funcao concateneNomeDeEstrela (estrela) {
    estrelas += "Arrakis"
}
var adicioneNomeDeEstrela = funcao(estrelas) {
    retorna estrelas.adicionar(["Arrakis"])
}`,
    options: ['concateneNomeDeEstrela', 'obtenhaNomeDeEstrela', 'adicioneNomeDeEstrela', 'calculeGravidade'],
    correctOptions: ['adicioneNomeDeEstrela', 'obtenhaNomeDeEstrela'],
    picture: 'panda.jpg',
  },
  {
    type: "open",
    title: "Estamos nos aproximando cada vez mais do novo planeta. A função abaixo retorna a distância entre nós e ele. Qual é ela na medida de distância chamada Jp?",
    lines: [{
      id: 1,
      indentation: 0,
      texts: ["funcao calculeDistancia(fogueteJp, planetaJp) {"],
    },
    {
      id: 2,
      indentation: 2,
      texts: ["input-1", "planetaJp - fogueteJp"],
    },
    {
      id: 3,
      indentation: 0,
      texts: ["}"],
    },
    {
      id: 4,
      indentation: 0,
      texts: ["var subtracao =", "input-2", "(12, 2)"],
    },
    {
      id: 5,
      indentation: 0,
      texts: ["escreva(subtracao *", "input-3", ")"],
    },
    ],
    answers: ["retorna", "calculeDistancia", "2"],
    picture: 'panda.jpg',
  },
]
