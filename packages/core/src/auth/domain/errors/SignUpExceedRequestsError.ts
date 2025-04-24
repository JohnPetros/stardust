import { ExceededRequestsError } from '../../../global/domain/errors'

export class SignUpExceededRequestsError extends ExceededRequestsError {
  constructor() {
    super(
      'Você execedeu o limite permitido de tentativas de cadastro. Tente novamente mais tarde.',
    )
  }
}
