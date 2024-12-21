import { NotFoundError } from '../global'

export class StarNotFoundError extends NotFoundError {
  constructor() {
    super('Estrela não encontrada.')
  }
}
