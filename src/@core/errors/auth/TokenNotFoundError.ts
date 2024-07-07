import { BaseError } from '../global/BaseError'

export class TokenNotFoundError extends BaseError {
  constructor() {
    super()
    this.title = 'Token Not Found Error'
    this.message = 'Token de autenticação não encontrado.'
  }
}
