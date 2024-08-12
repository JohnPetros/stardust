import { BaseError } from '../global/BaseError'

export class UpdateRankingUsersTierUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Update Last Week Ranking Positions Unexpected Error'
    this.message = 'Erro inesperado ao atualizar o tier dos usuários do ranking'
  }
}
