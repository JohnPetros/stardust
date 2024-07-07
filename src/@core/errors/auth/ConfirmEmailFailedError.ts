import { BaseError } from '../global/BaseError'

export class ConfirmEmailFailedError extends BaseError {
  constructor() {
    super()
    this.title = 'Confirm Account Failed Error'
    this.message = 'Não foi possível confirmar cadastro.'
  }
}
