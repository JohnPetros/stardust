import type { UseCase } from '#global/interfaces/UseCase'
import { Id } from '../../main'
import { Chat } from '../domain/entities'
import type { ChatMessageDto } from '../domain/structures/dtos'
import type { ChatMessagesRepository, ChatsRepository } from '../interfaces'

type Request = {
  chatId: string
  userId: string
}

type Response = Promise<ChatMessageDto[]>

export class ListChatMessagesUseCase implements UseCase<Request, Response> {
  private static readonly NEW_CHAT_NAME = 'Novo chat'

  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly chatMessagesRepository: ChatMessagesRepository,
  ) {}

  async execute(request: Request) {
    const userId = Id.create(request.userId)
    const chatId = Id.create(request.chatId)
    const chat = await this.chatsRepository.findById(chatId)

    if (!chat) {
      const lastChat = await this.chatsRepository.findLastCreatedByUser(userId)
      await this.createChat(chatId, lastChat, userId)
      return []
    }

    const chatMessages = await this.chatMessagesRepository.findAllByChat(chatId)
    return chatMessages.map((chatMessage) => chatMessage.dto)
  }

  private async createChat(chatId: Id, lastChat: Chat | null, userId: Id) {
    if (lastChat?.name.value.startsWith(ListChatMessagesUseCase.NEW_CHAT_NAME)) {
      lastChat.name = lastChat.name.deduplicate()
      await this.chatsRepository.replace(lastChat)
    }

    await this.chatsRepository.add(
      Chat.create({ id: chatId.value, name: ListChatMessagesUseCase.NEW_CHAT_NAME }),
      userId,
    )
  }
}
