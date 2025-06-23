import { ConflictError } from '#global/domain/errors/index'

export class SolutionTitleAlreadyInUseError extends ConflictError {
  constructor() {
    super('Título já usado por outra solução.')
  }
}
