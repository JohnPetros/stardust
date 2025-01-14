import { NotAllowedError } from '#global/errors'

export class NotSolutionAuthorError extends NotAllowedError {
  constructor() {
    super('Você não é o autor dessa solução')
  }
}
