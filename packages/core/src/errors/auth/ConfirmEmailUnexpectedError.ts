import { UnexpectedError } from '../global'

export class ConfirmEmailUnexpectedError extends UnexpectedError {
  constructor() {
    super('Não foi possível confirmar cadastro')
  }
}
