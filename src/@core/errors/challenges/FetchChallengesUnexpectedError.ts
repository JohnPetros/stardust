import { BaseError } from '../global/BaseError'

export class FetchChallengesUnexpectedError extends BaseError {
  constructor() {
    super()
    this.title = 'Fetch Challenges Unexpected Error'
    this.message = 'Erro inesperado ao buscar desafios'
  }
}
