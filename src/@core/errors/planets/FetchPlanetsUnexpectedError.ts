import { BaseError } from '../global/BaseError'

export class FetchPlanetsUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Fetch Planets Unexpected Error'
    this.message = 'Erro inesperado ao buscar planetas'
  }
}
