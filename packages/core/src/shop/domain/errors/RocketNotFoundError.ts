import { NotFoundError } from '#global/domain/errors/NotFoundError'

export class RocketNotFoundError extends NotFoundError {
  constructor() {
    super('Rocket não encontrado')
  }
}
