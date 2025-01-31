import type {
  DragAndDropQuestionDto,
  SelectionQuestionDto,
  OpenQuestionDto,
  CheckboxQuestionDto,
} from '@stardust/core/lesson/dtos'

type Questions = [
  DragAndDropQuestionDto,
  CheckboxQuestionDto,
  DragAndDropQuestionDto,
  OpenQuestionDto,
  SelectionQuestionDto,
]

export const questions: Questions = [
  {
    stem: 'Podemos tentar concertar o radar removendo as peças defeituosas. Complete o *encaixar()* para que a variável *pecas* tenha somente as seguintes peças: Display e Antena.',
    type: 'drag-and-drop',
    lines: [
      { number: 1, texts: ['var partes = ['], indentation: 0 },
      { number: 2, texts: ['"Display",'], indentation: 2 },
      { number: 3, texts: ['"Antena",'], indentation: 2 },
      { number: 4, texts: ['"Transmissor",'], indentation: 2 },
      { number: 5, texts: ['"Receptor"'], indentation: 2 },
      { number: 6, texts: [']'], indentation: 0 },
      {
        number: 7,
        texts: ['var pecas = ', 'partes.encaixar', '(', 'dropZone', ',', 'dropZone', ')'],
        indentation: 0,
      },
      { number: 8, texts: ['escreva(pecas)'], indentation: 0 },
    ],
    items: [
      { index: 1, label: '0' },
      { index: 2, label: '1' },
      { index: 3, label: '3' },
      { index: 4, label: '4' },
      { index: 5, label: '2' },
    ],
    correctItemsIndexesSequence: [1, 5],
    picture: 'panda-piscando.jpg',
  },
  {
    code: `var elementos = ['Oscilador', 'Circuito', 'Modulador', 'Refrigerador']

var elementosRemovidos = elementos.encaixar(1)`,
    stem: 'Estou removendo alguns elementos que compõem o transmissor do radar usando o método *encaixar()*. Quais elementos são estes?',
    type: 'checkbox',
    options: ['Oscilador', 'Modulador', 'Circuito', 'Refrigerador'],
    correctOptions: ['Circuito', 'Modulador', 'Refrigerador'],
    picture: 'panda-piscando.jpg',
  },
  {
    stem: 'Será necessário substituir o receptor do radar por um novo. Adicione o valor "Novo receptor" na posição 2 na lista *pecas*',
    type: 'drag-and-drop',
    lines: [
      { number: 1, texts: ['var pecas = ['], indentation: 0 },
      { number: 2, texts: ['"Receptor",'], indentation: 2 },
      { number: 3, texts: ['"Antena",'], indentation: 2 },
      { number: 4, texts: ['"Transmissor"'], indentation: 2 },
      { number: 6, texts: [']'], indentation: 0 },
      {
        number: 7,
        texts: ['pecas.encaixar', '(', 'dropZone', ',', 'dropZone', ',', 'dropZone', ')'],
        indentation: 0,
      },
    ],
    items: [
      { index: 1, label: '2' },
      { index: 2, label: '1' },
      { index: 3, label: '"Novo receptor"' },
    ],
    correctItemsIndexesSequence: [1, 2, 3],
    picture: 'panda-piscando.jpg',
  },
  {
    code: 'var pilhas = ["AAA", "AA", "AA"]\n escreva(pilhas.encaixar())',
    stem: 'Devemos também trocar as pilhas. Precisaremos apenas do tipo "AA". Qual o único número que seria necessário colocar no *encaixar()* para pegar os dois últimos itens da lista *pilhas*?',
    type: 'open',
    lines: [
      {
        number: 1,
        texts: ['var itens = ["AAA", "AA", "AA"]'],
        indentation: 0,
      },

      {
        number: 2,
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
    stem: 'Talvez a pessoa que enviou a mensagem esteja entre nossos contatos. Qual contato estará na posição zero da lista *contatos*?',
    type: 'selection',
    answer: 'Jabba',
    options: ['Darth Vader', 'Kylo Ren', 'Boba Fett', 'Jabba'],
    picture: 'panda-olhando-computador.jpg',
  },
]
