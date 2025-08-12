import type { ChallengeDto } from '@stardust/core/challenging/entities/dtos'

export const challenge: ChallengeDto = {
  id: '5',
  title: 'Planetas pares',
  slug: 'planetas-pares',
  author: {
    id: '',
  },
  description: '',
  difficultyLevel: 'easy',
  categories: [],
  testCases: [
    { position: 1, inputs: [10], isLocked: false, expectedOutput: 5 },
    { position: 2, inputs: [7], isLocked: false, expectedOutput: 3 },
    { position: 3, inputs: [1], isLocked: false, expectedOutput: 0 },
    { position: 4, inputs: [0], isLocked: false, expectedOutput: 0 },
  ],
  code: `var totalPlanetas = leia();
var totalPlanetasSeguros = 0;
  
// Utilize o escreva abaixo dentro do seu laço
escreva(totalPlanetasSeguros)`,
}

/**
 * var totalPlanetas = leia();
var totalPlanetasSeguros = 0;
  
// Use o laço antes do escreva

para (var i = 1; i <= totalPlanetas; i++) {
  se (i % 2 == 0) {
    totalPlanetasSeguros++
  }
}

escreva(totalPlanetasSeguros)
 */
