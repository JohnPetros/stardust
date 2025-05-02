import { NotFoundError } from '#global/domain/errors/NotFoundError'

export class UserNotFoundError extends NotFoundError {
  constructor() {
    super('Usuário não encontrado')
  }
}
