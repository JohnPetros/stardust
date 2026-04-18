import { NotAllowedError } from '#global/domain/errors/index'

export class ApiKeyAccessDeniedError extends NotAllowedError {
  constructor() {
    super('Api Key Access Denied Error')
    this.title = this.message = 'Você não pode operar esta API key.'
  }
}
