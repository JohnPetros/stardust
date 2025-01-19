import type {
  SelectionQuestionDto,
  DragAndDropQuestionDto,
  OpenQuestionDto,
} from '@stardust/core/lesson/dtos'

type Questions = [
  SelectionQuestionDto,
  SelectionQuestionDto,
  DragAndDropQuestionDto,
  DragAndDropQuestionDto,
  OpenQuestionDto,
]

export const questions: Questions = [
  {
    type: 'selection',
    statement:
      'Que tal tentarmos cumprimentar a princesa de fora do castelo. Qual função abaixo faz uma saudação? Dica: ela é uma função avançada.',
    code: `funcao facaSaudacao(nome) {
  retorna "Olá, \${nome}! Tudo bem?"
}
    
funcao retornaSaudacao(nome) {
    retorna facaSaudacao(nome)
}

escreva(retornaSaudacao("Princesa"))`,
    options: ['facaSaudacao', 'escreva', 'retornaSaudacao', 'anônima'],
    answer: 'retornaSaudacao',
    picture: 'panda-piscando.jpg',
  },
  {
    type: 'selection',
    statement:
      'Vamos ver se você está afiado com funções de alta ordem. Qual função avançada de lista eu teria que usar se eu quisesse que a quantidade da lista original se mantivesse?',
    options: ['mapear()', 'filtrarPor()', 'inclui()', 'numerar()'],
    answer: 'mapear()',
    picture: 'panda.jpg',
  },
  {
    type: 'drag-and-drop',
    statement:
      'O tubarão nos pediu tranformar todo abacate em ABACATE. complete o código abaixo para atender esse pedido.',
    lines: [
      {
        number: 1,
        texts: ['var nomes = ["abacate", "abacate", "abacate"]'],
        indentation: 0,
      },
      {
        number: 2,
        texts: ['funcao colocaEmMaiuscula(nome) {'],
        indentation: 0,
      },
      {
        number: 3,
        texts: ['retorna ', 'nome.', 'dropZone', '()'],
        indentation: 2,
      },
      {
        number: 4,
        texts: ['}'],
        indentation: 0,
      },
      {
        number: 4,
        texts: ['var abacatesEmMaiusculo = nomes.', 'dropZone', '(colocaEmMaiuscula)'],
        indentation: 0,
      },
    ],
    items: [
      {
        index: 1,
        label: 'mapear',
      },
      {
        index: 2,
        label: 'filtrarPor',
      },
      {
        index: 3,
        label: 'maiuscula',
      },
      {
        index: 4,
        label: 'minuscula',
      },
    ],
    correctItemsIndexesSequence: [3, 1],
    picture: 'panda.jpg',
  },
  {
    type: 'drag-and-drop',
    statement:
      'Tem alguns espinhos venenosos no caminho até a porta do castelo. Use o *filtrarPor()* para que apenas pedras estejam na lista caminho.',
    lines: [
      {
        number: 1,
        texts: ['var caminho = ["pedra", "espinho", "espinho",  "pedra"]'],
        indentation: 0,
      },
      {
        number: 2,
        texts: ['funcao verifiqueCaminho(', 'dropZone', ') {'],
        indentation: 0,
      },
      {
        number: 3,
        texts: ['retorna elemento != "espinho"'],
        indentation: 2,
      },
      {
        number: 4,
        texts: ['}'],
        indentation: 0,
      },
      {
        number: 5,
        texts: ['var impares = ', 'dropZone', '.filtrarPor(', 'dropZone', ')'],
        indentation: 0,
      },
    ],
    items: [
      {
        index: 1,
        label: 'verifiqueCaminho',
      },
      {
        index: 2,
        label: 'caminho',
      },
      {
        index: 3,
        label: 'elemento',
      },
      {
        index: 4,
        label: 'verifiqueEspinho',
      },
    ],
    correctItemsIndexesSequence: [3, 2, 1],
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'open',
    statement:
      'Podemos aproveitar a viagem para pegar algumas plantas do tipo *xeno*. complete o programa abaixo para que ele retorne somente plantas que inclui o texto "xeno" em minúsculo.',

    lines: [
      {
        number: 1,
        indentation: 0,
        texts: ["var plantas = ['Xenomorfo', 'Zogxenon', 'Alien', 'Troxenor'"],
      },
      {
        number: 2,
        indentation: 0,
        texts: ['var', 'plantasComXeno = plantas.', 'input-1', '(funcao (planta) {'],
      },
      {
        number: 3,
        indentation: 2,
        texts: ['planta.', 'input-2', '()'],
      },
      {
        number: 5,
        indentation: 2,
        texts: ['retorna planta.inclui("', 'input-3', '")'],
      },
      {
        number: 6,
        indentation: 0,
        texts: ['}'],
      },
    ],
    answers: ['filtrarPor', 'minusculo', 'xeno'],
    picture: 'panda-sorrindo.jpg',
  },
]
