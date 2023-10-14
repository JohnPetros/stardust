export const questions = [
  {
    title:
      'Ainda estamos decolando. Vamos verificar outras coisas pendentes usando os operadores relacionais. Mas lembrando: qual o tipo de dado que se obtém ao usar operadores relacionais?',
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
    title:
      'Vamos verificar a altitude. Qual será o resultado do seguinte código:',
    type: 'selection',
    answer: 'falso',
    options: ['falso', 'verdadeiro', '1500', '2000'],
    picture: 'panda-olhando-de-lado.jpg',
  },

  {
    title:
      'Temos 9 de energia de escudo e decolagem exigirá 7 de energia. Qual símbolo você usuaria para verificar se 9 é maior ou igual a 7?',
    type: 'open',
    lines: [
      {
        id: 1,
        texts: ['escreva(9', 'input-1', '7)'],
        indentation: 0,
      },
    ],
    answers: ['>='],
    picture: 'panda-fazendo-coracao.jpg',
  },

  {
    stem: 'Agora, checando a velocidade limite. Complete a código com os operadores certos para que o resultado seja igual a `verdadeiro`',
    type: 'drag-and-drop',
    lines: [
      { id: 1, texts: ['var velocidadeLimite = 5000'], identation: 0 },
      {
        id: 2,
        texts: ['var velocidadeAtual ', 'dropZone', ' 2000'],
        identation: 0,
      },
      {
        id: 3,
        texts: ['escreva (velocidadeLimite', 'dropZone', ' velocidadeAtual)'],
        identation: 0,
      },
    ],
    dragItems: [
      { id: 1, label: '=' },
      { id: 2, label: '!=' },
      { id: 3, label: '==' },
      { id: 4, label: '<' },
    ],
    correctDragItemsIdsSequence: [1, 2],
    picture: 'panda-olhando-computador.jpg',
  },
  {
    title:
      'Agora o combustível. Complete o código com os números certos para que o resultado seja igual a `verdadeiro`',
    type: 'drag-and-drop',
    lines: [
      { id: 1, texts: ['var combustivelAtual = ', 'dropZone'], identation: 0 },
      {
        id: 2,
        texts: ['var combustivelNecessario = ', 'dropZone'],
        identation: 0,
      },
      {
        id: 3,
        texts: ['escreva (combustivelAtual <= combustivelNecessario)'],
        identation: 0,
      },
    ],
    dragItems: [
      { id: 1, label: '250' },
      { id: 2, label: '300' },
      { id: 3, label: 'verdadeiro' },
      { id: 4, label: '<' },
    ],
    correctDragItemsIdsSequence: [1, 2],
    picture: 'panda-olhando-computador.jpg',
  },
]
