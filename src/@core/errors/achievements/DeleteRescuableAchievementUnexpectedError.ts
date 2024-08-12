import { BaseError } from '../global/BaseError'

export class DeleteRescuableAchievementUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Delete Rescuable Achievement Unexpected Error'
    this.message = 'Erro inesperado ao deletar o conquista resgatável'
  }
}
