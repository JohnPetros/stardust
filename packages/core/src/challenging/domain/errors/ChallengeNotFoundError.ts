import { NotFoundError } from '#global/domain/errors/NotFoundError'

export class ChallengeNotFoundError extends NotFoundError {
  constructor() {
    super('Desafio não encontrado')
  }
}
