import { NotFoundError } from '../../global/errors'

export class TokenNotFoundError extends NotFoundError {
  constructor() {
    super('Token Not Found Error')
    this.title = this.message = 'Token de autenticação não encontrado.'
  }
}
