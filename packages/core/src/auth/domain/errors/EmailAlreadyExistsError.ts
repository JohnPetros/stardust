import { ConflictError } from '#global/domain/errors/index'

export class EmailAlreadyExistsError extends ConflictError {
  constructor() {
    super('Email já cadastrado.')
  }
}
