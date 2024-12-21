import { UnexpectedError } from '../global'

export class ResetPasswordUnexpectedError extends UnexpectedError {
  constructor() {
    super('Não foi possível completar a redefinição de senha.')
  }
}
