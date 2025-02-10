import type {
  DragAndDropListQuestionDto,
  DragAndDropQuestionDto,
  CheckboxQuestionDto,
} from '@stardust/core/lesson/dtos'

type Questions = [
  DragAndDropQuestionDto,
  CheckboxQuestionDto,
  DragAndDropQuestionDto,
  DragAndDropListQuestionDto,
  DragAndDropQuestionDto,
]

export const questions: Questions = [
  {
    type: 'drag-and-drop',
    stem: 'Complete o código para que a variavel *qualOSentidoDaVida* seja igual a *42*.',
    lines: [
      { number: 1, texts: ['var qualOSentidoDaVida = ', '2'], indentation: 0 },
      {
        number: 2,
        texts: ['qualOSentidoDaVida ', 'dropZone', ' 21'],
        indentation: 0,
      },
      { number: 3, texts: ['escreva(qualOSentidoDaVida)'], indentation: 0 },
    ],
    items: [
      { index: 1, label: '+=' },
      { index: 2, label: '-=' },
      { index: 3, label: '*=' },
      { index: 4, label: '/=' },
    ],
    correctItems: [3],
    picture: 'panda-amando-bambu.jpg',
  },
  {
    stem: 'Quais os possíveis valores que a variável *radiacao* tem que ter para que o resultado seja igual a "Seguro"?',
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
    stem: 'Complete o código para que o resultado seja igual a *planeta rico*',
    lines: [
      { number: 1, texts: ['var dinheiro = ', '2500 * 4'], indentation: 0 },
      { number: 2, texts: ['se (dinheiro >= 10000) {'], indentation: 0 },
      { number: 3, texts: ['escreva(', 'dropZone', ')'], indentation: 1 },
      { number: 4, texts: ['} senao {'], indentation: 0 },
      { number: 5, texts: ['escreva( ', 'dropZone', ' )'], indentation: 1 },
      { number: 6, texts: ['}'], indentation: 0 },
    ],
    items: [
      { index: 1, label: 'planeta rico' },
      { index: 2, label: 'planeta pobre' },
    ],
    correctItems: [1, 2],
    picture: 'panda-com-bola-de-boliche.jpg',
  },
  {
    stem: 'Reordene o código para que o valor da variavel *energiaNegativa* seja menor que *10*.',
    type: 'drag-and-drop-list',
    items: [
      { position: 1, label: 'var energiaNegativa = 10' },
      { position: 2, label: 'se (verdadeiro) {' },
      { position: 3, label: '\tenergiaNegativa -= 5' },
      { position: 4, label: '} senao {' },
      { position: 5, label: '\tenergiaNegativa += 5' },
      { position: 6, label: '}' },
    ],
    picture: 'panda-abracando-bambu.jpg',
  },
  {
    type: 'drag-and-drop',
    stem: 'Complete o código para que seja possível formar um sistema solar',
    lines: [
      {
        number: 0,
        texts: ['var planetas = ', '8'],
        indentation: 0,
      },
      {
        number: 1,
        texts: ['var temSol = ', 'verdadeiro'],
        indentation: 0,
      },
      {
        number: 2,
        texts: ['se ('],
        indentation: 0,
      },
      {
        number: 3,
        texts: ['temSol ', 'dropZone'],
        indentation: 1,
      },
      {
        number: 4,
        texts: ['planetas >', 'dropZone'],
        indentation: 1,
      },
      {
        number: 5,
        texts: [')'],
        indentation: 1,
      },
      {
        number: 6,
        texts: ['escreva("É possível formar um sistema solar")'],
        indentation: 1,
      },
      {
        number: 7,
        texts: ['} senao {'],
        indentation: 0,
      },
      {
        number: 8,
        texts: ['escreva("Não é possível formar um sistema solar")'],
        indentation: 1,
      },
      {
        number: 9,
        texts: ['}'],
        indentation: 0,
      },
    ],
    items: [
      {
        index: 1,
        label: 'ou',
      },
      {
        index: 2,
        label: 'e',
      },
      {
        index: 3,
        label: '4',
      },
      {
        index: 4,
        label: '8',
      },
    ],
    correctItems: [2, 3],
    picture: 'panda-de-oculos.jpg',
  },
]

// 0077876f-6693-4286-8340-be99ca0dba9f
// c20e0e55-2a21-4512-a080-be80b037117a
