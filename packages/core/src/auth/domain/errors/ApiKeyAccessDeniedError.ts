import { NotAllowedError } from '#global/domain/errors/index'

export class ApiKeyAccessDeniedError extends NotAllowedError {
  constructor() {
    super('Acesso à API key negado')
    this.title = this.message = 'Você não pode operar esta API key.'
  }
}
