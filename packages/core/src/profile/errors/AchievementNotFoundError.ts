import { NotFoundError } from '#global/domain/errors/NotFoundError'

export class AchievementNotFoundError extends NotFoundError {
  constructor() {
    super('Conquista não encontrada')
  }
}
