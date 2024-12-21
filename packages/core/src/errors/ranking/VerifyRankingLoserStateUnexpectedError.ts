import { UnexpectedError } from '../global'

export class VerifyRankingLoserStatusUnexpectedError extends UnexpectedError {
  constructor() {
    super(
      'Erro inesperado ao verificar se o usuário do ranking possui status de perdedor.',
    )
  }
}
