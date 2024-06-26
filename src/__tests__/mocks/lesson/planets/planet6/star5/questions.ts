import {
  CheckboxQuestion,
  DragAndDropQuestion,
  OpenQuestion,
  SelectionQuestion,
} from '@/@types/Quiz'

type Questions = [
  DragAndDropQuestion,
  CheckboxQuestion,
  DragAndDropQuestion,
  OpenQuestion,
  SelectionQuestion,
]

export const questions: Questions = [
  {
    title:
      'Podemos tentar concertar o radar removendo as peças defeituosas. Complete o *encaixar()* para que a variável *pecas* tenha somente as seguintes peças: Display e Antena.',
    type: 'drag-and-drop',
    lines: [
      { id: 1, texts: ['var partes = ['], indentation: 0 },
      { id: 2, texts: ['"Display",'], indentation: 2 },
      { id: 3, texts: ['"Antena",'], indentation: 2 },
      { id: 4, texts: ['"Transmissor",'], indentation: 2 },
      { id: 5, texts: ['"Receptor"'], indentation: 2 },
      { id: 6, texts: [']'], indentation: 0 },
      {
        id: 7,
        texts: [
          'var pecas = ',
          'partes.encaixar',
          '(',
          'dropZone',
          ',',
          'dropZone',
          ')',
        ],
        indentation: 0,
      },
      { id: 8, texts: ['escreva(pecas)'], indentation: 0 },
    ],
    dragItems: [
      { id: 1, label: '0' },
      { id: 2, label: '1' },
      { id: 3, label: '3' },
      { id: 4, label: '4' },
      { id: 5, label: '2' },
    ],
    correctDragItemsIdsSequence: [1, 5],
    picture: 'panda-piscando.jpg',
  },
  {
    code: `var elementos = ['Oscilador', 'Circuito', 'Modulador', 'Refrigerador']

var elementosRemovidos = elementos.encaixar(1)`,
    title:
      'Estou removendo alguns elementos que compõem o transmissor do radar usando o método *encaixar()*. Quais elementos são estes?',
    type: 'checkbox',
    options: ['Oscilador', 'Modulador', 'Circuito', 'Refrigerador'],
    correctOptions: ['Circuito', 'Modulador', 'Refrigerador'],
    picture: 'panda-piscando.jpg',
  },
  {
    title:
      'Será necessário substituir o receptor do radar por um novo. Adicione o valor "Novo receptor" na posição 2 na lista *pecas*',
    type: 'drag-and-drop',
    lines: [
      { id: 1, texts: ['var pecas = ['], indentation: 0 },
      { id: 2, texts: ['"Receptor",'], indentation: 2 },
      { id: 3, texts: ['"Antena",'], indentation: 2 },
      { id: 4, texts: ['"Transmissor"'], indentation: 2 },
      { id: 6, texts: [']'], indentation: 0 },
      {
        id: 7,
        texts: [
          'pecas.encaixar',
          '(',
          'dropZone',
          ',',
          'dropZone',
          ',',
          'dropZone',
          ')',
        ],
        indentation: 0,
      },
    ],
    dragItems: [
      { id: 1, label: '2' },
      { id: 2, label: '1' },
      { id: 3, label: '"Novo receptor"' },
    ],
    correctDragItemsIdsSequence: [1, 2, 3],
    picture: 'panda-piscando.jpg',
  },
  {
    code: 'var pilhas = ["AAA", "AA", "AA"]\n escreva(pilhas.encaixar())',
    title:
      'Devemos também trocar as pilhas. Precisaremos apenas do tipo "AA". Qual o único número que seria necessário colocar no *encaixar()* para pegar os dois últimos itens da lista *pilhas*?',
    type: 'open',
    lines: [
      {
        id: 1,
        texts: ['var itens = ["AAA", "AA", "AA"]'],
        indentation: 0,
      },

      {
        id: 2,
        texts: ['escreva(pilhas.encaixar(', 'input-1', ')'],
        indentation: 0,
      },
    ],
    answers: ['1'],
    picture: 'panda-com-mochila.jpg',
  },
  {
    code: `var contatos = ["Darth Vader", "Kylo Ren", "Boba Fett", "Jabba"]

contatos.encaixar(0, 3);
escreva(contatos[0])`,
    title:
      'Talvez a pessoa que enviou a mensagem esteja entre nossos contatos. Qual contato estará na posição zero da lista *contatos*?',
    type: 'selection',
    answer: 'Jabba',
    options: ['Darth Vader', 'Kylo Ren', 'Boba Fett', 'Jabba'],
    picture: 'panda-olhando-computador.jpg',
  },
]
