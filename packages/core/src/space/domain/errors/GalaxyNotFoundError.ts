import { NotFoundError } from '#global/domain/errors/NotFoundError'

export class GalaxyNotFoundError extends NotFoundError {
  constructor() {
    super('Galáxia não encontrada')
  }
}
