import { BaseError } from '../global/BaseError'

export class ConfirmEmailUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Unexpected Confirm Email Unexpected Error'
    this.message = 'Não foi possível confirmar cadastro.'
  }
}
