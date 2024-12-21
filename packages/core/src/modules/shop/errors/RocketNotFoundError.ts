import { NotFoundError } from '../../global/errors'

export class RocketNotFoundError extends NotFoundError {
  constructor() {
    super('Foguete não encontrado.')
  }
}
