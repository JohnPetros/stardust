import { NotFoundError } from '#global/domain/errors/NotFoundError'

export class InsigniaNotFoundError extends NotFoundError {
  constructor() {
    super('Insignia não encontrada')
  }
}
