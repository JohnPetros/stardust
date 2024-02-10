import {
  CheckboxQuestion,
  DragAndDropListQuestion,
  DragAndDropQuestion,
  OpenQuestion,
  SelectionQuestion,
} from '@/@types/Quiz'

type Questions = [
  SelectionQuestion,
  CheckboxQuestion,
  DragAndDropListQuestion,
  DragAndDropQuestion,
  OpenQuestion,
]

export const questions: Questions = [
  {
    title:
      'Vamos fazer algumas verificações utiliando vetores. Mas primeiro, treinaremos o conceito de índice. Qual serão os elementos do vetor numerosDaSorte se eu acresecentar o número 3 na posição 3?',
    type: 'selection',
    answer: '2, 7, 2, 3',
    code: `var numerosDaSorte = [2, 7, 2]

numerosDaSorte[3] = 3

escreva(numerosDaSorte)`,
    options: ['2, 7, 2, 3', '2, 7, 3', '2, 7, 3, 3', '3, 7, 2'],
    picture: 'panda.jpg',
  },
  {
    code: `var tiposDeNave = [
  'Cargueiro',
  'Caça',
  'Explorador',
  'Cruzador',
]`,
    title:
      'O tipo do nosso foguete é "Cruzador". Quais os possíveis números índice eu posso usar para pegar o elemento "Cruzador" no vetor `tiposDeNave`?',
    type: 'checkbox',
    options: ['3', '-1', '-3', '4'],
    correctOptions: ['3', '-1'],
    picture: 'panda-olhando-computador.jpg',
  },
  {
    title:
      'Vamos reorganizar nossa comida. Reordene os elementos do vetor `alimentos`, de modo que a constelação "batata" tenha índice 0, "maçã" tenha índice 1, "geleia" tenha índice 2 e "bife" índice 3.',
    type: 'drag-and-drop-list',
    items: [
      { id: 1, label: 'var constelacoes = [' },
      { id: 2, label: "   'batata'" },
      { id: 3, label: "   'maçã'" },
      { id: 4, label: "   'geleia'" },
      { id: 5, label: "   'bife'" },
      { id: 6, label: ']' },
    ],
    picture: 'panda-andando-com-bambu.jpg',
  },

  {
    title:
      'Agora vamos organizar nossos combustíveis. Complete os índices de vetor para que seja escrito nessa ordem "Plasmatron", "Etherium", "Fobos"',
    type: 'drag-and-drop',
    lines: [
      {
        id: 1,
        texts: [
          'var combustiveis = ["Etherium", "Plasmatron", "Mimas", "Fobos", "Dione"]',
        ],
        indentation: 0,
      },
      {
        id: 2,
        texts: ['escreva(combustiveis[ ', 'dropZone', ' ])'],
        indentation: 0,
      },
      {
        id: 3,
        texts: ['escreva(combustiveis[ ', 'dropZone', ' ])'],
        indentation: 0,
      },
      {
        id: 4,
        texts: ['escreva(combustiveis[ ', 'dropZone', ' ])'],
        indentation: 0,
      },
    ],
    dragItems: [
      { id: 1, label: '2' },
      { id: 2, label: '1' },
      { id: 3, label: '0' },
      { id: 4, label: '3' },
      { id: 5, label: '4' },
      { id: 6, label: '5' },
    ],
    correctDragItemsIdsSequence: [2, 3, 4],
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    title:
      'O próximo planeta que iremos explorar se chama "Arrayon". faça o programa escrever o nome desse planeta que está dentro do vetor `planetas`',
    type: 'open',
    lines: [
      {
        id: 1,
        texts: [
          "var planetas = ['Arrayon', 'Pyronova',  'Aquilux', 'Zeloria']",
        ],
        indentation: 0,
      },
      {
        id: 2,
        texts: ['var planeta = ', 'input-1'],
        indentation: 0,
      },
      {
        id: 3,
        texts: ['escreva(', 'input-2', ')'],
        indentation: 0,
      },
    ],
    answers: ['planetas[0]', 'planeta'],
    picture: 'panda-fazendo-coracao.jpg',
  },
]
