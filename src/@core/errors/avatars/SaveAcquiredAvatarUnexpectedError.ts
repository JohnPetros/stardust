import { BaseError } from '../global/BaseError'

export class SaveAcquiredAvatarUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Save User Acquired Avatar Unexpected Error'
    this.message = 'Erro inesperado ao salvar o avatar adquirido'
  }
}