import { BaseError } from '../global/BaseError'

export class AllowUsersSeeRankingResultUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Allow Users See Ranking Result Unexpected Error'
    this.message =
      'Erro inesperado ao permitir os usuários verem o resultado do seu ranking'
  }
}
