import { ConflictError } from '#global/domain/errors/ConflictError'

export class ChallengeStarAlreadyInUseError extends ConflictError {
  constructor() {
    super('Desafio já é uma estrela')
  }
}
