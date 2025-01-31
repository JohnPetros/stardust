import type {
  DragAndDropListQuestionDto,
  DragAndDropQuestionDto,
  OpenQuestionDto,
  SelectionQuestionDto,
} from '@stardust/core/lesson/dtos'

type Questions = [
  OpenQuestionDto,
  SelectionQuestionDto,
  OpenQuestionDto,
  DragAndDropListQuestionDto,
  DragAndDropQuestionDto,
]

export const questions: Questions = [
  {
    stem: 'Vamos montar nosso primeiro programa! Mas, para ver se estamos na mesma página, escreva abaixo o nome do comando que serve para exibir dados na tela.',
    type: 'open',
    lines: [
      {
        number: 1,
        texts: ['input-1', '()'],
        indentation: 0,
      },
    ],
    answers: ['escreva'],
    picture: 'panda.jpg',
  },
  {
    stem: 'Muito bem! E qual das opções abaixo escreverá adequadamente `que horas são`?',
    picture: 'panda-piscando.jpg',
    type: 'selection',
    answer: 'escreva("que horas são")',
    options: [
      'escreva(que horas são)',
      'imprima("que horas são")',
      'escreva("que horas são")',
      'escreva("14:52am")',
    ],
  },
  {
    stem: 'Isso! Agora insira abaixo o nome do comando que serve para receber dados externos a um programa.',
    type: 'open',
    lines: [
      {
        number: 1,
        texts: ['input-1', '()'],
        indentation: 0,
      },
    ],
    answers: ['leia'],
    picture: 'panda.jpg',
  },
  {
    stem: 'Agora organize o código abaixo para que ele fique na ordem correta. Dica: as variáveis devem começar no início.',
    type: 'drag-and-drop-list',
    items: [
      { position: 1, label: 'var mensagem' },
      { position: 2, label: 'mensagem = leia()' },
      { position: 3, label: 'escreva(mensagem)' },
    ],
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    stem: 'Agora preencha os espaços do código abaixo com os comandos que faltam. (Clique no bloco ou segure e arraste até o espaço vazio correspondente)',
    type: 'drag-and-drop',
    lines: [
      { number: 1, texts: ['var nomeDoFoguete = ', 'dropZone'], indentation: 0 },
      { number: 2, texts: ['dropZone', '(nomeDoFoguete)'], indentation: 0 },
    ],
    picture: 'panda-sorrindo.jpg',
    items: [
      { index: 1, label: 'receba' },
      { index: 2, label: 'escreva' },
      { index: 3, label: 'leia( )' },
      { index: 4, label: 'leia' },
    ],
    correctItemsIndexesSequence: [3, 2],
  },
]
