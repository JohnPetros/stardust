import type { UseCase } from '#global/interfaces/UseCase'
import type { ChatsRepository } from '../interfaces'
import type { ChatDto } from '../domain/entities/dtos'
import { Id } from '#global/domain/structures/Id'
import { Name } from '#global/domain/structures/Name'
import { ChatNotFoundError } from '../domain/errors'

type Request = {
  chatId: string
  chatName: string
}

type Response = Promise<ChatDto>

export class EditChatNameUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: ChatsRepository) {}

  async execute({ chatId, chatName }: Request) {
    const chat = await this.findChat(Id.create(chatId))
    chat.name = Name.create(chatName)
    await this.repository.replace(chat)
    return chat.dto
  }

  private async findChat(chatId: Id) {
    const chat = await this.repository.findById(chatId)
    if (!chat) throw new ChatNotFoundError()
    return chat
  }
}
