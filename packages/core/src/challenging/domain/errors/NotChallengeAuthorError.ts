import { NotAllowedError } from '../../../global/domain/errors'

export class NotChallengeAuthorError extends NotAllowedError {
  constructor() {
    super('Você não é o autor desse desafio')
  }
}
