import { NotFoundError } from '../global'

export class TokenNotFoundError extends NotFoundError {
  constructor() {
    super('Token Not Found Error')
    this.title = this.message = 'Token de autenticação não encontrado.'
  }
}
