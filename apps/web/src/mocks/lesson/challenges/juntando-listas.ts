import type { ChallengeDto } from '@stardust/core/challenging/entities/dtos'

export const challenge: Omit<ChallengeDto, 'author'> = {
  id: '68456',
  title: 'Jutando Listas',
  slug: 'juntando-listas',
  difficultyLevel: 'easy',
  description: '',
  categories: [],
  code: `funcao junteListas(lista1, lista2) {
    var naves = [];
  
    para (var i = 0; i < tamanho(lista1); i++) {
      naves.empilhar(lista1[i]);
    }
  
    para (var j = 0; j < tamanho(lista2); j++) {
      naves.empilhar(lista2[j]);
    }
  
    retorna naves;
  }`,
  function: {
    name: 'junteListas',
    params: [],
  },
  testCases: [
    {
      position: 1,
      inputs: [
        [1, 2, 3],
        [4, 5, 6],
      ],
      isLocked: false,
      expectedOutput: [1, 2, 3, 4, 5, 6],
    },
    {
      position: 2,
      inputs: [
        [0, 7, 8],
        [100, 200],
      ],
      isLocked: false,
      expectedOutput: [0, 7, 8, 100, 200],
    },
    {
      position: 3,
      inputs: [[], [1, 2, 3]],
      isLocked: false,
      expectedOutput: [1, 2, 3],
    },
  ],
  // texts: [
  //   {
  //     content:
  //       'Em um futuro distante, várias espécies alienígenas se unem para explorar o espaço. Cada espécie possui uma lista de espaçonaves identificadas por números, letras ou combinações.',
  //     type: 'default',
  //     title: null,
  //   },
  //   {
  //     content:
  //       'Para facilitar a união, você deve unir as listas de cada espécie em uma só, para que todos possam explorar juntos.',
  //     type: 'list',
  //   },
  //   {
  //     content:
  //       '\nEntrada: [1, 3, 5], [2, 6, 8]\nResultado: [1, 3, 5, 2, 6, 8]\n\nEntrada: [7, 8], [10, 9, 1, 1, 2]\nResultado: [7, 8, 10, 9, 1, 1, 2]\n\nEntrada: [4, 5, 1], [3, 3, 3, 3, 3]\nResultado: [4, 5, 1, 3, 3, 3, 3, 3]',
  //     type: 'code',
  //   },
  //   {
  //     content:
  //       'Dica: Você pode resolver esse desafio usando dois laços "*para*", uma para cada lista e então juntar em uma lista única.',
  //     type: 'alert',
  //   },
  // ],
}

/**
 * funcao calculeAreaDoEscudo(base, altura) {
  retorna (base * altura) / 2
}
 */
