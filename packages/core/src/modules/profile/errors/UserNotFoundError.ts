import { NotFoundError } from '#global/errors'

export class UserNotFoundError extends NotFoundError {
  constructor() {
    super('Usuário não encontrado')
  }
}
