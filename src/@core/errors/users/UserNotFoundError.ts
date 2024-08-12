import { BaseError } from '../global/BaseError'

export class UserNotFoundError extends BaseError {
  constructor() {
    super()
    this.title = 'User Not Found Error'
    this.message = 'Usuário não encontrado'
  }
}
