import {
  CheckboxQuestion,
  DragAndDropListQuestion,
  DragAndDropQuestion,
} from '@/@types/quiz'

type Questions = [
  DragAndDropQuestion,
  CheckboxQuestion,
  DragAndDropQuestion,
  DragAndDropListQuestion,
  DragAndDropQuestion,
]

export const questions: Questions = [
  {
    type: 'drag-and-drop',
    title:
      'Complete o código para que a variavel *qualOSentidoDaVida* seja igual a *42*.',
    lines: [
      { id: 1, texts: ['var qualOSentidoDaVida = ', '2'], indentation: 0 },
      {
        id: 2,
        texts: ['qualOSentidoDaVida ', 'dropZone', ' 21'],
        indentation: 0,
      },
      { id: 3, texts: ['escreva(qualOSentidoDaVida)'], indentation: 0 },
    ],
    dragItems: [
      { id: 1, label: '+=' },
      { id: 2, label: '-=' },
      { id: 3, label: '*=' },
      { id: 4, label: '/=' },
    ],
    correctDragItemsIdsSequence: [3],
    picture: 'panda-amando-bambu.jpg',
  },
  {
    title:
      'Quais os possíveis valores que a variável *radiacao* tem que ter para que o resultado seja igual a "Seguro"?',
    code: `var radiacao = ?

se (radiacao > 500) {
  escreva("Não seguro") 
} senao {
  escreva("Seguro")
}`,
    type: 'checkbox',
    options: ['100', '200', '600', '700'],
    correctOptions: ['100', '200'],
    picture: 'panda-abracando-bambu.jpg',
  },
  {
    type: 'drag-and-drop',
    title: 'Complete o código para que o resultado seja igual a *planeta rico*',
    lines: [
      { id: 1, texts: ['var dinheiro = ', '2500 * 4'], indentation: 0 },
      { id: 2, texts: ['se (dinheiro >= 10000) {'], indentation: 0 },
      { id: 3, texts: ['escreva(', 'dropZone', ')'], indentation: 1 },
      { id: 4, texts: ['} senao {'], indentation: 0 },
      { id: 5, texts: ['escreva( ', 'dropZone', ' )'], indentation: 1 },
      { id: 6, texts: ['}'], indentation: 0 },
    ],
    dragItems: [
      { id: 1, label: 'planeta rico' },
      { id: 2, label: 'planeta pobre' },
    ],
    correctDragItemsIdsSequence: [1, 2],
    picture: 'panda-com-bola-de-boliche.jpg',
  },
  {
    title:
      'Reordene o código para que o valor da variavel *energiaNegativa* seja menor que *10*.',
    type: 'drag-and-drop-list',
    items: [
      { id: 1, label: 'var energiaNegativa = 10' },
      { id: 2, label: 'se (verdadeiro) {' },
      { id: 3, label: '\tenergiaNegativa -= 5' },
      { id: 4, label: '} senao {' },
      { id: 5, label: '\tenergiaNegativa += 5' },
      { id: 6, label: '}' },
    ],
    picture: 'panda-abracando-bambu.jpg',
  },
  {
    type: 'drag-and-drop',
    title: 'Complete o código para que seja possível formar um sistema solar',
    lines: [
      {
        id: 0,
        texts: ['var planetas = ', '8'],
        indentation: 0,
      },
      {
        id: 1,
        texts: ['var temSol = ', 'verdadeiro'],
        indentation: 0,
      },
      {
        id: 2,
        texts: ['se ('],
        indentation: 0,
      },
      {
        id: 3,
        texts: ['temSol ', 'dropZone'],
        indentation: 1,
      },
      {
        id: 4,
        texts: ['planetas >', 'dropZone'],
        indentation: 1,
      },
      {
        id: 5,
        texts: [')'],
        indentation: 1,
      },
      {
        id: 6,
        texts: ['escreva("É possível formar um sistema solar")'],
        indentation: 1,
      },
      {
        id: 7,
        texts: ['} senao {'],
        indentation: 0,
      },
      {
        id: 8,
        texts: ['escreva("Não é possível formar um sistema solar")'],
        indentation: 1,
      },
      {
        id: 9,
        texts: ['}'],
        indentation: 0,
      },
    ],
    dragItems: [
      {
        id: 1,
        label: 'ou',
      },
      {
        id: 2,
        label: 'e',
      },
      {
        id: 3,
        label: '4',
      },
      {
        id: 4,
        label: '8',
      },
    ],
    correctDragItemsIdsSequence: [2, 3],
    picture: 'panda-de-oculos.jpg',
  },
]

// 0077876f-6693-4286-8340-be99ca0dba9f
// c20e0e55-2a21-4512-a080-be80b037117a
