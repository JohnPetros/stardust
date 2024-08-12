import { BaseError } from '../global/BaseError'

export class SaveRankingWinnersUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Save Ranking Winners Unexpected Error'
    this.message = 'Erro inesperado ao salvar os ganhadores de cada ranking'
  }
}
