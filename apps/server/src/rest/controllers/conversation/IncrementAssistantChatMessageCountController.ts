import type { CacheProvider, Controller, Http } from '@stardust/core/global/interfaces'
import { IncrementAssistantChatMessageCountUseCase } from '@stardust/core/conversation/use-cases'

export class IncrementAssistantChatMessageCountController implements Controller {
  constructor(private readonly cache: CacheProvider) {}

  async handle(http: Http) {
    const accountId = await http.getAccountId()
    const useCase = new IncrementAssistantChatMessageCountUseCase(this.cache)
    await useCase.execute({ userId: accountId })
    return http.statusNoContent().send()
  }
}
