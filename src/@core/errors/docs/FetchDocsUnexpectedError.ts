import { BaseError } from '../global/BaseError'

export class FetchDocsUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Fetch Docs Unexpected Error'
    this.message = 'Erro inesperado ao buscar dados do dicionário'
  }
}
