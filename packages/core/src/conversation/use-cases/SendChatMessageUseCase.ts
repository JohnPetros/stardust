import type { UseCase } from '#global/interfaces/UseCase'
import { Id } from '../../main'
import { ChatNotFoundError } from '../domain/errors'
import { ChatMessage } from '../domain/structures'
import type { ChatMessageDto } from '../domain/structures/dtos'
import type { ChatMessagesRepository, ChatsRepository } from '../interfaces'

type Request = {
  chatId: string
  chatMessageDto: ChatMessageDto
}

type Response = Promise<ChatMessageDto>

export class SendChatMessageUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly chatMessagesRepository: ChatMessagesRepository,
  ) {}

  async execute({ chatId, chatMessageDto }: Request) {
    const chat = await this.findChat(Id.create(chatId))
    const chatMessage = ChatMessage.create(chatMessageDto)
    await this.chatMessagesRepository.add(chat.id, chatMessage)
    return chatMessage.dto
  }

  private async findChat(chatId: Id) {
    const chat = await this.chatsRepository.findById(chatId)
    if (!chat) throw new ChatNotFoundError()
    return chat
  }
}
