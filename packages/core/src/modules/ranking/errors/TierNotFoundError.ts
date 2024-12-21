import { NotFoundError } from '../../global/errors'

export class TierNotFoundError extends NotFoundError {
  constructor() {
    super('Tier não encontrado')
  }
}
