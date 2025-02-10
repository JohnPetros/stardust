import type {
  CheckboxQuestionDto,
  DragAndDropQuestionDto,
  SelectionQuestionDto,
} from '@stardust/core/lesson/dtos'

type Questions = [
  SelectionQuestionDto,
  CheckboxQuestionDto,
  CheckboxQuestionDto,
  CheckboxQuestionDto,
  DragAndDropQuestionDto,
]

export const questions: Questions = [
  {
    type: 'selection',
    stem: 'Vamos treinar as funções nativas para não esquecermos o que acabamos de aprender. Primeiro a função *texto*. Qual será o resultado desse código?',
    code: `var numero = texto(22)
    
escreva(22 + numero)`,
    options: ['44', '"2222"', '22', '"2244"'],
    answer: '"2222"',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'checkbox',
    stem: 'Quais os possíveis números podem ser retornados pelo "aleatorioEntre(1, 4)"?',
    options: ['1', '2', '3', '4'],
    correctOptions: ['1', '2', '3'],
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'checkbox',
    stem: 'Quais funções nativas posso utilizar para converter um valor em um número?',
    options: ['texto()', 'numero()', 'inteiro()', 'real()'],
    correctOptions: ['inteiro()', 'real()'],
    picture: 'panda-sorrindo.jpg',
  },
  {
    type: 'checkbox',
    stem: 'Quais os dados abaixo podem ser convertidos para número?',
    options: ['"24"', 'verdadeiro', '"9999"', '[42]'],
    correctOptions: ['"24"', '"9999"'],
    picture: 'panda.jpg',
  },
  {
    type: 'drag-and-drop',
    stem: 'Complete o código para que seja retornado um texto.',
    lines: [
      {
        number: 1,
        texts: ['funcao converterEmTexto(dado) {'],
        indentation: 0,
      },
      {
        number: 2,
        texts: ['retorna ', 'dropZone', '(dado)'],
        indentation: 2,
      },
      {
        number: 3,
        texts: ['}'],
        indentation: 0,
      },
      {
        number: 4,
        texts: ['converterEmTexto(', 'dropZone', ');'],
        indentation: 0,
      },
    ],
    items: [
      {
        index: 1,
        label: '500',
      },
      {
        index: 2,
        label: 'texto',
      },
      {
        index: 3,
        label: 'inteiro',
      },
      {
        index: 4,
        label: 'real',
      },
    ],
    correctItems: [2, 1],
    picture: 'panda-deslumbrado.jpg',
  },
]
