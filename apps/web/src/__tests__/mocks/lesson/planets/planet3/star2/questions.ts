import type {
  DragAndDropQuestionDto,
  OpenQuestionDto,
  SelectionQuestionDto,
} from '@stardust/core/lesson/dtos'

type Questions = [
  SelectionQuestionDto,
  SelectionQuestionDto,
  OpenQuestionDto,
  DragAndDropQuestionDto,
  DragAndDropQuestionDto,
]

export const questions: Questions = [
  {
    stem: 'Ainda estamos decolando. Vamos verificar outras coisas pendentes usando os operadores relacionais. Mas lembrando: qual o tipo de dado que se obtém ao usar operadores relacionais?',
    type: 'selection',
    answer: 'lógico',
    picture: 'panda-piscando-sentado.jpg',
    options: ['falso', 'verdadeiro', 'lógico', 'texto'],
  },
  {
    code: `var altitudeAtual = 2000
var altitudeSegura = 1500
var altitudeSegura = altitudeSegura + 500
escreva(altitudeSegura < altitudeAtual)`,
    stem: 'Vamos verificar a altitude. Qual será o resultado do seguinte código:',
    type: 'selection',
    answer: 'falso',
    options: ['falso', 'verdadeiro', '1500', '2000'],
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    stem: 'Temos 9 de energia de escudo e decolagem exigirá 7 de energia. Qual símbolo você usuaria para verificar se 9 é maior ou igual a 7?',
    type: 'open',
    lines: [
      {
        number: 1,
        texts: ['escreva(9', 'input-1', '7)'],
        indentation: 0,
      },
    ],
    answers: ['>='],
    picture: 'panda-fazendo-coracao.jpg',
  },
  {
    stem: 'Agora, checando a velocidade limite. Complete a código com os operadores certos para que o resultado seja igual a *verdadeiro*',
    type: 'drag-and-drop',
    lines: [
      { number: 1, texts: ['var velocidadeLimite = 5000'], indentation: 0 },
      {
        number: 2,
        texts: ['var velocidadeAtual ', 'dropZone', ' 2000'],
        indentation: 0,
      },
      {
        number: 3,
        texts: ['escreva (velocidadeLimite', 'dropZone', ' velocidadeAtual)'],
        indentation: 0,
      },
    ],
    items: [
      { index: 1, label: '=' },
      { index: 2, label: '!=' },
      { index: 3, label: '==' },
      { index: 4, label: '<' },
    ],
    correctItems: [1, 2],
    picture: 'panda-olhando-computador.jpg',
  },
  {
    stem: 'Agora o combustível. Complete o código com os valores certos para que o resultado seja igual a *verdadeiro*',
    type: 'drag-and-drop',
    lines: [
      { number: 1, texts: ['var combustivelAtual = ', 'dropZone'], indentation: 0 },
      {
        number: 2,
        texts: ['var combustivelNecessario = ', 'dropZone'],
        indentation: 0,
      },
      {
        number: 3,
        texts: ['escreva (combustivelAtual <= combustivelNecessario)'],
        indentation: 0,
      },
    ],
    items: [
      { index: 1, label: '250' },
      { index: 2, label: '300' },
      { index: 3, label: 'verdadeiro' },
      { index: 4, label: '<' },
    ],
    correctItems: [1, 2],
    picture: 'panda-olhando-computador.jpg',
  },
]

// 8d260fac-f904-42b3-b37b-88832caf0f6e
