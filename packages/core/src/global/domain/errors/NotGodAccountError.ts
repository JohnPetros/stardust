import { AuthError } from './AuthError'

export class NotGodAccountError extends AuthError {
  constructor() {
    super('Esta conta não é o administrador do sistema')
  }
}
