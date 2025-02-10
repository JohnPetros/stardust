import type {
  DragAndDropQuestionDto,
  SelectionQuestionDto,
  CheckboxQuestionDto,
  DragAndDropListQuestionDto,
} from '@stardust/core/lesson/dtos'

type Questions = [
  CheckboxQuestionDto,
  DragAndDropListQuestionDto,
  DragAndDropQuestionDto,
  DragAndDropQuestionDto,
  SelectionQuestionDto,
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
  se (i == 2 ou i == 3) {
    continua
  }
  var itemAtual = itens[i]
  lixo.adicionar(itemAtual)
}`,
    stem: 'Enquanto esperamos podemos nos livrar de alguns itens inúteis. Quais são eles de acordo com o código abaixo?',
    type: 'checkbox',
    options: ['brinquedo quebrado', 'saco rasgado', 'guarda-chuva', 'chave de fenda'],
    correctOptions: ['brinquedo quebrado', 'saco rasgado'],
    picture: 'panda-sorrindo.jpg',
  },
  {
    stem: 'Esses itens mencionados estão em quantidade de até 6. Reordene o código para que seja escrito apenas números menores que 6',
    type: 'drag-and-drop-list',
    items: [
      { position: 1, label: 'var numeros = [2, 4, 6, 8]' },
      { position: 2, label: 'para cada numero em numeros {' },
      { position: 3, label: '\tse (numero < 6) {' },
      { position: 4, label: '\t\tescreva(numero)' },
      { position: 5, label: '\t}' },
      { position: 6, label: '}' },
    ],
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    stem: 'Espere, o foguete está enviando uma mensagem a nós. Complete o laço *para-cada* para juntar escrever cada parte dela.',
    type: 'drag-and-drop',
    lines: [
      {
        number: 1,
        texts: ['var mensagem = ""'],
        indentation: 0,
      },
      {
        number: 1,
        texts: ['var partes = ["Já", "estou", "chegando"]'],
        indentation: 0,
      },
      {
        number: 3,
        texts: ['dropZone', 'cada', 'dropZone', 'em', 'dropZone', '{'],
        indentation: 0,
      },
      { number: 4, texts: ['mensagem += "${parte} "'], indentation: 2 },
      { number: 5, texts: ['}'], indentation: 0 },
      { number: 5, texts: ['escreva(mensagem)'], indentation: 0 },
    ],
    items: [
      { index: 1, label: 'para' },
      { index: 2, label: 'enquanto' },
      { index: 3, label: 'parte' },
      { index: 5, label: 'partes' },
    ],
    correctItems: ['para', 'parte', 'partes'],
    picture: 'panda-sorrindo.jpg',
  },
  {
    stem: 'Como educação, podemos responder: "Já estava na hora, né"',
    type: 'drag-and-drop',
    lines: [
      {
        number: 1,
        texts: ['var palavras = ["Já", "estava", "na", "hora,", "né"]'],
        indentation: 0,
      },
      { number: 2, texts: ['var frase = ""'], indentation: 0 },
      {
        number: 3,
        texts: [
          'para ',
          '(var i = 0; ',
          'i <',
          ' palavras.',
          'dropZone',
          '(); ',
          'i++ {',
        ],
        indentation: 0,
      },
      {
        number: 4,
        texts: ['frase.', 'dropZone', '("${palavras[', 'dropZone', ']} ")'],
        indentation: 2,
      },
      { number: 5, texts: ['}'], indentation: 0 },
      { number: 6, texts: ['escreva(frase)'], indentation: 0 },
    ],
    items: [
      { index: 1, label: 'i' },
      { index: 2, label: 'remover' },
      { index: 3, label: 'adicionar' },
      { index: 4, label: 'tamanho' },
      { index: 5, label: 'inclui' },
      { index: 6, label: 'concatenar' },
    ],
    correctItems: ['tamanho', 'concatenar', 'i'],
    picture: 'panda-piscando.jpg',
  },
  {
    code: `var listas = [
  ['a', 'b', 'c'],
  [verdadeiro, 3, 4],
  ["falso", verdadeiro]
]

escreva(listas[2][0])`,
    stem: 'Só para saber que você está manjando de tudo. Qual será o tipo de dado de *listas[2][0]*',
    type: 'selection',
    answer: 'texto',
    options: ['lógico', 'texto', 'número', 'lista'],
    picture: 'panda-pensando.jpg',
  },
]
