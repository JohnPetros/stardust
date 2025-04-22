import { NotFoundError } from '../../../global/domain/errors'

export class RankingNotFoundError extends NotFoundError {
  constructor() {
    super('Ranking não encontrado.')
  }
}
