import { BaseError } from '../global/BaseError'

export class SaveUserUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Save User Unexpected Error'
    this.message = 'Não foi possível salvar dados do usuário'
  }
}
