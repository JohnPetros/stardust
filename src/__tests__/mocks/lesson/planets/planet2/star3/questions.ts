import {
  CheckboxQuestion,
  DragAndDropQuestion,
  OpenQuestion,
  SelectionQuestion,
} from '@/@types/quiz'

type Questions = [
  CheckboxQuestion,
  SelectionQuestion,
  SelectionQuestion,
  DragAndDropQuestion,
  OpenQuestion,
]

export const questions: Questions = [
  {
    title: 'Quais os valores possíveis para uma variável do tipo lógico?',
    type: 'checkbox',
    options: ['falso', 'verdadeiro', 'nulo', '"verdadeiro"'],
    correctOptions: ['falso', 'verdadeiro'],
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    title: 'Qual é o valor padrão de uma variável sem valor atribuído a ela?',
    type: 'selection',
    answer: 'nulo',
    options: ['falso', 'verdadeiro', 'nulo', 'falso e nulo'],
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    title: 'Qual será o resultado do seguinte código?',
    code: `var resposta = verdadeiro
resposta = falso
escreva("Vai chover asteroide hoje? " + resposta)   
`,
    type: 'selection',
    answer: 'Vai chover asteroide hoje? falso',
    options: [
      'Vai chover asteroide hoje? falso',
      'Vai chover asteroide hoje? verdadeiro',
      'falso',
      'verdadeiro',
    ],
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    title:
      'Complete o código para que a resposta seja coerente com a afirmação.',
    picture: 'panda-andando-com-bambu.jpg',
    type: 'drag-and-drop',
    lines: [
      { id: 1, texts: ['var resposta = ', 'dropZone'], indentation: 0 },
      {
        id: 2,
        texts: ['escreva("A terra é plana e não redonda: ")'],
        indentation: 0,
      },
      { id: 3, texts: ['escreva(', 'dropZone', ')'], indentation: 0 },
    ],
    dragItems: [
      { id: 1, label: 'verdadeiro' },
      { id: 2, label: 'falso' },
      { id: 3, label: 'nulo' },
      { id: 4, label: 'resposta' },
    ],
    correctDragItemsIdsSequence: [2, 4],
  },
  {
    title: 'Qual seria o valor lógico para a pergunta "10 é maior que 5?"',
    type: 'open',
    lines: [
      {
        id: 1,
        texts: ['input-1'],
        indentation: 0,
      },
    ],
    answers: ['verdadeiro'],
    picture: 'panda-rindo-deitado.jpg',
  },
]
