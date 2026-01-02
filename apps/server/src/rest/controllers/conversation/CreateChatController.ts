import type { ChatsRepository } from '@stardust/core/conversation/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import { CreateChatUseCase } from '@stardust/core/conversation/use-cases'

export class CreateChatController implements Controller {
  constructor(private readonly repository: ChatsRepository) {}

  async handle(http: Http) {
    const userId = await http.getAccountId()
    const useCase = new CreateChatUseCase(this.repository)
    const response = await useCase.execute({ userId })
    return http.statusCreated().send(response)
  }
}
