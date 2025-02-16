import type {
  DragAndDropQuestionDto,
  CheckboxQuestionDto,
  OpenQuestionDto,
} from '@stardust/core/lesson/dtos'

type Questions = [
  CheckboxQuestionDto,
  DragAndDropQuestionDto,
  DragAndDropQuestionDto,
  OpenQuestionDto,
  DragAndDropQuestionDto,
]

export const questions: Questions = [
  {
    stem: 'Com os motores funcionando e já estando no espaço, resta conferir nossos suprimentos. Vamos utilizar os *operadores lógicos*, quais abaixo se enquadram nessa categoria?',
    type: 'checkbox',
    options: ['>', 'e', '!', 'ou'],
    correctOptions: ['e', '!', 'ou'],
    picture: 'panda.jpg',
  },
  {
    stem: 'Verificando o oxigênio: complete o código com o operador correto para que o resultado seja igual a *verdadeiro*.',
    type: 'drag-and-drop',
    lines: [
      { number: 1, texts: ['var temOxigenio = verdadeiro'], indentation: 0 },
      {
        number: 2,
        texts: ['var temComida = falso'],
        indentation: 0,
      },
      {
        number: 3,
        texts: ['escreva(temOxigenio', 'dropZone', ' temComida)'],
        indentation: 0,
      },
    ],
    items: [
      { index: 1, label: 'e' },
      { index: 2, label: '!' },
      { index: 3, label: 'ou' },
    ],
    correctItems: ['ou'],
    picture: 'panda-de-oculos.jpg',
  },
  {
    stem: 'Verificando a resistencia do foguete: complete o código para que a variável *seguranca* tenha valor *verdadeiro*.',
    type: 'drag-and-drop',
    lines: [
      {
        number: 1,
        texts: ['var acimaVelocidadeLuz = ', 'dropZone', ' < 3600'],
        indentation: 0,
      },
      {
        number: 2,
        texts: ['var fogueteTemResistencia = ', 'dropZone'],
        indentation: 0,
      },
      {
        number: 3,
        texts: ['var seguranca = acimaVelocidadeLuz e fogueteTemResistencia'],
        indentation: 0,
      },
    ],
    items: [
      { index: 1, label: '1200' },
      { index: 2, label: 'verdadeiro' },
      { index: 3, label: 'falso' },
      { index: 4, label: '3700' },
    ],
    correctItems: ['1200', 'verdadeiro'],
    picture: 'panda-abracando-bambu.jpg',
  },
  {
    stem: 'Quero inverter o valor da variável *faltaRemedios*. Qual o símbolo devo escreve para inverter valores lógicos?',
    type: 'open',
    lines: [
      {
        number: 1,
        texts: ['var faltaRemedios = verdadeiro'],
        indentation: 0,
      },
      {
        number: 2,
        texts: ['escreva(', 'input-1', 'faltaRemedios)'],
        indentation: 0,
      },
    ],
    answers: ['!'],
    picture: 'panda-confuso.jpg',
  },
  {
    stem: 'Vamos treinar um pouco mais todos os operadores. Complete o código abaixo usando os operadores corretos, de modo que seja escrito apenas *verdadeiro*.',
    type: 'drag-and-drop',
    lines: [
      { number: 1, texts: ['escreva(150', 'dropZone', '300)'], indentation: 0 },
      {
        number: 2,
        texts: ['escreva(500', 'dropZone', '100)'],
        indentation: 0,
      },
      {
        number: 3,
        texts: ['escreva(verdadeiro', 'dropZone', 'verdadeiro)'],
        indentation: 0,
      },
      {
        number: 4,
        texts: ['escreva(verdadeiro', 'dropZone', 'falso)'],
        indentation: 0,
      },
    ],
    items: [
      { index: 1, label: '>' },
      { index: 2, label: 'e' },
      { index: 3, label: 'ou' },
      { index: 4, label: '<' },
    ],
    correctItems: ['<', '>', 'e', 'ou'],
    picture: 'panda-olhando-computador.jpg',
  },
]
