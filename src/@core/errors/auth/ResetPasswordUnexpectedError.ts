import { BaseError } from '../global/BaseError'

export class ResetPasswordUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Reset Password Unexpected Error'
    this.message = 'Não foi possível completar a redefinição de senha.'
  }
}
