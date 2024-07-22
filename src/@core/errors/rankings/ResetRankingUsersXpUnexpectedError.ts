import { BaseError } from '../global/BaseError'

export class ResetRankingUsersXpUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Reset Ranking Users Xp Unexpected Error'
    this.message = 'Erro inesperado ao redefinir o xp dos usuários do ranking'
  }
}
