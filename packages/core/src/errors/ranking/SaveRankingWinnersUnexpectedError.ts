import { UnexpectedError } from '../global'

export class SaveRankingWinnersUnexpectedError extends UnexpectedError {
  constructor() {
    super('Erro inesperado ao salvar os ganhadores de cada ranking.')
  }
}
