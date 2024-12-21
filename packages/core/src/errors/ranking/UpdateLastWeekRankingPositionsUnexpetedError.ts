import { BaseError } from '../global/BaseError'

export class UpdateLastWeekRankingPositionsUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Update Last Week Ranking Positions Unexpected Error'
    this.message =
      'Erro inesperado ao atualizar a posição no ranking da última semana de cada usuário'
  }
}
