import { ConflictError } from '../global'

export class EmailAlreadyExistsError extends ConflictError {
  constructor() {
    super('Email já cadastrado.')
  }
}
