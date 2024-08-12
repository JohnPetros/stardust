import { BaseError } from '../global/BaseError'

export class FetchUnlockedAchievementsUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Fetch Unlocked Achievements Unexpected Error'
    this.message = 'Erro inesperado ao buscar conquistas desbloqueadas'
  }
}
