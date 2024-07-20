import { BaseError } from '../global/BaseError'

export class TierNotFoundError extends BaseError {
  constructor() {
    super()
    this.title = 'Tier Not Found Error'
    this.message = 'Tier não encontrado'
  }
}
