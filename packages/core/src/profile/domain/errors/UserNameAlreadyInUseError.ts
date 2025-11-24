import { ConflictError } from '#global/domain/errors/ConflictError'

export class UserNameAlreadyInUseError extends ConflictError {
  constructor() {
    super('Nome de usuário já está em uso')
  }
}
