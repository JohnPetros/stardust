import { BaseError } from '../global/BaseError'

export class SaveUnlockedStarUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Save Unlocked Star Unexpected Error'
    this.message = 'Erro inesperado ao salvar estrela desbloqueada'
  }
}
