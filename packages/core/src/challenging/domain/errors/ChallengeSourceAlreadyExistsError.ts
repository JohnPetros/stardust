import { ConflictError } from '#global/domain/errors/ConflictError'

export class ChallengeSourceAlreadyExistsError extends ConflictError {
  constructor() {
    super('Desafio já possui uma fonte vinculada')
  }
}
