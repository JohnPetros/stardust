import type { UseCase } from '#global/interfaces/UseCase'
import { Id } from '../../main'
import { ChatNotFoundError } from '../domain/errors'
import type { ChatMessageDto } from '../domain/structures/dtos'
import type { ChatMessagesRepository, ChatsRepository } from '../interfaces'

type Request = {
  chatId: string
}

type Response = Promise<ChatMessageDto[]>

export class ListChatMessagesUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly chatMessagesRepository: ChatMessagesRepository,
  ) {}

  async execute(request: Request) {
    const chatId = Id.create(request.chatId)
    const chat = await this.chatsRepository.findById(chatId)
    if (!chat) throw new ChatNotFoundError()
    const chatMessages = await this.chatMessagesRepository.findAllByChat(chatId)
    return chatMessages.map((chatMessage) => chatMessage.dto)
  }
}
