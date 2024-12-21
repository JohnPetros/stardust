import { UnexpectedError } from '../global'

export class ResetRankingUsersXpUnexpectedError extends UnexpectedError {
  constructor() {
    super('Erro inesperado ao redefinir o xp dos usuários do ranking.')
  }
}
