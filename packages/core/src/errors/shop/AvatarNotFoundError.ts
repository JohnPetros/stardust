import { NotFoundError } from '../global'

export class AvatarNotFoundError extends NotFoundError {
  constructor() {
    super('Avatar não encontrado.')
  }
}
