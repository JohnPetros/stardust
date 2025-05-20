import { NotFoundError } from '#global/domain/errors/NotFoundError'

export class RankingNotFoundError extends NotFoundError {
  constructor() {
    super('Ranking não encontrado.')
  }
}
