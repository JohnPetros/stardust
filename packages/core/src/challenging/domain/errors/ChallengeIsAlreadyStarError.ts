import { ConflictError } from '#global/domain/errors/ConflictError'

export class ChallengeIsAlreadyStarError extends ConflictError {
  constructor() {
    super('O desafio já é uma estrela')
  }
}
