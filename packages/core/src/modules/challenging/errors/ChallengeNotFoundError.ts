import { NotFoundError } from '#global/errors'

export class ChallengeNotFoundError extends NotFoundError {
  constructor() {
    super('Desafio não encontrado')
  }
}
