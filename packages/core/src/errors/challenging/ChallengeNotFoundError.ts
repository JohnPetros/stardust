import { NotFoundError } from '../global'

export class ChallengeNotFoundError extends NotFoundError {
  constructor() {
    super('Desafio não encontrado')
  }
}
