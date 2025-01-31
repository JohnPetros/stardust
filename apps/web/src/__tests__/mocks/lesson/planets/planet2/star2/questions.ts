import type {
  CheckboxQuestionDto,
  DragAndDropQuestionDto,
  SelectionQuestionDto,
} from '@stardust/core/lesson/dtos'

type Questions = [
  CheckboxQuestionDto,
  CheckboxQuestionDto,
  SelectionQuestionDto,
  SelectionQuestionDto,
  DragAndDropQuestionDto,
]

export const questions: Questions = [
  {
    stem: 'Um valor do tipo *número* pode conter quais tipos de número?',
    type: 'checkbox',
    options: ['Inteiro', 'Decimal', 'Texto', 'Lógico'],
    correctOptions: ['Inteiro', 'Decimal'],
    picture: 'panda-piscando.jpg',
  },
  {
    stem: 'Quais dos valores abaixo pode ser um tipo *número* inteiro?',
    type: 'checkbox',
    options: ['"10"', '10', '2.5', '-10'],
    correctOptions: ['10', '-10'],
    picture: 'panda-sorrindo.jpg',
  },
  {
    stem: 'Qual será o tipo da expressão 5 ÷ 2?',
    type: 'selection',
    answer: 'decimal',
    options: ['inteiro', '2.5', 'decimal', 'texto'],
    picture: 'panda-sorrindo.jpg',
  },
  {
    stem: 'Qual será o valor da variável *distancia* no seguinte código?',
    type: 'selection',
    code: `var distancia = 2500 + "1000"
var mensagem =  "A nave está a " + distancia + " anos-luz da Terra."
escreva(mensagem)`,
    answer: '25001000',
    options: ['3500', '25001000', '25002000', '35000000'],
    picture: 'panda-sorrindo.jpg',
  },
  {
    stem: 'Complete o código abaixo para que o combustível total do foguete seja igual a *75*.',
    picture: 'panda-deslumbrado.jpg',
    type: 'drag-and-drop',
    lines: [
      { number: 1, texts: ['var combustivelAtual = 25'], indentation: 0 },
      {
        number: 2,
        texts: ['var combustivelTotal = ', 'combustivelAtual ', 'dropZone'],
        indentation: 0,
      },
      {
        number: 3,
        texts: ['escreva("o foguete tem ${combustivelTotal} de combustível no total.")'],
        indentation: 0,
      },
    ],
    items: [
      { index: 1, label: '- 50' },
      { index: 2, label: '+ "50"' },
      { index: 3, label: '+ 50' },
      { index: 4, label: '75' },
    ],
    correctItemsIndexesSequence: [3],
  },
]
