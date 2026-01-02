import type { UseCase } from '#global/interfaces/UseCase'
import type { ChatDto } from '../domain/entities/dtos'
import type { ChatsRepository } from '../interfaces'
import { Chat } from '../domain/entities'
import { Id } from '../../main'

type Request = {
  userId: string
}

type Response = Promise<ChatDto>

export class CreateChatUseCase implements UseCase<Request, Response> {
  private static readonly NEW_CHAT_NAME = 'Novo chat'

  constructor(private readonly repository: ChatsRepository) {}

  async execute(request: Request) {
    const userId = Id.create(request.userId)
    const lastChat = await this.repository.findLastCreatedByUser(userId)

    if (lastChat?.name.value.startsWith(CreateChatUseCase.NEW_CHAT_NAME)) {
      const chat = Chat.create({ name: lastChat.name.deduplicate().value })
      await this.repository.add(chat, userId)
      return chat.dto
    }

    const chat = Chat.create({ name: CreateChatUseCase.NEW_CHAT_NAME })
    await this.repository.add(chat, userId)
    return chat.dto
  }
}
