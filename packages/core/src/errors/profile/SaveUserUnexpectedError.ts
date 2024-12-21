import { BaseError } from '../global/BaseError'

export class SaveUserUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Save User Unexpected Error'
    this.message = 'Erro inesperado ao salvar dados do usuário'
  }
}
