import type { ChallengeDto } from '@stardust/core/challenging/dtos'

export const challenge: Omit<ChallengeDto, 'author'> = {
  id: 'Análise do ambiente',
  slug: 'analise-do-ambiente',
  description: '',
  starId: '2',
  difficultyLevel: 'easy',
  categories: [],
  title: 'Análise do ambiente',
  code: `var nome = "Datahon"
var temperatura = 53.5
var temOxigenio = falso

var tipoNome
var tipoTemperatura
var tipoOxigenio

escreva()`,
  testCases: [
    {
      position: 1,
      inputs: [],
      isLocked: false,
      expectedOutput: 'Datahon: texto, 53.5: número, falso: lógico',
    },
  ],
}

/**
 * 
var nome = "Datahon"
var temperatura = 53.5
var temOxigenio = falso

var tipoNome
var tipoTemperatura
var tipoOxigenio

// Escreva o resultado dentro do escreva abaixo
escreva('Datahon: texto, 53.5: número, falso: lógico')
 */
