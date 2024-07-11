import { BaseError } from '../global/BaseError'

export class FetchRankingsOrderedByPositionUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Fetch Rankings Ordered By Position Unexpected Error'
    this.message = 'Erro inesperado ao buscar rankings ordernados por posição'
  }
}
