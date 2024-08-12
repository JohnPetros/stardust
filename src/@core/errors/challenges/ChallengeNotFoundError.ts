import { BaseError } from '../global/BaseError'

export class ChallengeNotFoundError extends BaseError {
  constructor() {
    super()
    this.title = 'Challenge Not Found Error'
    this.message = 'Desafio não encontrado'
  }
}
