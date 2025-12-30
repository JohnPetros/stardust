import type {
  ChatMessagesRepository,
  ChatsRepository,
} from '@stardust/core/conversation/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import { ListChatMessagesUseCase } from '@stardust/core/conversation/use-cases'

type Schema = {
  routeParams: {
    chatId: string
  }
}

export class FetchChatMessagesController implements Controller<Schema> {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly chatMessagesRepository: ChatMessagesRepository,
  ) {}

  async handle(http: Http<Schema>) {
    const { chatId } = http.getRouteParams()
    const accountId = await http.getAccountId()
    const useCase = new ListChatMessagesUseCase(
      this.chatsRepository,
      this.chatMessagesRepository,
    )
    const response = await useCase.execute({ chatId, userId: accountId })
    return http.send(response)
  }
}
