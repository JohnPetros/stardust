import { ConflictError } from '#global/domain/errors/ConflictError'

export class FileNameAlreadyExistsError extends ConflictError {
  constructor() {
    super('Ja existe um arquivo com esse nome nesta pasta')
  }
}
