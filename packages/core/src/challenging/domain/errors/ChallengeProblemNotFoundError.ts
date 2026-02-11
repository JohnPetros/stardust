import { NotFoundError } from '#global/domain/errors/NotFoundError'

export class ChallengeProblemNotFoundError extends NotFoundError {
  constructor() {
    super('Problema de desafio não encontrado')
  }
}
