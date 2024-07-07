import { BaseError } from '../global/BaseError'

export class ResetPasswordFailedError extends BaseError {
  constructor() {
    super()
    this.title = 'Reset Password Failed'
    this.message = 'Não foi possível completar a redefinição de senha.'
  }
}
