import { BaseError } from '../global/BaseError'

export class FetchRankingsUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Fetch Rankings Unexpected Error'
    this.message = 'Erro inesperado ao buscar rankings'
  }
}
