import type {
  DragAndDropQuestionDto,
  SelectionQuestionDto,
  OpenQuestionDto,
  CheckboxQuestionDto,
  DragAndDropListQuestionDto,
} from '@stardust/core/lesson/entities/dtos'

type Questions = [
  SelectionQuestionDto,
  CheckboxQuestionDto,
  DragAndDropListQuestionDto,
  DragAndDropQuestionDto,
  OpenQuestionDto,
]

export const questions: Questions = [
  {
    stem: 'Vamos fazer algumas verificações utiliando *listas*. Mas primeiro, treinaremos o conceito de índice. Qual serão os elementos da lista numerosDaSorte se eu acresecentar o número 3 na posição 3?',
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
  'Cruzador'
]`,
    stem: 'O tipo do nosso foguete é "Cruzador". Quais os possíveis números eu posso usar como índice para pegar o elemento "Cruzador" no vetor *tiposDeNave*?',
    type: 'checkbox',
    options: ['3', '-1', '-3', '4'],
    correctOptions: ['3', '-1'],
    picture: 'panda-olhando-computador.jpg',
  },
  {
    stem: 'Vamos reorganizar nossa comida. Reordene os elementos do vetor *alimentos*, de modo que a constelação "batata" tenha índice 0, "maçã" tenha índice 1, "geleia" tenha índice 2 e "bife" índice 3.',
    type: 'drag-and-drop-list',
    items: [
      { position: 1, label: 'var comidas = [' },
      { position: 2, label: "\t'batata'," },
      { position: 3, label: "\t'maçã'," },
      { position: 4, label: "\t'geleia'," },
      { position: 5, label: "\t'bife'" },
      { position: 6, label: ']' },
    ],
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    stem: 'Agora vamos organizar nossos combustíveis. Complete os índices para que seja escrito "Plasmatron", "Etherium", "Fobos", nessa ordem',
    type: 'drag-and-drop',
    lines: [
      {
        number: 1,
        texts: [
          'var combustiveis = ["Etherium", "Plasmatron", "Mimas", "Fobos", "Dione"]',
        ],
        indentation: 0,
      },
      {
        number: 2,
        texts: ['escreva(combustiveis[ ', 'dropZone', ' ])'],
        indentation: 0,
      },
      {
        number: 3,
        texts: ['escreva(combustiveis[ ', 'dropZone', ' ])'],
        indentation: 0,
      },
      {
        number: 4,
        texts: ['escreva(combustiveis[ ', 'dropZone', ' ])'],
        indentation: 0,
      },
    ],
    items: [
      { index: 1, label: '2' },
      { index: 2, label: '1' },
      { index: 3, label: '0' },
      { index: 4, label: '3' },
      { index: 5, label: '4' },
      { index: 6, label: '5' },
    ],
    correctItems: ['1', '0', '3'],
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    stem: 'O próximo planeta que iremos explorar se chama "Arrayon". faça o programa escrever o nome desse planeta que está dentro da lista *planetas*',
    type: 'open',
    lines: [
      {
        number: 1,
        texts: ["var planetas = ['Arrayon', 'Pyronova',  'Aquilux', 'Zeloria']"],
        indentation: 0,
      },
      {
        number: 2,
        texts: ['var planeta = ', 'input-1'],
        indentation: 0,
      },
      {
        number: 3,
        texts: ['escreva(', 'input-2', ')'],
        indentation: 0,
      },
    ],
    answers: ['planetas[0]', 'planeta'],
    picture: 'panda-fazendo-coracao.jpg',
  },
]
