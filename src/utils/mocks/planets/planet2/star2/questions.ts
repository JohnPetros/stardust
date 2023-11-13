export const questions = [
  {
    title: 'Quais dos seguintes tipos podem ser usados para armazenar números?',
    type: 'checkbox',
    options: ['Inteiro', 'Real', 'Texto', 'Lógico'],
    correctOptions: ['Inteiro', 'Real'],
    picture: 'panda-piscando.jpg',
  },
  {
    title: 'Quais dos valores abaixo pode ser um tipo número inteiro?',
    type: 'checkbox',
    options: ['"10"', '10', '2.5', '-10'],
    correctOptions: ['10', '-10'],
    picture: 'panda-sorrindo.jpg',
  },
  {
    title: 'Qual será o tipo de dado do resultado 5 ÷ 2?',
    type: 'selection',
    answer: 'real',
    options: ['inteiro', '2.5', 'real', 'texto'],
    picture: 'panda-sorrindo.jpg',
  },
  {
    title: 'Qual será o valor da variável `distancia` no seguinte código:',
    type: 'selection',
    code: `var distancia = 2500 + "1000"
var mensagem =  "A nave está a " + distancia + " anos-luz da Terra."
escreva(mensagem)`,
    answer: '25001000',
    options: ['3500', '25001000', '25002000', '35000000'],
    picture: 'panda-sorrindo.jpg',
  },
  {
    title:
      'Complete o código abaixo para que o combustível total do foguete seja igual a `75`',
    picture: 'panda-deslumbrado.jpg',
    type: 'drag-and-drop',
    lines: [
      { id: 1, texts: ['var combustivelAtual = 25'], indentation: 0 },
      {
        id: 2,
        texts: ['var combustivelTotal = ', 'combustivelAtual ', 'dropZone'],
        indentation: 0,
      },
      {
        id: 3,
        texts: [
          'escreva("o foguete tem ${combustivelTotal} de combustível no total")',
        ],
        indentation: 0,
      },
    ],
    dragItems: [
      { id: 1, label: '- 50' },
      { id: 2, label: '+ "50"' },
      { id: 3, label: '+ 50' },
      { id: 4, label: '75' },
    ],
    correctDragItemsIdsSequence: [3],
  },
]
