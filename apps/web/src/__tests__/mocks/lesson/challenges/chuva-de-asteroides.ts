import type { ChallengeDto } from '@stardust/core/challenging/dtos'

export const challenge: Omit<ChallengeDto, 'author'> = {
  title: 'Chuva de asteroides',
  difficultyLevel: 'easy',
  description: '',
  categories: [],
  code: `var asteroideA = leia()
var asteroideB = leia()
var asteroideC = leia()
var escudoAtivo = leia()
  
var resistencia = 700

// Escreva seu código abaixo`,
  testCases: [
    {
      position: 1,
      inputs: [100, 100, 100, 'verdadeiro'],
      isLocked: false,
      expectedOutput: 'verdadeiro',
    },
    {
      position: 2,
      inputs: [300, 400, 800, 'verdadeiro'],
      isLocked: false,
      expectedOutput: 'falso',
    },
    {
      position: 3,
      inputs: [50, 200, 200, 'falso'],
      isLocked: false,
      expectedOutput: 'falso',
    },
    {
      position: 4,
      inputs: [100, 500, 100, 'falso'],
      isLocked: false,
      expectedOutput: 'falso',
    },
  ],
}

/**
 * 
var asteroideA = leia()
var asteroideB = leia()
var asteroideC = leia()
var escudoAtivo = leia()

var resistencia = 700

var soma = asteroideA + asteroideB + asteroideC

escreva(soma <= 700 e escudoAtivo)
 */
