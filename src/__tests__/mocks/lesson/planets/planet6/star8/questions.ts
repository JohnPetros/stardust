import {
  CheckboxQuestion,
  DragAndDropListQuestion,
  DragAndDropQuestion,
  SelectionQuestion,
} from '@/@types/Quiz'

type Questions = [
  CheckboxQuestion,
  DragAndDropListQuestion,
  DragAndDropQuestion,
  DragAndDropQuestion,
  SelectionQuestion,
]

export const questions: Questions = [
  {
    code: `var itens = [
  "brinquedo quebrado",
  "saco rasgado", 
  "guarda-chuva", 
  "chave de fenda"
]

var lixo = []
para (var i = 0; i < itens.tamanho(); i++) {
     se (i == 2) {
      continua
   }

  var itemAtual = itens[i]
  lixo.adicionar(itemAtual)
}`,
    title:
      'Enquanto esperamos podemos nos livrar de alguns itens inúteis. Quais são eles de acordo com o código abaixo?',
    type: 'checkbox',
    options: [
      'brinquedo quebrado',
      'saco rasgado',
      'guarda-chuva',
      'chave de fenda',
    ],
    correctOptions: ['brinquedo quebrado', 'saco rasgado'],
    picture: 'panda-sorrindo.jpg',
  },
  {
    title:
      'Esses itens mencionados estão em quantidade de até 6. Reordene o código para que seja escrito apenas números menores que 6',
    type: 'drag-and-drop-list',
    items: [
      { id: 1, label: 'var numeros = [2, 4, 6, 8]' },
      { id: 2, label: 'para cada numero em numeros {' },
      { id: 3, label: '    se (numero < 6)' },
      { id: 4, label: '        escreva(numero)' },
      { id: 5, label: '    }' },
      { id: 6, label: '}' },
    ],
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    title:
      'Espere o foguete está enviando uma mensagem a nós. Complete o laço `para-cada` para juntar escrever cada parte dela.',
    type: 'drag-and-drop',
    lines: [
      {
        id: 1,
        texts: ['var partes = ["Já", "estou", "chegando"]'],
        indentation: 0,
      },
      {
        id: 3,
        texts: ['dropZone', 'cada', 'dropZone', 'em', 'dropZone', '{'],
        indentation: 0,
      },
      { id: 4, texts: ['escreva(animal)'], indentation: 2 },
      { id: 5, texts: ['}'], indentation: 0 },
    ],
    dragItems: [
      { id: 1, label: 'para' },
      { id: 2, label: 'enquanto' },
      { id: 3, label: 'parte' },
      { id: 5, label: 'partes' },
    ],
    correctDragItemsIdsSequence: [1, 3, 5],
    picture: 'panda-sorrindo.jpg',
  },
  {
    title: 'Como educação, podemos responder: "Já estava na hora, né"',
    type: 'drag-and-drop',
    lines: [
      {
        id: 1,
        texts: ['var palavras = ["Já", "estava", "na", "hora,", "né"]'],
        indentation: 0,
      },
      { id: 2, texts: ['var frase = ""'], indentation: 0 },
      {
        id: 3,
        texts: [
          'para ',
          '(var i = 0; ',
          'i <',
          ' palavras.',
          'dropZone',
          '( ); ',
          'i++ {',
        ],
        indentation: 0,
      },
      {
        id: 4,
        texts: ['frase.', 'dropZone', '(palavras[', 'dropZone', '])'],
        indentation: 2,
      },
      { id: 5, texts: ['}'], indentation: 0 },
      { id: 6, texts: ['escreva(frase);'], indentation: 0 },
    ],
    dragItems: [
      { id: 1, label: 'i' },
      { id: 2, label: 'remover' },
      { id: 3, label: 'tamanho' },
      { id: 5, label: 'inclui' },
      { id: 6, label: 'concatenar' },
    ],
    correctDragItemsIdsSequence: [3, 6, 1],
    picture: 'panda-piscando.jpg',
  },
  {
    code: `var vetores = [
  ['a', 'b', 'c'],
  [verdadeiro, 3, 4],
  ["falso", verdadeiro]
]

escreva(vetores[2][0])`,
    title:
      'Só para saber que você está manjando de tudo. Qual será o tipo de dado de `vetores[2][0]`',
    type: 'selection',
    answer: 'texto',
    options: ['lógico', 'texto', 'número', 'vetor'],
    picture: 'panda-pensando.jpg',
  },
]
