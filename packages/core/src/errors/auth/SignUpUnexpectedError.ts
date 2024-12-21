import { UnexpectedError } from '../global'

export class SignUpUnexpectedError extends UnexpectedError {
  constructor() {
    super('Não foi possível completar o cadastro.')
  }
}
