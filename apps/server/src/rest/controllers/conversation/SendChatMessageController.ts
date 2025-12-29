import type { ChatsRepository } from '@stardust/core/conversation/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { ChatMessageDto } from '@stardust/core/conversation/structures/dtos'
import { SendChatMessageUseCase } from '@stardust/core/conversation/use-cases'

type Schema = {
  routeParams: {
    chatId: string
  }
  body: ChatMessageDto
}

export class SendChatMessageController implements Controller<Schema> {
  constructor(private readonly repository: ChatsRepository) {}

  async handle(http: Http<Schema>) {
    const { chatId } = http.getRouteParams()
    const chatMessageDto = await http.getBody()
    const useCase = new SendChatMessageUseCase(this.repository)
    const response = await useCase.execute({ chatId, chatMessageDto })
    return http.statusCreated().send(response)
  }
}
