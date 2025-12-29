import type { UseCase } from '#global/interfaces/UseCase'
import type { ChatsRepository } from '../interfaces'
import { Id } from '../../main'
import { ChatNotFoundError } from '../domain/errors'

type Request = {
  chatId: string
}

type Response = Promise<void>

export class DeleteChatUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: ChatsRepository) {}

  async execute({ chatId }: Request) {
    const chat = await this.findChat(Id.create(chatId))
    await this.repository.remove(chat.id)
  }

  private async findChat(chatId: Id) {
    const chat = await this.repository.findById(chatId)
    if (!chat) throw new ChatNotFoundError()
    return chat
  }
}
