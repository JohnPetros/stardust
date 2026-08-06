import { NotAllowedError } from '../../../global/domain/errors/NotAllowedError'

export class InsigniaNotIncludedError extends NotAllowedError {
  constructor() {
    super('A insígnia necessária não foi incluída')
  }
}
