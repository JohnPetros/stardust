import { BaseError } from '../global/BaseError'

export class VerifyRankingLoserStatusUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Verify Ranking Loser Status Unexpected Error'
    this.message =
      'Erro inesperado ao verificar se o usuário do ranking possui status de perdedor'
  }
}
