import { BaseError } from '../global/BaseError'

export class UpdateUserFailedError extends BaseError {
  constructor() {
    super()
    this.title = 'Update User Failed'
    this.message = 'Não foi possível atualizar dados de usuário'
  }
}
