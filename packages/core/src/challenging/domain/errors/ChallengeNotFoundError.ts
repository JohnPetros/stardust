import { NotFoundError } from '../../../global/domain/errors'

export class ChallengeNotFoundError extends NotFoundError {
  constructor() {
    super('Desafio não encontrado')
  }
}
