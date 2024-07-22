import { BaseError } from '../global/BaseError'

export class FetchTiersUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Fetch Tiers Unexpected Error'
    this.message = 'Erro inesperado ao buscar tiers'
  }
}
