import { ConflictError } from '#global/domain/errors/ConflictError'

export class UserEmailAlreadyInUseError extends ConflictError {
  constructor() {
    super('Email de usuário já está em uso')
  }
}
