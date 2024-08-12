import { BaseError } from '../global/BaseError'

export class DeleteLastWeekRankingUsersUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Delete Last Week Ranking Users Unexpected Error'
    this.message = 'Erro inesperado ao deletar os usuários do ranking da semana passada'
  }
}
