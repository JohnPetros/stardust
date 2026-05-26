import { NotFoundError } from '#global/domain/errors/NotFoundError'

export class NoteNotFoundError extends NotFoundError {
  constructor() {
    super('Nota não encontrada')
  }
}
