import { ValidationError } from '#global/errors'

export class ChallengeWithoutTestCaseError extends ValidationError {
  constructor() {
    super([
      {
        name: 'challengeTestCases',
        messages: ['Um desafio sempre devter casos de teste'],
      },
    ])
  }
}
