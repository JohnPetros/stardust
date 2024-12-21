import { BaseError } from '../global/BaseError'

export class UpdateUserUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Update User Unexpected Error'
    this.message = 'Erro inesperado ao atualizar dados de usuário'
  }
}
