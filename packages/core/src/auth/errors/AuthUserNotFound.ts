import { AuthError } from '../../global/domain/errors'

export class AuthUserNotFoundError extends AuthError {
  constructor() {
    super('Usuário não encontrado.')
  }
}
