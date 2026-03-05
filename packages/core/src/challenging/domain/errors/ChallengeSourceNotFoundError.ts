import { NotFoundError } from '#global/domain/errors/NotFoundError'

export class ChallengeSourceNotFoundError extends NotFoundError {
  constructor() {
    super('Fonte de desafio não encontrada')
  }
}
