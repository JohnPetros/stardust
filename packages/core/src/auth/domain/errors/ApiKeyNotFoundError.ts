import { NotFoundError } from '#global/domain/errors/index'

export class ApiKeyNotFoundError extends NotFoundError {
  constructor() {
    super('API key não encontrada')
    this.title = this.message = 'API key não encontrada.'
  }
}
