import { BaseError } from '../global/BaseError'

export class SaveAcquiredRocketUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Save User Acquired Rocket Unexpected Error'
    this.message = 'Erro inesperado ao salvar o foguete adquirido'
  }
}
