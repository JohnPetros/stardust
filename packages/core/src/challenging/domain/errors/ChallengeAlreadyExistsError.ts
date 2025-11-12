import { ConflictError } from '#global/domain/errors/ConflictError'

export class ChallengeAlreadyExistsError extends ConflictError {
  constructor() {
    super('Desafio já existe')
  }
}
