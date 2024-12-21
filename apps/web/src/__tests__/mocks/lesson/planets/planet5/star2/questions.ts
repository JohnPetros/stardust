import {
  DragAndDropListQuestion,
  DragAndDropQuestion,
  OpenQuestion,
  SelectionQuestion,
} from '@/@types/Quiz'

type Questions = [
  OpenQuestion,
  SelectionQuestion,
  SelectionQuestion,
  DragAndDropQuestion,
  DragAndDropListQuestion,
]

export const questions: Questions = [
  {
    title:
      'O planeta em que estamos chama-se "Looporia", vamos analisar algumas características, como a quantidade de água. Mas não sei qual o total, qual laço  devemos utilizar nesse caso?',
    type: 'open',
    lines: [
      {
        id: 1,
        texts: ['input-1', '(quantidadeAgua > 0) {'],
        indentation: 0,
      },
      {
        id: 2,
        texts: ['escreva(quantidadeAgua)'],
        indentation: 2,
      },
      {
        id: 3,
        texts: ['}'],
        indentation: 0,
      },
    ],
    answers: ['enquanto'],
    picture: 'panda-de-oculos.jpg',
  },
  {
    code: `para (var vezes = 1; vezes < 5; vezes++) {
  se (vezes == 3) {
    pausa
  }

  escreva("Deu uma volta completa")
}`,
    title:
      'Quantas vezes o planeta Looporia dá uma volta completa em seu sol de acordo com o laço de baixo?',
    type: 'selection',
    answer: '2',
    options: ['5', '1', '2', '3'],
    picture: 'panda-andando-com-bambu.jpg',
  },

  {
    code: `var temperatura = 20

enquanto (temperatura > 0) {
  escreva('Tenho \${combustivel} de combustível')
  combustivel++
}`,
    title:
      'Qual será o resultado do código abaixo que analisa o aumento de temperatura do planeta Looporia',
    type: 'selection',
    answer: 'laço infinito',
    options: [
      '0',
      'Tenho 50 de combustível',
      'Tenho 21 de combustível',
      'laço infinito',
    ],
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    title:
      'O planeta Looporia é quinto no seu sistema solar. Complete o laço a seguir, de modo que no final do programa a variável *frase* seja igual a "Planeta nº5"',
    type: 'drag-and-drop',
    lines: [
      { id: 1, texts: ['var numero = 1'], indentation: 0 },
      { id: 2, texts: ['var frase = ""'], indentation: 0 },
      {
        id: 3,
        texts: ['dropZone', '(numero ', 'dropZone', '5)'],
        indentation: 0,
      },
      {
        id: 4,
        texts: ['dropZone', '= "Planeta nº, ', '${', 'dropZone', '}"'],
        indentation: 2,
      },
      { id: 5, texts: ['numero--'], indentation: 2 },
      { id: 6, texts: ['}'], indentation: 0 },
      { id: 7, texts: ['escreva(frase)'], indentation: 0 },
    ],
    dragItems: [
      { id: 1, label: 'frase' },
      { id: 2, label: 'enquanto' },
      { id: 3, label: '<' },
      { id: 4, label: '>' },
      { id: 5, label: 'numero' },
    ],
    correctDragItemsIdsSequence: [2, 3, 1, 5],
    picture: 'panda-andando-com-bambu.jpg',
  },
  {
    title:
      'Já visitamos 4 planetas (ou seriam 3?). Reordene o laço abaixo para que ele escreva do 1 ao 4, ou seja, "Já visitei o planeta 1", "Já visitei o planeta 2", "Já visitei o planeta 3", "Já visitei o planeta 4" e assim por diante.',
    type: 'drag-and-drop-list',
    items: [
      { id: 1, label: 'var numero = 1' },
      { id: 2, label: 'enquanto(numero > 4) {' },
      { id: 3, label: '\t\tescreva("Já visitei o planeta ${numero}")' },
      { id: 4, label: '\t\tnumero++' },
      { id: 5, label: '}' },
    ],
    picture: 'panda-dando-risadinha.jpg',
  },
]
