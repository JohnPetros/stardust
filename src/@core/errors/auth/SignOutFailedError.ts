import { BaseError } from '../global/BaseError'

export class SignOutFailedError extends BaseError {
  constructor() {
    super()
    this.title = 'Sign Up Failed'
    this.message = 'Não foi possível completar o cadastro.'
  }
}
