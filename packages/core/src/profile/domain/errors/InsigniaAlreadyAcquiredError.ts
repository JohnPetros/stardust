import { ConflictError } from '#global/domain/errors/ConflictError'

export class InsigniaAlreadyAcquiredError extends ConflictError {
  constructor() {
    super('Insignia já adquirida')
  }
}
