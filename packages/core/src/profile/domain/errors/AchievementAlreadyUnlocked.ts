import { ConflictError } from '#global/domain/errors/ConflictError'

export class AchievementAlreadyUnlockedError extends ConflictError {
  constructor() {
    super('Conquista já desbloqueada')
  }
}
