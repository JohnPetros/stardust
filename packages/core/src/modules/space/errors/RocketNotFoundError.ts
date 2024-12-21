import { NotFoundError } from '../../modules/global/errors'

export class RocketNotFoundError extends NotFoundError {
  constructor() {
    super('Rocket não encontrado.')
  }
}
