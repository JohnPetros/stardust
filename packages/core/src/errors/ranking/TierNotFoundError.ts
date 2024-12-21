import { NotFoundError } from '../global'

export class TierNotFoundError extends NotFoundError {
  constructor() {
    super('Tier não encontrado')
  }
}
