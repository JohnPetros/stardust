import { ConflictError } from '#global/domain/errors/ConflictError'

export class InsigniaAlreadyExistsError extends ConflictError {
  constructor() {
    super('Insígnia já existente com este role')
  }
}
