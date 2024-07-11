import { BaseError } from '../global/BaseError'

export class RocketNotFoundError extends BaseError {
  constructor() {
    super()
    this.title = 'Rocket Not Found Error'
    this.message = 'Usuário não encontrado'
  }
}
