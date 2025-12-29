import type { UseCase } from '#global/interfaces/UseCase'
import { Id } from '../../main'
import { Chat } from '../domain/entities'
import type { ChatMessageDto } from '../domain/structures/dtos'
import type { ChatsRepository } from '../interfaces'

type Request = {
  chatId: string
  userId: string
}

type Response = Promise<ChatMessageDto[]>

export class ListChatMessagesUseCase implements UseCase<Request, Response> {
  private static readonly NEW_CHAT_NAME = 'Novo chat'

  constructor(private readonly repository: ChatsRepository) {}

  async execute(request: Request) {
    const userId = Id.create(request.userId)
    const chatId = Id.create(request.chatId)
    const chat = await this.repository.findById(chatId)

    if (!chat) {
      const lastChat = await this.repository.findLastCreatedByUser(userId)
      await this.createChat(chatId, lastChat, userId)
      return []
    }

    const chatMessages = await this.repository.findAllMessagesByChat(chatId)
    return chatMessages.map((chatMessage) => chatMessage.dto)
  }

  private async createChat(chatId: Id, lastChat: Chat | null, userId: Id) {
    if (lastChat?.name.value.startsWith(ListChatMessagesUseCase.NEW_CHAT_NAME)) {
      await this.repository.add(
        Chat.create({ id: chatId.value, name: lastChat.name.deduplicate().value }),
        userId,
      )
      return
    }
    await this.repository.add(
      Chat.create({ id: chatId.value, name: ListChatMessagesUseCase.NEW_CHAT_NAME }),
      userId,
    )
  }
}
