import type {
  DragAndDropListQuestionDto,
  DragAndDropQuestionDto,
  CheckboxQuestionDto,
  SelectionQuestionDto,
} from '@stardust/core/lesson/dtos'

type Questions = [
  CheckboxQuestionDto,
  DragAndDropListQuestionDto,
  SelectionQuestionDto,
  DragAndDropListQuestionDto,
  DragAndDropQuestionDto,
]

export const questions: Questions = [
  {
    stem: 'Vamos aprender mais sobre o povo do planeta "Ifthenia". Para isso, precisaremos usar estruturas condicionais. Qual das seguintes opções são relacionadas a essas estruturas?',
    type: 'checkbox',
    options: ['portanto', 'se', 'senao se', 'senao'],
    correctOptions: ['se', 'senao se', 'senao'],
    picture: 'panda-piscando.jpg',
  },
  {
    stem: 'Para fazer as análise utilizaremos a estrutura condicional do tipo aninhada. Coloque os itens abaixo na ordem de acordo com essa estrutura.',
    type: 'drag-and-drop-list',
    items: [
      { position: 1, label: 'se' },
      { position: 2, label: 'senao se' },
      { position: 3, label: 'senao' },
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
    stem: 'Qual é o tipo do povo de "Ifthenia" com relação ao seu número de pernas?',
    type: 'selection',
    answer: 'bípede',
    options: ['quadrúpede', 'bípede', 'miriápode', 'indefinido'],
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    stem: 'Reordene o código para escrever adequadamente a altura média do povo de "Ifthenia", que é grande.',
    type: 'drag-and-drop-list',
    items: [
      { position: 1, label: 'var altura = 180' },
      { position: 2, label: 'se (altura < 20) {' },
      { position: 3, label: '\tescreva("pequeno")' },
      { position: 4, label: '} senao se (altura < 200) {' },
      { position: 5, label: '\tescreva("grande")' },
      { position: 6, label: '}' },
    ],
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    stem: 'Complete o código para verificar se o povo de "Ifthenia" é carnívoro ou herbívero',
    type: 'drag-and-drop',
    lines: [
      { number: 1, texts: ['se (consomeCarne) {'], indentation: 0 },
      { number: 2, texts: ['escreva', '("carnívoros")'], indentation: 1 },
      {
        number: 3,
        texts: ['dropZone', '(consumoDiarioDeCarne < 30) {'],
        indentation: 1,
      },
      { number: 4, texts: ['escreva("pouco carnívoros") {'], indentation: 2 },
      {
        number: 5,
        texts: ['}', 'dropZone', '(consumoDiarioDeCarne < 70) {'],
        indentation: 1,
      },
      { number: 6, texts: ['} senao {'], indentation: 1 },
      { number: 7, texts: ['escreva("muito carnívoros")'], indentation: 2 },
      { number: 8, texts: ['}', 'dropZone', ' {'], indentation: 0 },
      { number: 9, texts: ['escreva("herbíveros")'], indentation: 1 },
      { number: 10, texts: ['}'], indentation: 0 },
    ],
    items: [
      { index: 1, label: 'se' },
      { index: 2, label: 'senao' },
      { index: 3, label: 'senao se' },
      { index: 4, label: 'seguro' },
    ],
    correctItems: [1, 3, 2],
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
]
