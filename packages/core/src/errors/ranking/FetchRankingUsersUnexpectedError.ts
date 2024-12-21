import { UnexpectedError } from '../global'

export class FetchRankingsUsersUnexpectedError extends UnexpectedError {
  constructor() {
    super('Erro inesperado ao buscar os usuários do ranking.')
  }
}
