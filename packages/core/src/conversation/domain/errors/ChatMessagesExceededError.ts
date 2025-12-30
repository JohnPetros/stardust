import { NotAllowedError } from '#global/domain/errors/NotAllowedError'

export class ChatMessagesExceededError extends NotAllowedError {
  constructor() {
    super('Limite de mensagens por chat excedido')
  }
}
