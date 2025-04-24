import { NotFoundError } from '../../../global/domain/errors'

export class TierNotFoundError extends NotFoundError {
  constructor() {
    super('Tier não encontrado')
  }
}
