import {
  DragAndDropListQuestion,
  DragAndDropQuestion,
  OpenQuestion,
  SelectionQuestion,
} from '@/@types/Quiz'

type Questions = [
  SelectionQuestion,
  OpenQuestion,
  SelectionQuestion,
  DragAndDropListQuestion,
  DragAndDropQuestion,
]

export const questions: Questions = [
  {
    title:
      'Vamos verificar se está tudo bem com as peças do foguete. Primeiro, Qual será o resultado da variável `energia`?',
    code: `var energia = 100

fazer { 
  energia -= 10
} enquanto (energia > 1000)`,
    type: 'selection',
    answer: '90',
    options: ['0', '90', '100', '1000'],
    picture: 'panda-comemorando.jpg',
  },
  {
    title:
      'Quero verificar apenas as peças com códigos pares. Qual o nome da instrução que permite pular uma iteração?',
    type: 'open',
    lines: [
      {
        id: 1,
        texts: ['enquanto', '(totalPecas > 0) {'],
        indentation: 0,
      },
      {
        id: 2,
        texts: ['se (codigo % 2 == 0) {'],
        indentation: 2,
      },
      {
        id: 2,
        texts: ['input-1'],
        indentation: 4,
      },
      {
        id: 3,
        texts: ['}'],
        indentation: 2,
      },
      {
        id: 4,
        texts: ['totalPecas--'],
        indentation: 2,
      },
      {
        id: 5,
        texts: ['}'],
        indentation: 0,
      },
    ],
    answers: ['continua'],
    picture: 'panda-triste.jpg',
  },
  {
    title: 'Agora o nível de oxigênio. Quantas vezes esse laço será executado?',
    code: `var nivelOxigenio = 100

fazer {
  escreva("O oxigênio está em " + nivelOxigenio + "%")

} enquanto (nivelOxigenio < 100)`,
    type: 'selection',
    answer: '1',
    options: ['10', '100', '1', 'infinitamente'],
    picture: 'panda-de-oculos.jpg',
  },
  {
    title:
      'Reordene o laço para que o programa escreva a mensagem "Esse foguete tem 4 estrelas funcionando".',
    type: 'drag-and-drop-list',
    items: [
      { id: 1, label: 'var num = 1' },
      { id: 2, label: 'fazer {' },
      {
        id: 3,
        label: '    escreva(`Esse foguete tem ${num} turbinas funcionando.`)',
      },
      { id: 4, label: '    num++' },
      { id: 5, label: '} enquanto (numero < 4)' },
    ],
    picture: 'panda-exercitando.jpg',
  },
  {
    title:
      'Complete o laço, de modo que a temperatura do foguete seja igual a 25',
    type: 'drag-and-drop',
    lines: [
      { id: 1, texts: ['var temperatura = 50'], indentation: 0 },
      { id: 2, texts: ['dropZone', '{'], indentation: 0 },
      {
        id: 3,
        texts: ['se (temperatura == ', 'dropZone', ') {'],
        indentation: 2,
      },
      { id: 4, texts: ['dropZone'], indentation: 4 },
      { id: 5, texts: ['}'], indentation: 2 },
      { id: 6, texts: ['temperatura -= 5'], indentation: 2 },
      { id: 7, texts: ['} enquanto (temperatura != 25)'], indentation: 0 },
      {
        id: 8,
        texts: ['escreva("A temperatura está no nível ideal, que é 25")'],
        indentation: 0,
      },
    ],
    dragItems: [
      { id: 1, label: 'fazer' },
      { id: 2, label: 'enquanto' },
      { id: 3, label: 'pausa' },
      { id: 4, label: 'continua' },
      { id: 5, label: '50' },
      { id: 6, label: '25' },
    ],
    correctDragItemsIdsSequence: [1, 6, 3],
    picture: 'panda-abracando-bambu.jpg',
  },
]
