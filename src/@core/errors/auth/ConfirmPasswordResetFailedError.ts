import { BaseError } from '../global/BaseError'

export class ConfirmPasswordResetFailedError extends BaseError {
  constructor() {
    super()
    this.title = 'Confirm Password Reset Failed Error'
    this.message = 'Não foi possível confirmar redefinição de senha.'
  }
}
