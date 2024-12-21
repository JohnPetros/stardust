import { AuthError } from '../global'

export class AuthUserNotFoundError extends AuthError {
  constructor() {
    super('Usuário não encontrado.')
  }
}
