import { UnexpectedError } from '../global'

export class UpdateRankingUsersTierUnexpectedError extends UnexpectedError {
  constructor() {
    super('Erro inesperado ao atualizar o tier dos usuários do ranking')
  }
}
