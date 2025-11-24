import { ConflictError } from '#global/domain/errors/ConflictError'

export class UserSocialAccountAlreadyInUseError extends ConflictError {
  constructor() {
    super('Conta social já em uso')
  }
}
