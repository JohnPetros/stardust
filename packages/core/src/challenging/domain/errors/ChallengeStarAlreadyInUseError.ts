import { ConflictError } from '#global/domain/errors/ConflictError'

export class ChallengeStarAlreadyInUseError extends ConflictError {
  constructor() {
    super('Esta estrela já está vinculada a outro desafio')
  }
}
