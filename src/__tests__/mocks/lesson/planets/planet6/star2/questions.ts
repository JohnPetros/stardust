import {
  CheckboxQuestion,
  DragAndDropQuestion,
  SelectionQuestion,
} from '@/@types/quiz'

type Questions = [
  CheckboxQuestion,
  DragAndDropQuestion,
  DragAndDropQuestion,
  SelectionQuestion,
  SelectionQuestion,
]

export const questions: Questions = [
  {
    title:
      'Parece que adicionamos um item a mais no carrinho. Quais são os métodos para deletar um item de um vetor?',
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
    title:
      'Já estava esquecendo de levar pilhas para lanterna. Complete o código com os métodos adequados, de modo que o resultado estejamos levando apenas `2`.',
    type: 'drag-and-drop',
    lines: [
      {
        id: 1,
        texts: ['var pilhas = ["Pilha AA", "Pilha AA", "Pilha AA"]'],
        indentation: 0,
      },
      { id: 2, texts: ['aliens.', 'dropZone', '("Pilha AA")'], indentation: 0 },
      { id: 3, texts: ['escreva(aliens.', 'dropZone', '( ))'], indentation: 0 },
    ],
    dragItems: [
      { id: 1, label: 'adicionar' },
      { id: 2, label: 'tamanho' },
      { id: 3, label: 'remover' },
      { id: 4, label: '2' },
    ],
    correctDragItemsIdsSequence: [3, 2],
    picture: 'panda-rindo-deitado.jpg',
  },
  {
    title:
      'Com certeza precisaremos de boas marcas de casaco. Complete o código abaixo, de modo que seja escrito nessa ordem: \n"NebulaShield, PolarProtec"',
    type: 'drag-and-drop',
    lines: [
      { id: 1, texts: ['var armas = ['], indentation: 0 },
      { id: 2, texts: ['dropZone'], indentation: 2 },
      { id: 3, texts: ['dropZone'], indentation: 2 },
      { id: 4, texts: [']'], indentation: 0 },
      { id: 5, texts: ['armas.removerPrimeiro()'], indentation: 0 },
      { id: 6, texts: ['armas.adicionar(', 'dropZone', ')'], indentation: 0 },
      { id: 7, texts: ['escreva(armas)'], indentation: 0 },
    ],
    dragItems: [
      { id: 1, label: 'FrostGuard' },
      { id: 2, label: 'NebulaShield' },
      { id: 3, label: 'PolarProtec' },
    ],
    correctDragItemsIdsSequence: [1, 2, 3],
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
    title:
      'Lembrei que sou alérgico alguns peixes, então precisaremos removê-los. Qual será o tamanho do vetor peixes?',
    type: 'selection',
    answer: '2',
    options: ['2', '0', '4', '6'],
    picture: 'panda-triste.jpg',
  },
  {
    code: `var carteira = [2, 100, 50, 20]
    
numeros.remover(100)
numeros.adicionar(10)`,
    title:
      'Paguei a conta e recebi troco. Em qual ordem ficará das notas no vetor `carteira`?',
    type: 'selection',
    answer: '2, 50, 20, 10',
    options: [
      '20, 100, 50, 2',
      '2, 50, 20, 10',
      '2, 100, 50, 20, 10',
      '2, 20, 50, 10',
    ],
    picture: 'panda-sorrindo.jpg',
  },
]
