import type {
  DragAndDropQuestionDto,
  SelectionQuestionDto,
  CheckboxQuestionDto,
} from '@stardust/core/lesson/dtos'

type Questions = [
  CheckboxQuestionDto,
  SelectionQuestionDto,
  SelectionQuestionDto,
  DragAndDropQuestionDto,
  DragAndDropQuestionDto,
]

export const questions: Questions = [
  {
    stem: 'Vamos verificar se há alguém por perto para ajudar. Para isso, precisamos dos operadores aritméticos. Quais os operadores abaixo estão escritos da maneira correta em um programa?',
    type: 'checkbox',
    options: ['/', '+', '÷', 'x'],
    correctOptions: ['/', '+'],
    picture: 'panda-olhando-computador.jpg',
  },
  {
    stem: 'O foguete detectou uma quantidade de seres lá fora, no caso: *5 + 3 * 2*. Qual é esse número?',
    type: 'selection',
    options: ['11', '16', '13', '15'],
    answer: '13',
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    stem: 'Foi recebido uma mensagem em forma de operação usando *módulo*: 50 % 2. Qual é esse resultado?',
    type: 'selection',
    answer: '0',
    options: ['0', '25', '1', '100'],
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    stem: 'Complete a linha abaixo com os operadores corretos, de modo que indique que o número do nosso foguete é o *13*.',
    type: 'drag-and-drop',
    lines: [
      {
        number: 1,
        texts: ['var numero = ', '5 ', 'dropZone', ' 2 ', 'dropZone', ' 4', ' = 13'],
        indentation: 0,
      },
    ],
    items: [
      { index: 1, label: '/' },
      { index: 2, label: '+' },
      { index: 3, label: '*' },
      { index: 4, label: 'x' },
      { index: 5, label: '-' },
    ],
    picture: 'panda-olhando-de-lado.jpg',
    correctItems: ['+', '*'],
  },
  {
    stem: 'Agora complete a linha de código com os números certos para que o resultado seja igual a *10*, indicando que temos 10 assentos disponíveis.',
    type: 'drag-and-drop',
    lines: [
      {
        number: 1,
        texts: ['var assentos = ', 'dropZone', ' + ', 'dropZone', ' / ', '2', ' = 10'],
        indentation: 0,
      },
    ],
    items: [
      { index: 1, label: '4' },
      { index: 2, label: '12' },
      { index: 3, label: '6' },
      { index: 4, label: '-4' },
      { index: 5, label: '10' },
    ],
    picture: 'panda-piscando.jpg',
    correctItems: ['4', '12'],
  },
]
