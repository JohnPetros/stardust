import type { ChatsRepository } from '@stardust/core/conversation/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import { EditChatNameUseCase } from '@stardust/core/conversation/use-cases'

type Schema = {
  routeParams: {
    chatId: string
  }
  body: {
    chatName: string
  }
}

export class EditChatNameController implements Controller<Schema> {
  constructor(private readonly repository: ChatsRepository) {}

  async handle(http: Http<Schema>) {
    const { chatId } = http.getRouteParams()
    const { chatName } = await http.getBody()
    const useCase = new EditChatNameUseCase(this.repository)
    const response = await useCase.execute({ chatId, chatName })
    return http.send(response)
  }
}
