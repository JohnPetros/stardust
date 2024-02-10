import {
  CheckboxQuestion,
  DragAndDropQuestion,
  SelectionQuestion,
} from '@/@types/Quiz'

type Questions = [
  DragAndDropQuestion,
  CheckboxQuestion,
  DragAndDropQuestion,
  SelectionQuestion,
  DragAndDropQuestion,
]

export const questions: Questions = [
  {
    title:
      'Ok, dessa vez mandaremos nossas localização de forma mais detalhada. Primeiro Complete o subtexto para que a variável primeiraPalavra seja igual a "UNIVERSO 7" em maiúsculo',
    type: 'drag-and-drop',
    lines: [
      {
        id: 1,
        texts: ['var localizacao = "Universo 7 da dimensão y"'],
        indentation: 0,
      },
      {
        id: 2,
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
        id: 3,
        texts: ['escreva(primeiraPalavra.', 'dropZone', '( ))'],
        indentation: 0,
      },
    ],
    dragItems: [
      { id: 1, label: 'maiusculo' },
      { id: 2, label: 'minusculo' },
      { id: 3, label: '0' },
      { id: 4, label: '8' },
      { id: 5, label: '7' },
    ],
    correctDragItemsIdsSequence: [3, 4, 1],
    picture: 'panda-com-raiva.jpg',
  },
  {
    code: `var galaxia = "Setral"
var abreviacao = galaxia.subtexto(2, 4)

escreva(abreviacao.maiuscula)`,
    title:
      'Agora peguemos o nome da galáxia em que estamos abreviado. Quais letras da palavra "Setral" estarão contidas na variável `caracteres`?',
    type: 'checkbox',
    options: ['E', 'S', 'T', 'R'],
    correctOptions: ['T', 'R'],
    picture: 'panda-fazendo-coracao.jpg',
  },
  {
    title:
      'O planeta em que estamos se chama Arrayon e não Matrizion, logo complete o código para o resultado seja igual a falso.',
    type: 'drag-and-drop',
    lines: [
      {
        id: 1,
        texts: ['var planeta = "Planeta: Matrizion"'],
        indentation: 0,
      },
      {
        id: 2,
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
        id: 3,
        texts: ['escreva(planeta.inclui("Matrizion"))'],
        indentation: 0,
      },
    ],
    dragItems: [
      { id: 1, label: '"Marte"' },
      { id: 2, label: 'remover' },
      { id: 3, label: 'substituir' },
      { id: 4, label: '"Arrayon"' },
    ],
    correctDragItemsIdsSequence: [3, 1, 4],
    picture: 'panda-confuso.jpg',
  },
  {
    title:
      'Agora peguemos o hemisfério em que estamos. Qual é de acordo com o código abaixo?',
    code: `var frase = "Sul é mais frio que o Norte"

var novaFrase = frase.maiusculo()
var hemisferio = novaFrase.subtexto(0, 5)

escrever(hemisferio)`,
    type: 'selection',
    answer: 'SUL',
    options: ['Sul', 'SUL', 'sul', 'norte'],
    picture: 'panda-sorrindo.jpg',
  },
  {
    title:
      'A mensagem em si não pode ter espaços desnecessários. Complete o código para que o tamanho da variável `mensagem` permaneça igual a `25`, ou seja, que o código resulte em `25`.',
    type: 'drag-and-drop',
    lines: [
      {
        id: 1,
        texts: ['var mensagemAtual = "   UNIVERSO 7 - TR - Arrayon - SUL  "'],
        indentation: 0,
      },
      {
        id: 2,
        texts: ['var mensagem = mensagemAtual.', 'dropZone', '( )'],
        indentation: 0,
      },
      {
        id: 3,
        texts: ['escreva(mensagem.', 'dropZone', '( ))'],
        indentation: 0,
      },
    ],
    dragItems: [
      { id: 1, label: 'aparar' },
      { id: 2, label: 'dividir' },
      { id: 3, label: 'subtexto' },
      { id: 4, label: 'tamanho' },
      { id: 5, label: 'fatiar' },
    ],
    correctDragItemsIdsSequence: [1, 4],
    picture: 'panda-com-raiva.jpg',
  },
]
