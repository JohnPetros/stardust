import { BaseError } from '../global/BaseError'

export class FetchChallengesCategoriesUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Fetch Challenges Categories Unexpected Error'
    this.message = 'Erro inesperado ao buscar desafios'
  }
}
