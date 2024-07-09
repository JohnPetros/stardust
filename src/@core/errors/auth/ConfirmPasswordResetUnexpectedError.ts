import { BaseError } from '../global/BaseError'

export class ConfirmPasswordResetUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Confirm Password Reset Unexpected Error'
    this.message = 'Não foi possível confirmar redefinição de senha.'
  }
}
