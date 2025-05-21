import { NotFoundError } from '#global/domain/errors/NotFoundError'

export class PlanetNotFoundError extends NotFoundError {
  constructor() {
    super('Planeta não encontrado')
  }
}
