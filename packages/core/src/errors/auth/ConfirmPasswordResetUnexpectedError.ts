import { UnexpectedError } from '../global'

export class ConfirmPasswordResetUnexpectedError extends UnexpectedError {
  constructor() {
    super('Não foi possível confirmar redefinição de senha')
  }
}
