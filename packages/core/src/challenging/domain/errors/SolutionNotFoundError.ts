import { NotFoundError } from '../../../global/domain/errors'

export class SolutionNotFoundError extends NotFoundError {
  constructor() {
    super('Solução não encontrada')
  }
}
