import { NotFoundError } from '#global/domain/errors/index'

export class ApiKeyNotFoundError extends NotFoundError {
  constructor() {
    super('Api Key Not Found Error')
    this.title = this.message = 'API key não encontrada.'
  }
}
