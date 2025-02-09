import type {
  CheckboxQuestionDto,
  DragAndDropQuestionDto,
  OpenQuestionDto,
  SelectionQuestionDto,
} from '@stardust/core/lesson/dtos'

type Questions = [
  CheckboxQuestionDto,
  DragAndDropQuestionDto,
  OpenQuestionDto,
  SelectionQuestionDto,
  DragAndDropQuestionDto,
]

export const questions: Questions = [
  {
    stem: 'Quais dos valores abaixo pode ser um tipo de texto válido?',
    type: 'checkbox',
    options: ['letra', '"não é um texto"', '"100"', '2.5'],
    correctOptions: ['"não é um texto"', '"100"'],
    picture: 'panda-piscando.jpg',
  },
  {
    stem: 'Complete o código para que ele escreva a data corretamente',
    type: 'drag-and-drop',
    lines: [
      { number: 1, texts: ['var ', 'dropZone', '= "01/03/2023"'], indentation: 0 },
      {
        number: 2,
        texts: ['escreva("mensagem enviada em "', 'dropZone', '", de nada")'],
        indentation: 0,
      },
    ],
    picture: 'panda-sorrindo.jpg',
    items: [
      { index: 1, label: '"data"' },
      { index: 2, label: '+ data +' },
      { index: 3, label: '- data -' },
      { index: 4, label: 'data' },
    ],
    correctItems: ['data', '+ data +'],
  },

  {
    stem: 'Se eu já tenho um texto usando aspas duplas, que tipo de aspas você terá que colocar dentro desse texto?',
    type: 'open',
    lines: [
      {
        number: 1,
        texts: [
          'escreva("Recebi aquele',
          'input-1',
          'pacote',
          'input-2',
          ', o qual falamos")',
        ],
        indentation: 0,
      },
    ],
    answers: ["'", "'"],
    picture: 'panda.jpg',
  },

  {
    stem: 'Qual será a saída do seguinte código?',
    code: `var cor = "vermelha"
var nome = "Datahon"
var nome = "Planeta " + nome

escreva(nome + " tem a cor " + cor)`,
    type: 'selection',
    options: [
      'Planeta Datahon tem a cor vermelha',
      'Planeta Datahon tem a cor azul',
      'Datahon tem a cor vermelha',
      'Planeta tem a cor vermelha',
    ],
    answer: 'Planeta Datahon tem a cor vermelha',
    picture: 'panda-sorrindo.jpg',
  },
  {
    stem: 'Faça a *interpolação* de textos da maneira apropriada.',
    picture: 'panda-sorrindo.jpg',
    type: 'drag-and-drop',
    lines: [
      { number: 1, texts: ['var mensagem = "Olá, mundo!"'], indentation: 0 },
      {
        number: 2,
        texts: ['escreva("a mensagem ', 'dropZone', ' não foi entendida")'],
        indentation: 0,
      },
    ],
    items: [
      { index: 1, label: 'mensagem' },
      { index: 2, label: '+ mensagem +' },
      { index: 3, label: '${mensagem}' },
      { index: 4, label: "'Olá, mundo!'" },
    ],
    correctItems: ['${mensagem}'],
  },
]
