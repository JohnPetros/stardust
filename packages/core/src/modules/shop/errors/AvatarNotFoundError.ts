import { NotFoundError } from '../../global/errors'

export class AvatarNotFoundError extends NotFoundError {
  constructor() {
    super('Avatar não encontrado.')
  }
}
