import { BaseError } from '../global/BaseError'

export class SignUpRateLimitError extends BaseError {
  constructor() {
    super()
    this.title = 'Sign Up Rate Limit Error'
    this.message =
      'Você execedeu o limite permitido de tentativas de cadastro. Tente novamente mais tarde.'
  }
}
