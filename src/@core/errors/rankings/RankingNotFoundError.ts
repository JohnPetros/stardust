import { BaseError } from '../global/BaseError'

export class RankingNotFoundError extends BaseError {
  constructor() {
    super()
    this.title = 'Ranking Not Found Error'
    this.message = 'Ranking não encontrado'
  }
}
