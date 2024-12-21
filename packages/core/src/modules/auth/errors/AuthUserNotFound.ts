import { AuthError } from '../../global/errors'

export class AuthUserNotFoundError extends AuthError {
  constructor() {
    super('Usuário não encontrado.')
  }
}
