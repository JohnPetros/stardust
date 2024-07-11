import { BaseError } from '../global/BaseError'

export class SaveUserUnlockedStarUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Save User Unlocked Star Unexpected Error'
    this.message = 'Erro inesperado ao salvar estrela desbloqueada'
  }
}
