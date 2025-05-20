import { NotFoundError } from '#global/domain/errors/NotFoundError'

export class StarNotFoundError extends NotFoundError {
  constructor() {
    super('Estrela não encontrada')
  }
}
