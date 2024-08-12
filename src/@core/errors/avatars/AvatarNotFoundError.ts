import { BaseError } from '../global/BaseError'

export class AvatarNotFoundError extends BaseError {
  constructor() {
    super()
    this.title = 'Avatar Not Found Error'
    this.message = 'Avatar não encontrado'
  }
}
