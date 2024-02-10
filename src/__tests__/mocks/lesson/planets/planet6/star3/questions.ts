import {
  DragAndDropQuestion,
  OpenQuestion,
  SelectionQuestion,
} from '@/@types/Quiz'

type Questions = [
  SelectionQuestion,
  SelectionQuestion,
  DragAndDropQuestion,
  OpenQuestion,
  DragAndDropQuestion,
]

export const questions: Questions = [
  {
    code: `var playlist = ["Nebula Collective", "Stellar Beats
    ", "Celestia Symphony", "Pulse Ensemble"]

playlist.ordenar()`,
    title:
      'Que tal ouvir música durante a exploração. Como ficaria a ordem da playlist usando o método `ordenar()`',
    type: 'selection',
    answer:
      'Celestia Symphony, Nebula Collective, Pulse Ensemble, Stellar Beats',
    options: [
      'Nebula Collective, Stellar Beats, Celestia Symphony, Pulse Ensemble',
      'Stellar Beats, Pulse Ensemble, Nebula Collective, Celestia Symphony',
      'Celestia Symphony, Nebula Collective, Pulse Ensemble, Stellar Beats',
      'Celestia Symphony, Pulse Ensemble, Stellar Beats, Nebula Collective',
    ],
    picture: 'panda-ouvindo-musica.jpg',
  },
  {
    code: `var tecnologias = [
  "propulsor", 
  "motor iônico", 
  "campo de força", 
]

tecnologias.removerPrimeiro()

se (tecnologias.inclui("propulsor")) {
  escreva("Sim, temos um propulsor")
} senao {
  escreva("Não, falta um propulsor")
}`,
    title:
      'Opa, encontramos um propulsor no meio do caminho. Mas, nós já temos ou não um propolsor de acordo com o código abaixo?',
    type: 'selection',
    answer: 'Não, falta um propulsor',
    options: [
      'Sim, temos um propulsor',
      'Não, temos um propulsor',
      'Sim, falta um propulsor',
      'Não, falta um propulsor',
    ],
    picture: 'panda-com-mochila.jpg',
  },
  {
    title:
      'Também achamos alguns droids no meio do caminho. Complete o código para que o vetor `droids` seja igual a `R2-D2, C-3PO, BB-8, K-250`',
    type: 'drag-and-drop',
    lines: [
      {
        id: 1,
        texts: ['var droids = ['],
        indentation: 0,
      },
      {
        id: 2,
        texts: ['"R2-D2",'],
        indentation: 2,
      },
      {
        id: 3,
        texts: ['dropZone', ','],
        indentation: 2,
      },
      {
        id: 4,
        texts: [']'],
        indentation: 0,
      },
      {
        id: 5,
        texts: ['var droids = droids.', 'dropZone', '(', 'dropZone', ')'],
        indentation: 0,
      },
      {
        id: 6,
        texts: ['escreva(droids)'],
        indentation: 0,
      },
    ],
    dragItems: [
      {
        id: 1,
        label: '["BB-8", "K-250"]',
      },
      {
        id: 2,
        label: 'inclui',
      },
      {
        id: 3,
        label: '"BB-8", "K-250"',
      },
      {
        id: 4,
        label: '"K-250"',
      },
      {
        id: 5,
        label: '"C-3PO"',
      },
      {
        id: 6,
        label: 'concatenar',
      },
    ],
    correctDragItemsIdsSequence: [5, 6, 1],
    picture: 'panda-com-mochila.jpg',
  },
  {
    title:
      'Oops, parece que sem querer misturamos nossas pilhas com nossos alimentos. Como você faria para separá-los usando métodos de vetor?',
    type: 'open',
    lines: [
      {
        id: 1,
        texts: ["var itens = ['Pilha AA', 'Maçã',  'Frango', 'Cenoura']"],
        indentation: 0,
      },
      {
        id: 2,
        texts: ["var alimentos = ['Arroz', 'Brócolis',  'Banana']"],
        indentation: 0,
      },
      {
        id: 3,
        texts: ['itens', 'input-1', '()'],
        indentation: 0,
      },
      {
        id: 4,
        texts: ['alimentos', 'input-2', '(itens)'],
        indentation: 0,
      },
    ],
    answers: ['removerPrimeiro', 'concatenar'],
    picture: 'panda-com-mochila.jpg',
  },
  {
    title:
      'Vish, parece que encontramos um objeto tóxico. Complete o código para o resultado seja `falso`',
    type: 'drag-and-drop',
    lines: [
      {
        id: 1,
        texts: ['var planetas = ['],
        indentation: 0,
      },
      {
        id: 2,
        texts: ['"Martelo"'],
        indentation: 2,
      },
      {
        id: 3,
        texts: ['dropZone', ','],
        indentation: 2,
      },
      {
        id: 4,
        texts: [']'],
        indentation: 0,
      },
      {
        id: 5,
        texts: ['escreva(planetas.', 'dropZone', '("Objeto tóxico"))'],
        indentation: 0,
      },
    ],
    dragItems: [
      {
        id: 1,
        label: '"Objeto tóxico"',
      },
      {
        id: 2,
        label: '"Silício"',
      },
      {
        id: 3,
        label: 'inclui',
      },
      {
        id: 4,
        label: 'ordenar',
      },
      {
        id: 5,
        label: 'concatenar',
      },
    ],
    correctDragItemsIdsSequence: [2, 3],
    picture: 'panda-com-mochila.jpg',
  },
]
