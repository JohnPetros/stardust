import { BaseError } from '../global/BaseError'

export class FetchPlanetsUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Fetch All Planets Unexpected Error'
    this.message = 'Erro inesperado ao buscar planetas'
  }
}
