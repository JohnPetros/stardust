import type { ChallengeDto } from '@stardust/core/challenging/dtos'

export const challenge: Omit<ChallengeDto, 'author'> = {
  id: '7',
  title: 'O Castelo',
  slug: 'o-castelo',
  description: '',
  difficultyLevel: 'easy',
  starId: '7',
  categories: [],
  testCases: [
    {
      position: 1,
      inputs: [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ],
      expectedOutput: [[0, 'princesa', 0]],
      isLocked: false,
    },
    {
      position: 2,
      inputs: [
        [0, 0, 0],
        [0, 0, 0],
        [1, 0, 0],
      ],
      expectedOutput: [['princesa', 0, 0]],
      isLocked: false,
    },
    {
      position: 3,
      inputs: [
        [0, 0, 0],
        [0, 0, 0],
        [1, 0, 0, 0],
      ],
      expectedOutput: [['princesa', 0, 0, 0]],
      isLocked: false,
    },
    {
      position: 4,
      inputs: [[0, 1], [0, 0], [0, 0], [0]],
      expectedOutput: [[0, 'princesa']],
      isLocked: false,
    },
  ],
  code: `funcao acheAPrincesa(castelo) {

}`,
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
