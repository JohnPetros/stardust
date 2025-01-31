import type {
  DragAndDropQuestionDto,
  SelectionQuestionDto,
  OpenQuestionDto,
  CheckboxQuestionDto,
} from '@stardust/core/lesson/dtos'

type Questions = [
  CheckboxQuestionDto,
  DragAndDropQuestionDto,
  OpenQuestionDto,
  DragAndDropQuestionDto,
  SelectionQuestionDto,
]

export const questions: Questions = [
  {
    code: `var bolo = ['Fatia 1', 'Fatia 2', 'Fatia 3', 'Fatia 4']
  
var fatias = elementos.fatiar(2)
escreva(fatias)`,
    stem: 'Vamos ver se você aprendeu os novos métodos que mostrei. Qual serão as fatias extraídas da lista *bolo*?',
    type: 'checkbox',
    options: ['Fatia 1', 'Fatia 2', 'Fatia 3', 'Fatia 4'],
    correctOptions: ['Fatia 3', 'Fatia 4'],
    picture: 'panda-deslumbrado.jpg',
  },
  {
    stem: 'Complete o código a fim de que a lista *radioativos* tenha 3 itens, ou seja, que o resultado final seja igual a 3.',
    type: 'drag-and-drop',
    lines: [
      { number: 1, texts: ['var elementos = ['], indentation: 0 },
      { number: 2, texts: ['"Hélio",'], indentation: 2 },
      { number: 3, texts: ['"Estrôncio",'], indentation: 2 },
      { number: 4, texts: ['"Rádio",'], indentation: 2 },
      { number: 5, texts: ['"Césio",'], indentation: 2 },
      { number: 6, texts: ['"Polônio"'], indentation: 2 },
      { number: 7, texts: [']'], indentation: 0 },
      {
        number: 8,
        texts: ['var radioativos = ', 'elementos.', 'dropZone', '(1,', 'dropZone', ')'],
        indentation: 0,
      },
      {
        number: 9,
        texts: ['escreva(radioativos.', 'dropZone', '()'],
        indentation: 0,
      },
    ],
    items: [
      { index: 1, label: 'tamanho' },
      { index: 2, label: 'fatiar' },
      { index: 3, label: 'somar' },
      { index: 4, label: '3' },
      { index: 5, label: '4' },
      { index: 6, label: 'inverter' },
    ],
    correctItemsIndexesSequence: [2, 5, 1],
    picture: 'panda-sorrindo.jpg',
  },
  {
    code: `var uns = [1, 1, 1, 1]

escreva(uns.somar())`,
    stem: 'O que será escrito pelo código abaixo?',
    type: 'open',
    lines: [
      {
        number: 1,
        texts: ['input-1'],
        indentation: 0,
      },
    ],
    answers: ['4'],
    picture: 'panda-sorrindo.jpg',
  },
  {
    stem: 'Complete o método *fatiar()* para que a fatia contenha: "Via Láctea" e "Alfa Centauri".',
    type: 'drag-and-drop',
    lines: [
      { number: 1, texts: ['var galaxias = ['], indentation: 0 },
      { number: 2, texts: ['"Andrômeda"'], indentation: 2 },
      { number: 3, texts: ['"Via Láctea"', ','], indentation: 2 },
      { number: 4, texts: ['"Alfa Centauri"', ','], indentation: 2 },
      { number: 5, texts: ['"Betelgeuse"'], indentation: 2 },
      { number: 6, texts: [']'], indentation: 0 },
      {
        number: 7,
        texts: ['var fatia = ', 'galaxias.fatiar', '(', 'dropZone', ',', 'dropZone', ')'],
        indentation: 0,
      },
      { number: 8, texts: ['escreva(fatia)'], indentation: 0 },
    ],
    items: [
      { index: 1, label: '0' },
      { index: 2, label: '1' },
      { index: 3, label: '3' },
      { index: 4, label: '4' },
      { index: 5, label: '2' },
    ],
    correctItemsIndexesSequence: [2, 3],
    picture: 'panda-piscando.jpg',
  },
  {
    code: `var particulas = ["Elétron", "Próton", "Nêutron", "Quarks"]

var particulasInvertidas = particulas.inverter()

escreva(particulasInvertidas[-1])`,
    stem: 'Só para dizer que não esqueci do *inverter()*. Qual será o valor de *particulasInvertidas[-1]*?',
    type: 'selection',
    answer: 'Elétron',
    options: ['Elétron', 'Nêutron', 'Próton', 'Quarks'],
    picture: 'panda-fazendo-coracao.jpg',
  },
]
