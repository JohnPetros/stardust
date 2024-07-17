import { BaseError } from '../global/BaseError'

export class FetchRankingsWinnersUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Fetch Ranking Winners Unexpected Error'
    this.message = 'Erro inesperado ao buscar os vencedores do ranking'
  }
}
