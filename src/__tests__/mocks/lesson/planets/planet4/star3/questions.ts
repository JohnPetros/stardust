import {
  CheckboxQuestion,
  DragAndDropListQuestion,
  DragAndDropQuestion,
  SelectionQuestion,
} from '@/@types/quiz'

type Questions = [
  CheckboxQuestion,
  DragAndDropListQuestion,
  SelectionQuestion,
  DragAndDropListQuestion,
  DragAndDropQuestion,
]

export const questions: Questions = [
  {
    title:
      'Vamos aprender mais sobre o povo do planeta "Ifthenia". Para isso, precisaremos usar estruturas condicionais. Qual das seguintes opções são relacionadas a essas estruturas?',
    type: 'checkbox',
    options: ['portanto', 'se', 'senao se', 'senao'],
    correctOptions: ['se', 'senao se', 'senao'],
    picture: 'panda-piscando.jpg',
  },
  {
    title:
      'Para fazer as análise utilizaremos a estrutura condicional do tipo aninhada. Coloque os itens abaixo na ordem de acordo com essa estrutura.',
    type: 'drag-and-drop-list',
    items: [
      { id: 1, label: 'se' },
      { id: 2, label: 'senao se' },
      { id: 3, label: 'senao' },
    ],
    picture: 'panda-meditando.jpg',
  },
  {
    code: `var numeroDePernas = 1 + 1
var tipo = nulo

se (numeroDePernas == 4) {
  tipo = "quadrúpede"
} senao se (numeroDePernas == 2) {
  tipo = "bípede"
} senao {
  tipo = "miriápode" 
} 
escreva(tipo)`,
    title:
      'Qual é o tipo do povo de "Ifthenia" com relação ao seu número de pernas?',
    type: 'selection',
    answer: 'bípede',
    options: ['quadrúpede', 'bípede', 'miriápode', 'indefinido'],
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    title:
      'Reordene o código para escrever adequadamente a altura média do povo de "Ifthenia", que é grande.',
    type: 'drag-and-drop-list',
    items: [
      { id: 1, label: 'var altura = 180' },
      { id: 2, label: 'se (altura < 20) {' },
      { id: 3, label: '\tescreva("pequeno")' },
      { id: 4, label: '} senao se (altura < 200) {' },
      { id: 5, label: '\tescreva("grande")' },
      { id: 6, label: '}' },
    ],
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    title:
      'Complete o código para verificar se o povo de "Ifthenia" é carnívoro ou herbívero',
    type: 'drag-and-drop',
    lines: [
      { id: 1, texts: ['se (consomeCarne) {'], indentation: 0 },
      { id: 2, texts: ['escreva', '("carnívoros")'], indentation: 1 },
      {
        id: 3,
        texts: ['dropZone', '(consumoDiarioDeCarne < 30) {'],
        indentation: 1,
      },
      { id: 4, texts: ['escreva("pouco carnívoros") {'], indentation: 2 },
      {
        id: 5,
        texts: ['}', 'dropZone', '(consumoDiarioDeCarne < 70) {'],
        indentation: 1,
      },
      { id: 6, texts: ['} senao {'], indentation: 1 },
      { id: 7, texts: ['escreva("muito carnívoros")'], indentation: 2 },
      { id: 8, texts: ['}', 'dropZone', ' {'], indentation: 0 },
      { id: 9, texts: ['escreva("herbíveros")'], indentation: 1 },
      { id: 10, texts: ['}'], indentation: 0 },
    ],
    dragItems: [
      { id: 1, label: 'se' },
      { id: 2, label: 'senao' },
      { id: 3, label: 'senao se' },
      { id: 4, label: 'seguro' },
    ],
    correctDragItemsIdsSequence: [1, 3, 2],
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
]
