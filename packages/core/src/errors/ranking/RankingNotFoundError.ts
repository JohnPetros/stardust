import { NotFoundError } from '../global'

export class RankingNotFoundError extends NotFoundError {
  constructor() {
    super('Ranking não encontrado.')
  }
}
