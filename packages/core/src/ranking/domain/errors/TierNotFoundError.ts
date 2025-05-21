import { NotFoundError } from '#global/domain/errors/NotFoundError'

export class TierNotFoundError extends NotFoundError {
  constructor() {
    super('Tier não encontrado')
  }
}
