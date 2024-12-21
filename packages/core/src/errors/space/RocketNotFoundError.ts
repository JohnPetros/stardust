import { NotFoundError } from '../global'

export class RocketNotFoundError extends NotFoundError {
  constructor() {
    super('Rocket não encontrado.')
  }
}
