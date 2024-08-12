import { BaseError } from '../global/BaseError'

export class FetchRankingsUsersUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Fetch Ranking Users Unexpected Error'
    this.message = 'Erro inesperado ao buscar os usuários do ranking'
  }
}
