import { ConflictError } from '#global/domain/errors/ConflictError'

export class InsigniaAlreadyExistsError extends ConflictError {
  constructor() {
    super('Insignia já existente com esta role')
  }
}
