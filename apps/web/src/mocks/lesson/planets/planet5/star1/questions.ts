import type {
  DragAndDropQuestionDto,
  SelectionQuestionDto,
} from '@stardust/core/lesson/entities/dtos'

type Questions = [
  SelectionQuestionDto,
  DragAndDropQuestionDto,
  SelectionQuestionDto,
  SelectionQuestionDto,
  DragAndDropQuestionDto,
]

export const questions: Questions = [
  {
    stem: 'Para ver se estamos na mesma página. Qual é a estrutura correta de um laço *para*?',
    type: 'selection',
    answer: 'para (var i = 0; i < 100; i++)',
    options: [
      'para (var i = 0; i < 100; i++)',
      'para (i < 100; var i = 0; i++)',
      'para (i++; var i = 0; i < 100)',
      'para (var i = 0; i++; var i = 0)',
    ],
    picture: 'panda-deslumbrado.jpg',
  },
  {
    stem: 'Vamos usar analisador de amostras. Para isso, é necessário escrever "ligar analisador" 5 vezes. Complete o laço a seguir para que isso ocorra:',
    type: 'drag-and-drop',
    lines: [
      {
        number: 1,
        texts: ['var msg = "ligar analisador"'],
        indentation: 0,
      },
      {
        number: 2,
        texts: [
          'dropZone',
          '(var contador = ',
          'dropZone',
          '; contador < ',
          'dropZone',
          '; contador++) {',
        ],
        indentation: 0,
      },
      { number: 3, texts: ['escreva(msg)'], indentation: 1 },
      { number: 4, texts: ['}'], indentation: 0 },
    ],
    items: [
      { index: 1, label: 'se' },
      { index: 2, label: 'para' },
      { index: 3, label: '0' },
      { index: 4, label: '5' },
      { index: 5, label: 'contador' },
    ],
    correctItems: ['para', '0', '5'],
    picture: 'panda-sorrindo.jpg',
  },

  {
    stem: 'O analisador está enviando uma sequência de números por meio de um laço. Qual é essa sequência? (Lembre-se do operador de módulo *%*, que calcula o resto da divisão)',
    type: 'selection',
    code: `para (var numero = 1; numero <= 10; numero++) {
  se (numero % 2 == 0) {
    escreva(numero)
  }
} `,
    answer: '2, 4, 6, 8, 10',
    options: ['1, 3, 5, 7, 9', '2, 4, 6, 8, 10', '2, 5, 8', '1, 4, 7, 10'],
    picture: 'panda-sorrindo.jpg',
  },
  {
    code: `para (var vezes = 2; vezes <= 10; vezes += 2) {
  escreva("Que a lógica esteja com você")
}`,
    stem: 'A sequencia de números recebida significa "Que a lógica esteja com você". Quantas vezes essa frase está sendo escrita no laço a seguir.',
    type: 'selection',
    answer: '5',
    options: ['2', '5', '4', '10'],
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    stem: 'Talvez o analisador esteja com problema. Complete o laço a seguir, de modo que a variavel *energia* seja igual a 50.',
    type: 'drag-and-drop',
    lines: [
      { number: 1, texts: ['var energia = 0'], indentation: 0 },
      {
        number: 2,
        texts: [
          'para (var contador = 1; contador',
          'dropZone',
          '50;',
          'dropZone',
          '++) {',
        ],
        indentation: 0,
      },
      { number: 3, texts: ['dropZone', '++'], indentation: 2 },
      { number: 5, texts: ['}'], indentation: 0 },
      { number: 4, texts: ['escreva(energia)'], indentation: 0 },
    ],
    items: [
      { index: 1, label: '<' },
      { index: 2, label: '<=' },
      { index: 3, label: 'contador' },
      { index: 4, label: 'energia' },
    ],
    correctItems: ['<=', 'contador', 'energia'],
    picture: 'panda-andando-com-bambu.jpg',
  },
]
