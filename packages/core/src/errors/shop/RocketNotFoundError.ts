import { NotFoundError } from '../global'

export class RocketNotFoundError extends NotFoundError {
  constructor() {
    super('Foguete não encontrado.')
  }
}
