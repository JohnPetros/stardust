import { UnexpectedError } from '../global'

export class AllowUsersSeeRankingResultUnexpectedError extends UnexpectedError {
  constructor() {
    super('Erro inesperado ao permitir os usuários verem o resultado do seu ranking.')
  }
}
