import { UnexpectedError } from '../global'

export class DeleteLastWeekRankingUsersUnexpectedError extends UnexpectedError {
  constructor() {
    super('Erro inesperado ao deletar os usuários do ranking da semana passada.')
  }
}
