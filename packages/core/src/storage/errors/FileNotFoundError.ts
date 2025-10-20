import { NotFoundError } from '#global/domain/errors/NotFoundError'

export class FileNotFoundError extends NotFoundError {
  constructor() {
    super('Arquivo não encontrado')
  }
}
