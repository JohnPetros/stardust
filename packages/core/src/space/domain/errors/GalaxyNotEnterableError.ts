import { ConflictError } from '#global/domain/errors/ConflictError'

export class GalaxyNotEnterableError extends ConflictError {
  constructor() {
    super('Esta galáxia ainda não está disponível')
  }
}
