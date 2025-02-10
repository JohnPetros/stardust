import type {
  CheckboxQuestionDto,
  SelectionQuestionDto,
  DragAndDropQuestionDto,
  OpenQuestionDto,
} from '@stardust/core/lesson/dtos'

type Questions = [
  CheckboxQuestionDto,
  SelectionQuestionDto,
  SelectionQuestionDto,
  DragAndDropQuestionDto,
  OpenQuestionDto,
]

export const questions: Questions = [
  {
    stem: 'Quais os valores possíveis para uma variável do tipo lógico?',
    type: 'checkbox',
    options: ['falso', 'verdadeiro', 'nulo', '"verdadeiro"'],
    correctOptions: ['falso', 'verdadeiro'],
    picture: 'panda-olhando-de-lado.jpg',
  },
  {
    stem: 'Qual é o valor padrão de uma variável sem valor atribuído a ela?',
    type: 'selection',
    answer: 'nulo',
    options: ['falso', 'verdadeiro', 'nulo', 'falso e nulo'],
    picture: 'panda-piscando-sentado.jpg',
  },
  {
    stem: 'Qual será a saída do seguinte código?',
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
    stem: 'Complete o código para que a resposta seja coerente com a afirmação.',
    picture: 'panda-andando-com-bambu.jpg',
    type: 'drag-and-drop',
    lines: [
      { number: 1, texts: ['var resposta = ', 'dropZone'], indentation: 0 },
      {
        number: 2,
        texts: ['escreva("A terra é plana e não redonda: ")'],
        indentation: 0,
      },
      { number: 3, texts: ['escreva(', 'dropZone', ')'], indentation: 0 },
    ],
    items: [
      { index: 1, label: 'verdadeiro' },
      { index: 2, label: 'falso' },
      { index: 3, label: 'nulo' },
      { index: 4, label: 'resposta' },
    ],
    correctItems: [2, 4],
  },
  {
    stem: 'Qual seria o valor lógico para a pergunta "10 é maior que 5?"',
    type: 'open',
    lines: [
      {
        number: 1,
        texts: ['input-1'],
        indentation: 0,
      },
    ],
    answers: ['verdadeiro'],
    picture: 'panda-rindo-deitado.jpg',
  },
]
