import {
  DragAndDropQuestion,
  OpenQuestion,
  SelectionQuestion,
} from "@/@types/Quiz";

type Questions = [
  SelectionQuestion,
  SelectionQuestion,
  DragAndDropQuestion,
  DragAndDropQuestion,
  OpenQuestion,
]

export const questions: Questions = [
  {
    type: 'selection',
    title: 'Que tal tentarmos cumprimentar a princesa de fora do castelo. Qual função abaixo faz uma saudação? Dica: ela é uma função avançada.',
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
    title: 'Vamos ver se você está afiado com funções de alta ordem. Qual função avançada de lista eu teria que usar se eu quisesse que a quantidade da lista original se mantivesse?',
    options: ['mapear()', 'filtrarPor()', 'inclui()', 'numerar()'],
    answer: 'mapear()',
    picture: 'panda.jpg',
  },
  {
    type: 'drag-and-drop',
    title: 'O tubarão nos pediu tranformar todo abacate em ABACATE. complete o código abaixo para atender esse pedido.',
    lines: [
      {
        id: 1,
        texts: ['var nomes = ["abacate", "abacate", "abacate"]'],
        indentation: 0,
      },
      {
        id: 2,
        texts: ['funcao colocaEmMaiuscula(nome) {'],
        indentation: 0,
      },
      {
        id: 3,
        texts: ['retorna ', 'nome.', 'dropZone', '()'],
        indentation: 2,
      },
      {
        id: 4,
        texts: ['}'],
        indentation: 0,
      },
      {
        id: 4,
        texts: ['var abacatesEmMaiusculo = nomes.', 'dropZone', '(colocaEmMaiuscula)'],
        indentation: 0,
      },
    ],
    dragItems: [
      {
        id: 1,
        label: 'mapear',
      },
      {
        id: 2,
        label: 'filtrarPor',
      },
      {
        id: 3,
        label: 'maiuscula',
      },
      {
        id: 4,
        label: 'minuscula',
      },
    ],
    correctDragItemsIdsSequence: [3, 1],
    picture: 'panda.jpg',
  },
  {
    type: 'drag-and-drop',
    title: 'Tem alguns espinhos venenosos no caminho até a porta do castelo. Use o *filtrarPor()* para que apenas pedras estejam na lista caminho.',
    lines: [
      {
        id: 1,
        texts: ['var caminho = ["pedra", "espinho", "espinho",  "pedra"]'],
        indentation: 0,
      },
      {
        id: 2,
        texts: ['funcao verifiqueCaminho(', 'dropZone', ') {'],
        indentation: 0,
      },
      {
        id: 3,
        texts: ['retorna elemento != "espinho"'],
        indentation: 2,
      },
      {
        id: 4,
        texts: ['}'],
        indentation: 0,
      },
      {
        id: 5,
        texts: ['var impares = ', 'dropZone', '.filtrarPor(', 'dropZone', ')'],
        indentation: 0,
      },
    ],
    dragItems: [
      {
        id: 1,
        label: 'verifiqueCaminho',
      },
      {
        id: 2,
        label: 'caminho',
      },
      {
        id: 3,
        label: 'elemento',
      },
      {
        id: 4,
        label: 'verifiqueEspinho',
      },
    ],
    correctDragItemsIdsSequence: [3, 2, 1],
    picture: 'panda-segurando-bambu-de-pe.jpg',
  },
  {
    type: 'open',
    title: 'Podemos aproveitar a viagem para pegar algumas plantas do tipo *xeno*. complete o programa abaixo para que ele retorne somente plantas que inclui o texto "xeno" em minúsculo.',

    lines: [{
      id: 1,
      indentation: 0,
      texts: ["var plantas = ['Xenomorfo', 'Zogxenon', 'Alien', 'Troxenor'"],
    },
    {
      id: 2,
      indentation: 0,
      texts: ["var", "plantasComXeno = plantas.", "input-1", "(funcao (planta) {",]
    },
    {
      id: 3,
      indentation: 2,
      texts: ["planta.", "input-2", "()"],
    },
    {
      id: 5,
      indentation: 2,
      texts: ["retorna planta.inclui(\"", "input-3", "\")"],
    },
    {
      id: 6,
      indentation: 0,
      texts: ["}"],
    },
    ],
    answers: ["filtrarPor", "minusculo", "xeno"],
    picture: 'panda-sorrindo.jpg',
  },
]
