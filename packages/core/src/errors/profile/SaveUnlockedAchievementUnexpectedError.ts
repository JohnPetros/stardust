import { BaseError } from '../global/BaseError'

export class SaveUnlockedAchievementUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Save Unlocked Achievement Unexpected Error'
    this.message = 'Erro inesperado ao salvar o conquista desbloqueada'
  }
}
