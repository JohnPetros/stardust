import { BaseError } from '../global/BaseError'

export class SaveRescuableAchievementUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Save Rescuable Achievement Unexpected Error'
    this.message = 'Erro inesperado ao salvar o conquista resgatável'
  }
}
