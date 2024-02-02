import {
  CheckboxQuestion,
  DragAndDropQuestion,
  OpenQuestion,
} from '@/@types/quiz'

type Questions = [
  CheckboxQuestion,
  DragAndDropQuestion,
  DragAndDropQuestion,
  OpenQuestion,
  DragAndDropQuestion,
]

export const questions: Questions = [
  {
    title:
      'Com os motores funcionando e já estando no espaço, resta conferir nossos suprimentos. Vamos utilizar os *operadores lógicos*, quais abaixo se enquadram nessa categoria?',
    type: 'checkbox',
    options: ['>', 'e', '!', 'ou'],
    correctOptions: ['e', '!', 'ou'],
    picture: 'panda.jpg',
  },
  {
    title:
      'Verificando o oxigênio: complete o código com o operador correto para que o resultado seja igual a *verdadeiro*.',
    type: 'drag-and-drop',
    lines: [
      { id: 1, texts: ['var temOxigenio = verdadeiro'], indentation: 0 },
      {
        id: 2,
        texts: ['var temComida = falso'],
        indentation: 0,
      },
      {
        id: 3,
        texts: ['escreva(temOxigenio', 'dropZone', ' temComida)'],
        indentation: 0,
      },
    ],
    dragItems: [
      { id: 1, label: 'e' },
      { id: 2, label: '!' },
      { id: 3, label: 'ou' },
    ],
    correctDragItemsIdsSequence: [3],
    picture: 'panda-de-oculos.jpg',
  },
  {
    title:
      'Verificando a resistencia do foguete: complete o código para que o resultado seja igual a *verdadeiro*.',
    type: 'drag-and-drop',
    lines: [
      {
        id: 1,
        texts: ['var acimaVelocidadeLuz = ', 'dropZone', ' < 3600'],
        indentation: 0,
      },
      {
        id: 2,
        texts: ['var fogueteTemResistencia = ', 'dropZone'],
        indentation: 0,
      },
      {
        id: 3,
        texts: ['var seguranca = acimaVelocidadeLuz e fogueteTemResistencia'],
        indentation: 0,
      },
    ],
    dragItems: [
      { id: 1, label: '1200' },
      { id: 2, label: 'verdadeiro' },
      { id: 3, label: 'falso' },
      { id: 4, label: '3700' },
    ],
    correctDragItemsIdsSequence: [1, 2],
    picture: 'panda-abracando-bambu.jpg',
  },
  {
    title:
      'Quero inverter o valor da variável *faltaRemedios*. Qual o símbolo devo escreve para inverter valores lógicos?',
    type: 'open',
    lines: [
      {
        id: 1,
        texts: ['var faltaRemedios = verdadeiro'],
        indentation: 0,
      },
      {
        id: 2,
        texts: ['escreva(', 'input-1', 'faltaRemedios)'],
        indentation: 0,
      },
    ],
    answers: ['!'],
    picture: 'panda-confuso.jpg',
  },
  {
    title:
      'Vamos treinar um pouco mais todos os operadores. Complete o código abaixo usando os operadores corretos, de modo que seja escrito apenas *verdadeiro*.',
    type: 'drag-and-drop',
    lines: [
      { id: 1, texts: ['escreva(150', 'dropZone', '300)'], indentation: 0 },
      {
        id: 2,
        texts: ['escreva(500', 'dropZone', '100)'],
        indentation: 0,
      },
      {
        id: 3,
        texts: ['escreva(verdadeiro', 'dropZone', 'verdadeiro)'],
        indentation: 0,
      },
      {
        id: 4,
        texts: ['escreva(verdadeiro', 'dropZone', 'falso)'],
        indentation: 0,
      },
    ],
    dragItems: [
      { id: 1, label: '>' },
      { id: 2, label: 'e' },
      { id: 3, label: 'ou' },
      { id: 4, label: '<' },
    ],
    correctDragItemsIdsSequence: [4, 1, 2, 3],
    picture: 'panda-olhando-computador.jpg',
  },
]
