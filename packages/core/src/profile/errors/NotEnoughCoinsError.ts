import { ConflictError } from '#global/domain/errors/ConflictError'

export class NotEnoughCoinsError extends ConflictError {
  constructor() {
    super('Não há moedas suficientes')
  }
}
