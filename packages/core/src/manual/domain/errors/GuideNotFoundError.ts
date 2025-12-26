import { NotFoundError } from '#global/domain/errors/NotFoundError'

export class GuideNotFoundError extends NotFoundError {
  constructor() {
    super('Guia não encontrado')
  }
}
