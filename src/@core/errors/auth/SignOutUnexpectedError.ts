import { BaseError } from '../global/BaseError'

export class SignOutUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Sign Up Unexpected Error'
    this.message = 'Não foi possível completar o cadastro.'
  }
}
