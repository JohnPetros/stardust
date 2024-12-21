import { DragAndDropQuestion, SelectionQuestion } from '@/@types/Quiz'

type Questions = [
  SelectionQuestion,
  DragAndDropQuestion,
  SelectionQuestion,
  SelectionQuestion,
  DragAndDropQuestion,
]

export const questions: Questions = [
  {
    title:
      'Para ver se estamos na mesma página. Qual é a estrutura correta de um laço *para*?',
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
    title:
      'Vamos usar analisador de amostras. Para isso, é necessário escrever "ligar analisador" 5 vezes. Complete o laço a seguir para que isso ocorra:',
    type: 'drag-and-drop',
    lines: [
      {
        id: 1,
        texts: ['var msg = "ligar analisador"'],
        indentation: 0,
      },
      {
        id: 2,
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
      { id: 3, texts: ['escreva(msg)'], indentation: 1 },
      { id: 4, texts: ['}'], indentation: 0 },
    ],
    dragItems: [
      { id: 1, label: 'se' },
      { id: 2, label: 'para' },
      { id: 3, label: '0' },
      { id: 4, label: '5' },
      { id: 5, label: 'contador' },
    ],
    correctDragItemsIdsSequence: [2, 3, 4],
    picture: 'panda-sorrindo.jpg',
  },

  {
    title:
      'O analisador está enviando uma sequência de números por meio de um laço. Qual é essa sequência?',
    type: 'selection',
    code: `para (var numero = 1; numero <= 10; numero++) {
  se (numero * 2 === 0) {
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
    title:
      'A sequencia de números recebida significa "Que a lógica esteja com você". Quantas vezes essa frase está sendo escrita no laço a seguir.',
    type: 'selection',
    answer: '5',
    options: ['2', '5', '4', '10'],
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    title:
      'Talvez o analisador esteja com problema. Complete o laço a seguir, de modo que a variavel *energia* seja igual a 50.',
    type: 'drag-and-drop',
    lines: [
      { id: 1, texts: ['var energia = 0'], indentation: 0 },
      {
        id: 2,
        texts: [
          'para (var contador = 1; contador',
          'dropZone',
          '50;',
          'dropZone',
          '++) {',
        ],
        indentation: 0,
      },
      { id: 3, texts: ['dropZone', '++'], indentation: 2 },
      { id: 5, texts: ['}'], indentation: 0 },
      { id: 4, texts: ['escreva(energia)'], indentation: 0 },
    ],
    dragItems: [
      { id: 1, label: '<' },
      { id: 2, label: '<=' },
      { id: 3, label: 'contador' },
      { id: 4, label: 'energia' },
    ],
    correctDragItemsIdsSequence: [2, 3, 4],
    picture: 'panda-andando-com-bambu.jpg',
  },
]
