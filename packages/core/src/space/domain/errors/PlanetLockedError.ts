import { ForbiddenError } from '#global/domain/errors/ForbiddenError'

export class PlanetLockedError extends ForbiddenError {
  constructor() {
    super('Planeta bloqueado')
  }
}
