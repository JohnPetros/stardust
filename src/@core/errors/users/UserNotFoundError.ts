import { BaseError } from '../global/BaseError'

export class UserNotFoundError extends BaseError {
  constructor() {
    super()
    this.title = 'Validation Error'
    this.message = 'Usuário não encontrado'
  }
}
