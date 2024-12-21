import { AuthError } from '#global/errors'

export class InvalidCredentialsError extends AuthError {
  constructor() {
    super('Credenciais inválidas.')
  }
}
