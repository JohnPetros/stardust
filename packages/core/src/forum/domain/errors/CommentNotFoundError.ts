import { NotFoundError } from '#global/domain/errors/NotFoundError'

export class CommentNotFoundError extends NotFoundError {
  constructor() {
    super('Comentário não encontrado')
  }
}
