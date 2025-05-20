import { NotFoundError } from '#global/domain/errors/NotFoundError'

export class AvatarNotFoundError extends NotFoundError {
  constructor() {
    super('Avatar não encontrado')
  }
}
