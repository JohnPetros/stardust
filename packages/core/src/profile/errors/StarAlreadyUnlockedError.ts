import { ConflictError } from '#global/domain/errors/ConflictError'

export class StarAlreadyUnlockedError extends ConflictError {
  constructor() {
    super('Estrela já desbloqueada')
  }
}
