import {
  CheckboxQuestion,
  DragAndDropQuestion,
  OpenQuestion,
  SelectionQuestion,
} from '@/@types/Quiz'

type Questions = [
  CheckboxQuestion,
  DragAndDropQuestion,
  OpenQuestion,
  SelectionQuestion,
  DragAndDropQuestion,
]

export const questions: Questions = [
  {
    title: 'Quais dos valores abaixo pode ser um tipo de texto válido?',
    type: 'checkbox',
    options: ['letra', '"não é um texto"', '"100"', '2.5'],
    correctOptions: ['"não é um texto"', '"100"'],
    picture: 'panda-piscando.jpg',
  },
  {
    title: 'Complete o código para que ele escreva a data corretamente',
    type: 'drag-and-drop',
    lines: [
      { id: 1, texts: ['var ', 'dropZone', '= "01/03/2023"'], indentation: 0 },
      {
        id: 2,
        texts: ['escreva("mensagem enviada em "', 'dropZone', '", de nada")'],
        indentation: 0,
      },
    ],
    picture: 'panda-sorrindo.jpg',
    dragItems: [
      { id: 1, label: '"data"' },
      { id: 2, label: '+ data +' },
      { id: 3, label: '- data -' },
      { id: 4, label: 'data' },
    ],
    correctDragItemsIdsSequence: [4, 2],
  },

  {
    title:
      'Se eu já tenho um texto usando aspas duplas, que tipo de aspas você terá que colocar dentro desse texto?',
    type: 'open',
    lines: [
      {
        id: 1,
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
    title: 'Qual será o resultado do seguinte código?',
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
    title: 'Faça a *interpolação* de textos da maneira apropriada.',
    picture: 'panda-sorrindo.jpg',
    type: 'drag-and-drop',
    lines: [
      { id: 1, texts: ['var mensagem = "Olá, mundo!"'], indentation: 0 },
      {
        id: 2,
        texts: ['escreva("a mensagem ', 'dropZone', ' não foi entendida")'],
        indentation: 0,
      },
    ],
    dragItems: [
      { id: 1, label: 'mensagem' },
      { id: 2, label: '+ mensagem +' },
      { id: 3, label: '${mensagem}' },
      { id: 4, label: "'Olá, mundo!'" },
    ],
    correctDragItemsIdsSequence: [3],
  },
]
