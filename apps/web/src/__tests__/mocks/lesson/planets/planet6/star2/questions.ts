import type {
  DragAndDropQuestionDto,
  SelectionQuestionDto,
  CheckboxQuestionDto,
} from '@stardust/core/lesson/dtos'

type Questions = [
  CheckboxQuestionDto,
  DragAndDropQuestionDto,
  DragAndDropQuestionDto,
  SelectionQuestionDto,
  SelectionQuestionDto,
]

export const questions: Questions = [
  {
    stem: 'Parece que adicionamos um item a mais no carrinho. Quais são os métodos para deletar um item de uma lista?',
    type: 'checkbox',
    options: [
      'deletar()',
      'remover()',
      'removerPrimeiro()',
      'removerUltimo()',
      'removerSegundo()',
    ],
    correctOptions: ['remover()', 'removerPrimeiro()', 'removerUltimo()'],
    picture: 'panda.jpg',
  },
  {
    stem: 'Já estava esquecendo de levar pilhas para lanterna. Complete o código com os métodos adequados, de modo que estejamos sempre levando apenas duas, ou seja, o programa deve escrever 2 no final.',
    type: 'drag-and-drop',
    lines: [
      {
        number: 1,
        texts: ['var pilhas = ["Pilha AA", "Pilha AA", "Pilha AA"]'],
        indentation: 0,
      },
      { number: 2, texts: ['pilhas.', 'dropZone', '("Pilha AA")'], indentation: 0 },
      { number: 3, texts: ['escreva(pilhas.', 'dropZone', '())'], indentation: 0 },
    ],
    items: [
      { index: 1, label: 'adicionar' },
      { index: 2, label: 'tamanho' },
      { index: 3, label: 'remover' },
      { index: 4, label: '2' },
    ],
    correctItemsIndexesSequence: [3, 2],
    picture: 'panda-rindo-deitado.jpg',
  },
  {
    stem: 'Com certeza precisaremos de boas marcas de casaco. Complete o código abaixo, de modo que seja escrito nessa ordem: "NebulaShield, PolarProtec".',
    type: 'drag-and-drop',
    lines: [
      { number: 1, texts: ['var armas = ['], indentation: 0 },
      { number: 2, texts: ['dropZone'], indentation: 2 },
      { number: 3, texts: ['dropZone'], indentation: 2 },
      { number: 4, texts: [']'], indentation: 0 },
      { number: 5, texts: ['armas.removerPrimeiro()'], indentation: 0 },
      { number: 6, texts: ['armas.adicionar(', 'dropZone', ')'], indentation: 0 },
      { number: 7, texts: ['escreva(armas)'], indentation: 0 },
    ],
    items: [
      { index: 1, label: 'FrostGuard' },
      { index: 2, label: 'NebulaShield' },
      { index: 3, label: 'PolarProtec' },
    ],
    correctItemsIndexesSequence: [1, 2, 3],
    picture: 'panda-piscando.jpg',
  },
  {
    code: `var peixes = [
    "Alderaan", 
    "Merfolk", 
    "Vulcan", 
]

peixes.removerPrimeiro()
peixes.removerUltimo()
peixes.adicionar("Taris")

escreva(peixes)
    `,
    stem: 'Lembrei que sou alérgico a alguns tipos de peixe, então precisaremos removê-los. Qual será o tamanho da lista *peixes*?',
    type: 'selection',
    answer: '2',
    options: ['2', '0', '4', '6'],
    picture: 'panda-triste.jpg',
  },
  {
    code: `var carteira = [2, 100, 50, 20]
    
numeros.remover(100)
numeros.adicionar(10)`,
    stem: 'Paguei a conta e recebi troco. Em qual ordem ficará das notas na lista *carteira*?',
    type: 'selection',
    answer: '2, 50, 20, 10',
    options: ['20, 100, 50, 2', '2, 50, 20, 10', '2, 100, 50, 20, 10', '2, 20, 50, 10'],
    picture: 'panda-sorrindo.jpg',
  },
]
