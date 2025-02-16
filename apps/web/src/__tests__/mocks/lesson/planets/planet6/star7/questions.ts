import type {
  DragAndDropQuestionDto,
  SelectionQuestionDto,
  CheckboxQuestionDto,
} from '@stardust/core/lesson/dtos'

type Questions = [
  DragAndDropQuestionDto,
  CheckboxQuestionDto,
  DragAndDropQuestionDto,
  SelectionQuestionDto,
  DragAndDropQuestionDto,
]

export const questions: Questions = [
  {
    stem: 'Ok, dessa vez mandaremos nossas localização de forma mais detalhada. Primeiro Complete o subtexto para que a variável primeiraPalavra seja igual a "UNIVERSO 7" em maiúsculo',
    type: 'drag-and-drop',
    lines: [
      {
        number: 1,
        texts: ['var localizacao = "Universo 7 da dimensão y"'],
        indentation: 0,
      },
      {
        number: 2,
        texts: [
          'var primeiraPalavra = ',
          'localizacao.subtexto',
          '(',
          'dropZone',
          ',',
          'dropZone',
          ')',
        ],
        indentation: 0,
      },
      {
        number: 3,
        texts: ['escreva(primeiraPalavra.', 'dropZone', '( ))'],
        indentation: 0,
      },
    ],
    items: [
      { index: 1, label: 'maiusculo' },
      { index: 2, label: 'minusculo' },
      { index: 3, label: '0' },
      { index: 4, label: '10' },
      { index: 5, label: '7' },
    ],
    correctItems: ['0', '10', 'maiusculo'],
    picture: 'panda-com-raiva.jpg',
  },
  {
    code: `var galaxia = "Setral"
var abreviacao = galaxia.subtexto(2, 4)

escreva(abreviacao.maiusculo())`,
    stem: 'Agora peguemos o nome da galáxia em que estamos de forma abreviada. Quais letras da palavra "Setral" estarão contidas na variável *caracteres*?',
    type: 'checkbox',
    options: ['E', 'S', 'T', 'R'],
    correctOptions: ['T', 'R'],
    picture: 'panda-fazendo-coracao.jpg',
  },
  {
    stem: 'Como disse antes, o planeta em que estamos se chama Arrayon e não Matrizion, logo complete o código para o resultado seja igual a falso.',
    type: 'drag-and-drop',
    lines: [
      {
        number: 1,
        texts: ['var planeta = "Planeta: Matrizion"'],
        indentation: 0,
      },
      {
        number: 2,
        texts: [
          'var planeta = ',
          'planeta.',
          'dropZone',
          '(',
          'dropZone',
          ',',
          'dropZone',
          ')',
        ],
        indentation: 0,
      },
      {
        number: 3,
        texts: ['escreva(planeta.inclui("Matrizion"))'],
        indentation: 0,
      },
    ],
    items: [
      { index: 1, label: '"Matrizion"' },
      { index: 2, label: 'remover' },
      { index: 3, label: 'substituir' },
      { index: 4, label: '"Arrayon"' },
    ],
    correctItems: ['substituir', '"Matrizion"', '"Arrayon"'],
    picture: 'panda-confuso.jpg',
  },
  {
    stem: 'Agora peguemos o hemisfério em que estamos. Qual é de acordo com o código abaixo?',
    code: `var frase = "O Sul é mais frio que o Norte"

var novaFrase = frase.maiusculo()
var hemisferio = novaFrase.subtexto(2, 5)

escreva(hemisferio)`,
    type: 'selection',
    answer: 'SUL',
    options: ['Sul', 'SUL', 'sul', 'norte'],
    picture: 'panda-sorrindo.jpg',
  },
  {
    stem: 'A mensagem em si não pode ter espaços desnecessários. Complete o código para que o tamanho da variável *mensagem* permaneça igual a *25*, ou seja, que o código resulte em *25*.',
    type: 'drag-and-drop',
    lines: [
      {
        number: 1,
        texts: ['var mensagemAtual = "   UNIVERSO 7 - TR - Arrayon - SUL  "'],
        indentation: 0,
      },
      {
        number: 2,
        texts: ['var mensagem = mensagemAtual.', 'dropZone', '( )'],
        indentation: 0,
      },
      {
        number: 3,
        texts: ['escreva(mensagem.', 'dropZone', '( ))'],
        indentation: 0,
      },
    ],
    items: [
      { index: 1, label: 'aparar' },
      { index: 2, label: 'dividir' },
      { index: 3, label: 'subtexto' },
      { index: 4, label: 'tamanho' },
      { index: 5, label: 'fatiar' },
    ],
    correctItems: ['aparar', 'tamanho'],
    picture: 'panda-com-raiva.jpg',
  },
]
