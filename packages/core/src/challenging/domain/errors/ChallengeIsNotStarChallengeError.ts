import { NotAllowedError } from '#global/domain/errors/NotAllowedError'

export class ChallengeIsNotStarChallengeError extends NotAllowedError {
  constructor() {
    super('O desafio não é uma estrela')
  }
}
