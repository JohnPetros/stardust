import { BaseError } from '../global/BaseError'

export class UpdateUserUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Update User Unexpected'
    this.message = 'Não foi possível atualizar dados de usuário'
  }
}
