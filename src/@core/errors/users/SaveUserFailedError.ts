import { BaseError } from '../global/BaseError'

export class SaveUserFailedError extends BaseError {
  constructor() {
    super()
    this.title = 'Save User Failed'
    this.message = 'Não foi possível salvar dados do usuário'
  }
}
