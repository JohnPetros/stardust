import {
  DragAndDropListQuestion,
  DragAndDropQuestion,
  OpenQuestion,
  SelectionQuestion,
} from '@/@types/quiz'

type Questions = [
  OpenQuestion,
  SelectionQuestion,
  OpenQuestion,
  DragAndDropListQuestion,
  DragAndDropQuestion,
]

export const questions: Questions = [
  {
    title:
      'Vamos montar nosso primeiro programa! Mas, para ver se estamos na mesma página, escreva abaixo o nome do comando que serve para exibir dados na tela.',
    type: 'open',
    lines: [
      {
        id: 1,
        texts: ['input-1', '()'],
        indentation: 0,
      },
    ],
    answers: ['escreva'],
    picture: 'panda.jpg',
  },
  {
    title:
      'Muito bem! E qual das opções abaixo escreverá adequadamente `que horas são`?',
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
    title:
      'Isso! Agora insira abaixo o nome do comando que serve para receber dados externos a um programa.',
    type: 'open',
    lines: [
      {
        id: 1,
        texts: ['input-1', '()'],
        indentation: 0,
      },
    ],
    answers: ['leia'],
    picture: 'panda.jpg',
  },
  {
    title:
      'Agora organize o código abaixo para que ele fique na ordem correta. Dica: as variáveis devem começar no início.',
    type: 'drag-and-drop-list',
    items: [
      { id: 1, label: 'var mensagem' },
      { id: 2, label: 'mensagem = leia()' },
      { id: 3, label: 'escreva(mensagem)' },
    ],
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    title:
      'Agora preencha os espaços do código abaixo com os comandos que faltam. (Clique no bloco ou segure e arraste até o espaço vazio correspondente)',
    type: 'drag-and-drop',
    lines: [
      { id: 1, texts: ['var nomeDoFoguete = ', 'dropZone'], indentation: 0 },
      { id: 2, texts: ['dropZone', '(nomeDoFoguete)'], indentation: 0 },
    ],
    picture: 'panda-sorrindo.jpg',
    dragItems: [
      { id: 1, label: 'receba' },
      { id: 2, label: 'escreva' },
      { id: 3, label: 'leia( )' },
      { id: 4, label: 'leia' },
    ],
    correctDragItemsIdsSequence: [3, 2],
  },
]
