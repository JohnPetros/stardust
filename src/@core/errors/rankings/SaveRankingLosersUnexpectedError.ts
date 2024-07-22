import { BaseError } from '../global/BaseError'

export class SaveRankingLosersUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Save Ranking Losers Unexpected Error'
    this.message = 'Erro inesperado ao salvar os perdedores de cada ranking'
  }
}
