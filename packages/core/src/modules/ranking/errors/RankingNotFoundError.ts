import { NotFoundError } from '#global/errors'

export class RankingNotFoundError extends NotFoundError {
  constructor() {
    super('Ranking não encontrado.')
  }
}
