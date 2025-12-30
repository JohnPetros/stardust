import type { ChatsRepository } from '@stardust/core/conversation/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import { DeleteChatUseCase } from '@stardust/core/conversation/use-cases'

type Schema = {
  routeParams: {
    chatId: string
  }
}

export class DeleteChatController implements Controller<Schema> {
  constructor(private readonly repository: ChatsRepository) {}

  async handle(http: Http<Schema>) {
    const { chatId } = http.getRouteParams()
    const useCase = new DeleteChatUseCase(this.repository)
    const response = await useCase.execute({ chatId })
    return http.send(response)
  }
}
