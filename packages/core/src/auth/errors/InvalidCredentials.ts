import { AuthError } from '../../global/domain/errors'

export class InvalidCredentialsError extends AuthError {
  constructor() {
    super('Credenciais inválidas.')
  }
}
