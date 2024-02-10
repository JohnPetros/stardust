import {
  CheckboxQuestion,
  DragAndDropQuestion,
  OpenQuestion,
  SelectionQuestion,
} from '@/@types/Quiz'

type Questions = [
  CheckboxQuestion,
  DragAndDropQuestion,
  OpenQuestion,
  DragAndDropQuestion,
  SelectionQuestion,
]

export const questions: Questions = [
  {
    code: `var bolo = [
  'Fatia 1', 
  'Fatia 2',
  'Fatia 3',
  'Fatia 4',
]
  
var fatias = elementos.fatiar(2)
escreva(fatias)`,
    title:
      'Vamos ver se você aprendeu os novos métodos que mostrei. Qual serão as fatias extraídas do vetor `bolo`?',
    type: 'checkbox',
    options: ['Fatia 1', 'Fatia 2', 'Fatia 3', 'Fatia 4'],
    correctOptions: ['Fatia 3', 'Fatia 4'],
    picture: 'panda-deslumbrado.jpg',
  },
  {
    title:
      'Complete o código a fim de que o vetor radioativos tenha 3 itens, ou seja, que o resultado final seja igual a 3.',
    type: 'drag-and-drop',
    lines: [
      { id: 1, texts: ['var elementos = ['], indentation: 0 },
      { id: 2, texts: ['"Hélio"'], indentation: 2 },
      { id: 3, texts: ['"Estrôncio"', ','], indentation: 2 },
      { id: 4, texts: ['"Rádio"', ','], indentation: 2 },
      { id: 5, texts: ['"Césio"', ','], indentation: 2 },
      { id: 6, texts: ['"Polônio"', ','], indentation: 2 },
      { id: 7, texts: [']'], indentation: 0 },
      {
        id: 8,
        texts: [
          'var radioativos = ',
          'elementos.',
          'dropZone',
          '(1,',
          'dropZone',
          ')',
        ],
        indentation: 0,
      },
      {
        id: 9,
        texts: ['escreva(radioativos.', 'dropZone', '( )'],
        indentation: 0,
      },
    ],
    dragItems: [
      { id: 1, label: 'tamanho' },
      { id: 2, label: 'fatiar' },
      { id: 3, label: 'somar' },
      { id: 4, label: '3' },
      { id: 5, label: '4' },
      { id: 6, label: 'inverter' },
    ],
    correctDragItemsIdsSequence: [2, 5, 1],
    picture: 'panda-sorrindo.jpg',
  },
  {
    code: `var uns = [1, 1, 1, 1]

escreva(uns.somar())`,
    title: 'O que será escrito pelo código abaixo?',
    type: 'open',
    lines: [
      {
        id: 1,
        texts: ['input-1'],
        indentation: 0,
      },
    ],
    answers: ['4'],
    picture: 'panda-sorrindo.jpg',
  },
  {
    title:
      'Complete o método `fatiar()` para que a fatia contenha: Via Láctea e Alfa Centauri.',
    type: 'drag-and-drop',
    lines: [
      { id: 1, texts: ['var galaxias = ['], indentation: 0 },
      { id: 2, texts: ['"Andrômeda"'], indentation: 2 },
      { id: 3, texts: ['"Via Láctea"', ','], indentation: 2 },
      { id: 4, texts: ['"Alfa Centauri"', ','], indentation: 2 },
      { id: 5, texts: ['"Betelgeuse"'], indentation: 2 },
      { id: 6, texts: [']'], indentation: 0 },
      {
        id: 7,
        texts: [
          'var fatia = ',
          'galaxias.fatiar',
          '(',
          'dropZone',
          ',',
          'dropZone',
          ')',
        ],
        indentation: 0,
      },
      { id: 8, texts: ['escreva(fatia)'], indentation: 0 },
    ],
    dragItems: [
      { id: 1, label: '0' },
      { id: 2, label: '1' },
      { id: 3, label: '3' },
      { id: 4, label: '4' },
      { id: 5, label: '2' },
    ],
    correctDragItemsIdsSequence: [2, 3],
    picture: 'panda-piscando.jpg',
  },
  {
    code: `var particulas = ["Elétron", "Próton", "Nêutron", "Quarks"]

var particulasInvertidas = particulas.inverter()
escreva(particulasInvertidas[-1])`,
    title:
      'Só para dizer que não esqueci do `inverter()`. Qual será o valor de `particulasInvertidas[-1]`?',
    type: 'selection',
    answer: 'Elétron',
    options: ['Elétron', 'Nêutron', 'Próton', 'Quarks'],
    picture: 'panda-fazendo-coracao.jpg',
  },
]
