import { NotAllowedError } from '../../../global/domain/errors'

export class NotSolutionAuthorError extends NotAllowedError {
  constructor() {
    super('Você não é o autor dessa solução')
  }
}
