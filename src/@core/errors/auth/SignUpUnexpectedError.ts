import { BaseError } from '../global/BaseError'

export class SignUpUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Sign Up Unexpected Error'
    this.message = 'Não foi possível completar o cadastro.'
  }
}
