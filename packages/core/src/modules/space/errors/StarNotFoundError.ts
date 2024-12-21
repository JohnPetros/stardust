import { NotFoundError } from '../../modules/global/errors'

export class StarNotFoundError extends NotFoundError {
  constructor() {
    super('Estrela não encontrada.')
  }
}
