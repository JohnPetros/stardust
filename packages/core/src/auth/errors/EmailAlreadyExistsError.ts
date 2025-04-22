import { ConflictError } from '../../global/domain/errors'

export class EmailAlreadyExistsError extends ConflictError {
  constructor() {
    super('Email já cadastrado.')
  }
}
