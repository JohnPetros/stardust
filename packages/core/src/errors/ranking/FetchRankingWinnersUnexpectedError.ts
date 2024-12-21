import { UnexpectedError } from '../global'

export class FetchRankingsWinnersUnexpectedError extends UnexpectedError {
  constructor() {
    super('Erro inesperado ao buscar os vencedores do ranking.')
  }
}
