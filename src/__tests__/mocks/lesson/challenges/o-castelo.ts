import { Challenge } from '@/@types/Challenge'

export const challenge: Challenge = {
  id: '7',
  title: 'O Castelo',
  slug: 'o-castelo',
  description: '',
  createdAt: '',
  totalCompletitions: 0,
  isCompleted: false,
  difficulty: 'easy',
  userSlug: 'apollo',
  starId: '7',
  categories: [],
  downvotesCount: 0,
  upvotesCount: 0,
  docId: 'f60a0e67-c0b9-401a-a652-c9d5f8042ff1',
  functionName: null,
  testCases: [
    {
      id: 1,
      input: [[0, 0, 0], [0, 1, 0], [0, 0, 0]],
      expectedOutput: [[0, 'princesa', 0]],
      isLocked: false,
    },
    {
      id: 2,
      input: [[0, 0, 0], [0, 0, 0], [1, 0, 0]],
      expectedOutput: [['princesa', 0, 0]],
      isLocked: false,
    },
    {
      id: 3,
      input: [[0, 0, 0], [0, 0, 0], [1, 0, 0, 0]],
      expectedOutput: [['princesa', 0, 0, 0]],
      isLocked: false,
    },
    {
      id: 4,
      input: [[0, 1], [0, 0], [0, 0], [0]],
      expectedOutput: [[0, 'princesa']],
      isLocked: false,
    },
  ],
  code: `funcao acheAPrincesa(castelo) {

}`,
  texts: [
    {
      type: 'image',
      content: 'Chegamos ao castelo.',
      picture: 'castelo-alien.jpg',
    },
    {
      type: 'default',
      content: 'Vamos supor que eu não faço a menor ideia de qual parte do castelo a pricesa está.',
      picture: 'tubarao-malvado.jpg',
    },
    {
      type: 'default',
      content: 'O desafio é encontrar qual parte do castelo ela está.',
      picture: 'tubarao-malvado.jpg',
    },
    {
      type: 'default',
      content: 'O castelo em questão é basicamente dividido em trê partes, representado por três listas: *topo*, *meio* e *baixo*.',
      picture: 'tubarao-malvado.jpg',
    },
    {
      type: 'code',
      content: `var castelo = [
  [0, 0, 0], // Parte do topo do castelo
  [0, 0, 0], // Parte do meio castelo
  [0, 0, 0], // Parte de baixo do castelo 
]`,
      isRunnable: false,
    },
    {
      type: 'default',
      content: 'Cada parte do castelo possui cômodos, que são representados por números, como você bem deve ter percebido.',
      picture: 'tubarao-malvado.jpg',
    },
    {
      type: 'default',
      picture: 'tubarao-malvado.jpg',
      content: 'Logo, o castelo é uma lista de listas.',
    },
    {
      type: 'default',
      content: 'Só que o parte do meio pode ser composto por mais ou menos listas, assim como cada parte pode ter mais ou menos cômodos (números).',
      picture: 'tubarao-malvado.jpg',
    },
    {
      type: 'code',
      content: `var castelo = [
  [0, 0], // Parte do topo do castelo
  [0, 0, 0], // Parte do meio castelo
  [0, 0, 0], // Parte do meio castelo
  [0, 0, 0], // Parte do meio castelo
  [0, 0, 0, 0, 0], // Parte de baixo do castelo 
];`,
      isRunnable: false,
    },
    {
      type: 'default',
      content: 'A princesa é representada pelo número 1. Então a lista que tiver esse número será onde está a princesa.',
      picture: 'tubarao-malvado.jpg',
    },
    {
      type: 'code',
      content: `var castelo = [
  [0, 0], 
  [0, 0, 0],
  [0, 1, 0], // É aqui onde está a princesa
  [0, 0, 0, 0],  
];`,
      isRunnable: false,
    },
    {
      type: 'quote',
      title: 'O Desafio',
      content: 'A sua missão é indicar onde está a princesa. Você deve pegar a lista correta e substituir o número zero pelo texto "princesa" em minúsculo, e por fim retornar essa lista transformada.',
      picture: 'tubarao-malvado.jpg',
    },
    {
      type: 'code',
      content: `
Entrada: [[0,0,0], [0,1,0], [0,0,0]]
Resultado esperado: [0, "princesa", 0]

Entrada: [[0,0,0], [0,0,0], [1,0,0,0]]
Resultado esperado: ["princesa", 0, 0, 0]

Entrada: [[0,0,0], [0,0,0], [1,0,0]]
Resultado esperado: ["princesa", 0, 0,]

Entrada: [[0,1], [0,0], [0,0], [0]]
Resultado esperado: [0, "princesa"]`,
      isRunnable: false,
    },
    {
      type: 'alert',
      content: 'Já armei a função *acheAPrincesa()* onde você deve colocar o "retorna" para retornar o resultado. Então, nem tente alterar o nome dessa função, nem mesmo criar outras funções dentro dela.',
      picture: 'tubarao-malvado.jpg',
    },
    {
      type: 'alert',
      content: 'Entendi, podemos resolver esse desafio usando apenas laços, mas recomendo usar a função *filtrarPor()* e em seguida *mapear()*, pois assim será mais fácil.',
      picture: 'panda.jpg',
    },
    {
      type: 'alert',
      content: 'Dica do panda: os métodos de lista que são funções avançadas, como *filtrarPor* e *mapear* sempre retornarão uma nova lista.',
      picture: 'panda-sorrindo.jpg',
    },
  ],
}

/**
 * funcao acheAPrincesa(castelo) {
 * 
    funcao filtreComodos(comodo) {
      retorna comodo.inclui(1)
    }

    var comodos = castelo.filtrarPor(filtreComodos)[0]

    funcao formate(numero) {
      se (numero == 1){
          retorna 'princesa'
      }

      retorna numero
    }

    retorna comodos.mapear(formate)
}
 */
