import type { ChallengeDto } from '@stardust/core/challenging/dtos'

export const challenge: ChallengeDto = {
  id: '68456',
  title: 'Area do Escudo Protetor',
  slug: 'area-do-escudo-protetor',
  difficultyLevel: 'easy',
  author: {
    id: '',
  },
  function: {
    name: 'calculeAreaDoEscudo',
    params: [],
  },
  description: '',
  categories: [],
  code: `funcao calculeAreaDoEscudo(base, altura) {
  
}`,
  testCases: [
    { position: 1, inputs: [10, 5], isLocked: false, expectedOutput: [25] },
    { position: 2, inputs: [8, 12], isLocked: false, expectedOutput: [48] },
    { position: 3, inputs: [15, 3], isLocked: false, expectedOutput: [22.5] },
  ],
}

/**
 * funcao calculeAreaDoEscudo(base, altura) {
  retorna (base * altura) / 2
}
 */
