import { NotFoundError } from '#global/domain/errors/NotFoundError'

export class ChatNotFoundError extends NotFoundError {
  constructor() {
    super('Chat não encontrado')
  }
}
