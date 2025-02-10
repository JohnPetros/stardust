import type {
  DragAndDropQuestionDto,
  SelectionQuestionDto,
  OpenQuestionDto,
} from '@stardust/core/lesson/dtos'

type Questions = [
  SelectionQuestionDto,
  SelectionQuestionDto,
  DragAndDropQuestionDto,
  OpenQuestionDto,
  DragAndDropQuestionDto,
]

export const questions: Questions = [
  {
    code: `var playlist = [
  "Nebula Collective", 
  "Stellar Beats",
  "Celestia Symphony", 
  "Pulse Ensemble"
]

playlist.ordenar()`,
    stem: 'Que tal ouvir música durante a exploração. Como ficaria a ordem da playlist usando o método *ordenar()*',
    type: 'selection',
    answer: 'Celestia Symphony, Nebula Collective, Pulse Ensemble, Stellar Beats',
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
    stem: 'Opa, encontramos um propulsor no meio do caminho. Porém, nós já temos ou não um propolsor de acordo com o código abaixo?',
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
    stem: 'Também achamos alguns droids no meio do caminho. Complete o código para que a lista *droids* seja igual a *R2-D2, C-3PO, BB-8, K-250*, nessa ordem.',
    type: 'drag-and-drop',
    lines: [
      {
        number: 1,
        texts: ['var droids = ['],
        indentation: 0,
      },
      {
        number: 2,
        texts: ['"R2-D2",'],
        indentation: 2,
      },
      {
        number: 3,
        texts: ['dropZone', ','],
        indentation: 2,
      },
      {
        number: 4,
        texts: [']'],
        indentation: 0,
      },
      {
        number: 5,
        texts: ['var droids = droids.', 'dropZone', '(', 'dropZone', ')'],
        indentation: 0,
      },
      {
        number: 6,
        texts: ['escreva(droids)'],
        indentation: 0,
      },
    ],
    items: [
      {
        index: 1,
        label: '["BB-8", "K-250"]',
      },
      {
        index: 2,
        label: 'inclui',
      },
      {
        index: 3,
        label: '"BB-8", "K-250"',
      },
      {
        index: 4,
        label: '"K-250"',
      },
      {
        index: 5,
        label: '"C-3PO"',
      },
      {
        index: 6,
        label: 'concatenar',
      },
    ],
    correctItems: [5, 6, 1],
    picture: 'panda-com-mochila.jpg',
  },
  {
    stem: 'Oops, parece que sem querer misturamos nossas pilhas com nossos alimentos. Quais métodos você utilizaria criar uma nova lista contendo somente alimentos?',
    type: 'open',
    lines: [
      {
        number: 1,
        texts: ["var itens = ['Pilha AA', 'Maçã',  'Frango', 'Cenoura']"],
        indentation: 0,
      },
      {
        number: 2,
        texts: ["var alimentos = ['Arroz', 'Brócolis',  'Banana']"],
        indentation: 0,
      },
      {
        number: 3,
        texts: ['itens.', 'input-1', '()'],
        indentation: 0,
      },
      {
        number: 4,
        texts: ['alimentos.', 'input-2', '(itens)'],
        indentation: 0,
      },
    ],
    answers: ['removerPrimeiro', 'concatenar'],
    picture: 'panda-com-mochila.jpg',
  },
  {
    stem: 'Vish, parece que encontramos um objeto tóxico. Complete o código para o resultado seja *falso*',
    type: 'drag-and-drop',
    lines: [
      {
        number: 1,
        texts: ['var itens = ['],
        indentation: 0,
      },
      {
        number: 2,
        texts: ['"Martelo"'],
        indentation: 2,
      },
      {
        number: 3,
        texts: ['dropZone', ','],
        indentation: 2,
      },
      {
        number: 4,
        texts: [']'],
        indentation: 0,
      },
      {
        number: 5,
        texts: ['escreva(itens.', 'dropZone', '("Objeto tóxico"))'],
        indentation: 0,
      },
    ],
    items: [
      {
        index: 1,
        label: '"Objeto tóxico"',
      },
      {
        index: 2,
        label: '"Silício"',
      },
      {
        index: 3,
        label: 'inclui',
      },
      {
        index: 4,
        label: 'ordenar',
      },
      {
        index: 5,
        label: 'concatenar',
      },
    ],
    correctItems: [2, 3],
    picture: 'panda-com-mochila.jpg',
  },
]
