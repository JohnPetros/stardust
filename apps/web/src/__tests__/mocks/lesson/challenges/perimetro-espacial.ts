import type { ChallengeDto } from '@stardust/core/challenging/entities/dtos'

export const challenge: Omit<ChallengeDto, 'author'> = {
  id: '68456',
  title: 'Perimetro Espacial',
  slug: 'perimetro-espacial',
  difficultyLevel: 'easy',
  description: '',
  categories: [],
  code: `funcao calculePerimetro(altura, largura) {
    
}`,
  function: {
    name: 'calculePerimetro',
    params: [],
  },
  testCases: [
    { position: 1, inputs: [10, 30], isLocked: false, expectedOutput: 80 },
    { position: 2, inputs: [20, 20], isLocked: false, expectedOutput: 80 },
    { position: 3, inputs: [5, 8], isLocked: false, expectedOutput: 26 },
  ],
}

/**
 * funcao calculePerimetro(altura, largura) {
   retorna (altura * 2) + (largura * 2 )
}
}*/
