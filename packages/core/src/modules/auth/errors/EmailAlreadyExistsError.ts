import { ConflictError } from '../../global/errors'

export class EmailAlreadyExistsError extends ConflictError {
  constructor() {
    super('Email já cadastrado.')
  }
}
