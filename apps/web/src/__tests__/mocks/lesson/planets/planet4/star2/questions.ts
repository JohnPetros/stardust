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
    stem: 'Complete o código para que a variavel *sentidoDaVida* seja igual a *42*.',
    lines: [
      { number: 1, texts: ['var sentidoDaVida = ', '2'], indentation: 0 },
      {
        number: 2,
        texts: ['var sentidoDaVida ', 'dropZone', ' 21'],
        indentation: 0,
      },
      { number: 3, texts: ['escreva(sentidoDaVida)'], indentation: 0 },
    ],
    items: [
      { index: 1, label: '+=' },
      { index: 2, label: '-=' },
      { index: 3, label: '*=' },
      { index: 4, label: '/=' },
    ],
    correctItems: ['*='],
    picture: 'panda-amando-bambu.jpg',
  },
  {
    stem: 'Quais os possíveis valores que a variável *radiacao* tem que ter para que o resultado seja igual a "Seguro"?',
    code: `var radiacao 

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
      { index: 1, label: '"planeta rico"' },
      { index: 2, label: '"planeta pobre"' },
    ],
    correctItems: ['"planeta rico"', '"planeta pobre"'],
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
        texts: ['se (', 'temSol ', 'dropZone', 'planetas >', 'dropZone', ') {'],
        indentation: 0,
      },
      {
        number: 3,
        texts: ['escreva("É possível formar um sistema solar")'],
        indentation: 1,
      },
      {
        number: 4,
        texts: ['} senao {'],
        indentation: 0,
      },
      {
        number: 5,
        texts: ['escreva("Não é possível formar um sistema solar")'],
        indentation: 1,
      },
      {
        number: 6,
        texts: ['}'],
        indentation: 0,
      },
    ],
    items: [
      {
        index: 1,
        label: 'nem',
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
      {
        index: 5,
        label: 'verdadeiro',
      },
    ],
    correctItems: ['e', '4'],
    picture: 'panda-de-oculos.jpg',
  },
]
