import { BaseError } from '../global/BaseError'

export class FetchAchievementsUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Fetch Achievements Unexpected Error'
    this.message = 'Erro inesperado ao buscar conquistas'
  }
}
