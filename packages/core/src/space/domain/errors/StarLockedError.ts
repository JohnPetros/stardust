import { ForbiddenError } from '#global/domain/errors/ForbiddenError'

export class StarLockedError extends ForbiddenError {
  constructor() {
    super('Estrela bloqueada')
  }
}
