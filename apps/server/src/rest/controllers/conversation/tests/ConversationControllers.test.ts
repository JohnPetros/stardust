import { mock } from 'ts-jest-mocker'

import type {
  ChatMessagesRepository,
  ChatsRepository,
} from '@stardust/core/conversation/interfaces'
import { ChatFaker } from '@stardust/core/conversation/entities/fakers'
import {
  CreateChatUseCase,
  DeleteChatUseCase,
  EditChatNameUseCase,
  IncrementAssistantChatMessageCountUseCase,
  ListChatMessagesUseCase,
  ListChatsUseCase,
  SendChatMessageUseCase,
} from '@stardust/core/conversation/use-cases'
import type { ChatMessageDto } from '@stardust/core/conversation/structures/dtos'
import type { CacheProvider, Http } from '@stardust/core/global/interfaces'
import { PaginationResponse } from '@stardust/core/global/responses'
import type { RestResponse } from '@stardust/core/global/responses'

import * as controllers from '../index'

describe('Conversation controllers', () => {
  it('should export every controller from the barrel file', () => {
    expect(controllers.CreateChatController).toBeDefined()
    expect(controllers.DeleteChatController).toBeDefined()
    expect(controllers.EditChatNameController).toBeDefined()
    expect(controllers.FetchChatMessagesController).toBeDefined()
    expect(controllers.FetchChatsController).toBeDefined()
    expect(controllers.IncrementAssistantChatMessageCountController).toBeDefined()
    expect(controllers.SendChatMessageController).toBeDefined()
  })

  it('should create a chat and return a created response', async () => {
    const http = mock<Http>()
    const repository = mock<ChatsRepository>()
    const restResponse = mock<RestResponse>()
    const response = ChatFaker.fake().dto

    http.getAccountId.mockResolvedValue('user-id')
    http.statusCreated.mockReturnValue(http)
    http.send.mockReturnValue(restResponse)

    jest.spyOn(CreateChatUseCase.prototype, 'execute').mockResolvedValue(response)

    const controller = new controllers.CreateChatController(repository)
    const result = await controller.handle(http)

    expect(result).toBe(restResponse)
    expect(http.statusCreated).toHaveBeenCalled()
    expect(http.send).toHaveBeenCalledWith(response)
  })

  it('should delete a chat by route param', async () => {
    const http = mock<Http<{ routeParams: { chatId: string } }>>()
    const repository = mock<ChatsRepository>()
    const restResponse = mock<RestResponse>()

    http.getRouteParams.mockReturnValue({ chatId: 'chat-id' })
    http.send.mockReturnValue(restResponse)

    const execute = jest
      .spyOn(DeleteChatUseCase.prototype, 'execute')
      .mockResolvedValue(undefined)

    const controller = new controllers.DeleteChatController(repository)
    const result = await controller.handle(http)

    expect(result).toBe(restResponse)
    expect(execute).toHaveBeenCalledWith({ chatId: 'chat-id' })
  })

  it('should edit a chat name from params and body', async () => {
    const http =
      mock<Http<{ routeParams: { chatId: string }; body: { chatName: string } }>>()
    const repository = mock<ChatsRepository>()
    const restResponse = mock<RestResponse>()
    const response = ChatFaker.fake({ name: 'Renamed chat' }).dto

    http.getRouteParams.mockReturnValue({ chatId: 'chat-id' })
    http.getBody.mockResolvedValue({ chatName: 'Renamed chat' })
    http.send.mockReturnValue(restResponse)

    const execute = jest
      .spyOn(EditChatNameUseCase.prototype, 'execute')
      .mockResolvedValue(response)

    const controller = new controllers.EditChatNameController(repository)
    const result = await controller.handle(http)

    expect(result).toBe(restResponse)
    expect(execute).toHaveBeenCalledWith({ chatId: 'chat-id', chatName: 'Renamed chat' })
  })

  it('should fetch chat messages from both repositories', async () => {
    const http = mock<Http<{ routeParams: { chatId: string } }>>()
    const chatsRepository = mock<ChatsRepository>()
    const chatMessagesRepository = mock<ChatMessagesRepository>()
    const restResponse = mock<RestResponse>()
    const response: ChatMessageDto[] = [
      {
        id: 'message-id',
        content: 'Hello there',
        sender: 'user',
      },
    ]

    http.getRouteParams.mockReturnValue({ chatId: 'chat-id' })
    http.send.mockReturnValue(restResponse)

    const execute = jest
      .spyOn(ListChatMessagesUseCase.prototype, 'execute')
      .mockResolvedValue(response)

    const controller = new controllers.FetchChatMessagesController(
      chatsRepository,
      chatMessagesRepository,
    )
    const result = await controller.handle(http)

    expect(result).toBe(restResponse)
    expect(execute).toHaveBeenCalledWith({ chatId: 'chat-id' })
  })

  it('should list chats with query params and account id', async () => {
    const http =
      mock<
        Http<{ queryParams: { search: string; page: number; itemsPerPage: number } }>
      >()
    const repository = mock<ChatsRepository>()
    const restResponse = mock<RestResponse>()
    const response = new PaginationResponse({
      items: [ChatFaker.fake().dto],
      page: 1,
      itemsPerPage: 10,
      totalItemsCount: 1,
    })

    http.getAccountId.mockResolvedValue('user-id')
    http.getQueryParams.mockReturnValue({ search: 'term', page: 1, itemsPerPage: 10 })
    http.statusOk.mockReturnValue(http)
    http.sendPagination.mockReturnValue(restResponse)

    const execute = jest
      .spyOn(ListChatsUseCase.prototype, 'execute')
      .mockResolvedValue(response)

    const controller = new controllers.FetchChatsController(repository)
    const result = await controller.handle(http)

    expect(result).toBe(restResponse)
    expect(execute).toHaveBeenCalledWith({
      userId: 'user-id',
      search: 'term',
      page: 1,
      itemsPerPage: 10,
    })
  })

  it('should increment assistant message count and return no content', async () => {
    const http = mock<Http>()
    const cache = mock<CacheProvider>()
    const restResponse = mock<RestResponse>()

    http.getAccountId.mockResolvedValue('user-id')
    http.statusNoContent.mockReturnValue(http)
    http.send.mockReturnValue(restResponse)

    const execute = jest
      .spyOn(IncrementAssistantChatMessageCountUseCase.prototype, 'execute')
      .mockResolvedValue(undefined)

    const controller = new controllers.IncrementAssistantChatMessageCountController(cache)
    const result = await controller.handle(http)

    expect(result).toBe(restResponse)
    expect(execute).toHaveBeenCalledWith({ userId: 'user-id' })
  })

  it('should send a chat message and return created response', async () => {
    const http = mock<Http<{ routeParams: { chatId: string }; body: ChatMessageDto }>>()
    const chatsRepository = mock<ChatsRepository>()
    const chatMessagesRepository = mock<ChatMessagesRepository>()
    const restResponse = mock<RestResponse>()
    const chatMessageDto: ChatMessageDto = {
      content: 'Hello there',
      sender: 'user',
    }
    const response: ChatMessageDto = {
      id: 'message-id',
      content: 'Hello there',
      sender: 'user',
    }

    http.getRouteParams.mockReturnValue({ chatId: 'chat-id' })
    http.getBody.mockResolvedValue(chatMessageDto)
    http.statusCreated.mockReturnValue(http)
    http.send.mockReturnValue(restResponse)

    const execute = jest
      .spyOn(SendChatMessageUseCase.prototype, 'execute')
      .mockResolvedValue(response)

    const controller = new controllers.SendChatMessageController(
      chatsRepository,
      chatMessagesRepository,
    )
    const result = await controller.handle(http)

    expect(result).toBe(restResponse)
    expect(execute).toHaveBeenCalledWith({ chatId: 'chat-id', chatMessageDto })
  })
})
