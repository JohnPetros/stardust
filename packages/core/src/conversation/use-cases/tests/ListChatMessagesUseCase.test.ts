import { mock, type Mock } from 'ts-jest-mocker'
import { Id } from '#global/domain/structures/Id'
import { ListChatMessagesUseCase } from '../ListChatMessagesUseCase'
import { Chat } from '../../domain/entities'
import { ChatMessage } from '../../domain/structures'
import type { ChatsRepository } from '../../interfaces'

describe('List Chat Messages Use Case', () => {
  let repository: Mock<ChatsRepository>
  let useCase: ListChatMessagesUseCase

  beforeEach(() => {
    repository = mock<ChatsRepository>()
    repository.findById.mockImplementation()
    repository.findLastCreatedByUser.mockImplementation()
    repository.findAllMessagesByChat.mockImplementation()
    repository.add.mockImplementation()

    useCase = new ListChatMessagesUseCase(repository)
  })

  it('should return chat messages if chat exists', async () => {
    const chatId = Id.create()
    const chat = Chat.create({ id: chatId.value, name: 'Chat Name' })
    const chatMessageId = Id.create()
    const messages = [
      ChatMessage.create({
        id: chatMessageId.value,
        content: 'hello',
        sender: 'user',
        sentAt: new Date().toISOString(),
      }),
    ]

    repository.findById.mockResolvedValue(chat)
    repository.findAllMessagesByChat.mockResolvedValue(messages)

    const result = await useCase.execute({
      chatId: chatId.value,
      userId: Id.create().value,
    })

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(chatMessageId.value)
  })

  it('should create a new chat if chat does not exist and no previous "Novo chat"', async () => {
    repository.findById.mockResolvedValue(null)
    repository.findLastCreatedByUser.mockResolvedValue(null)

    const chatId = Id.create().value
    const userId = Id.create().value

    const result = await useCase.execute({ chatId, userId })

    expect(result).toEqual([])
    expect(repository.add).toHaveBeenCalledTimes(1)
    expect(repository.add).toHaveBeenCalledWith(
      expect.objectContaining({
        name: expect.objectContaining({ value: 'Novo chat' }),
        id: expect.objectContaining({ value: chatId }),
      }),
    )
  })

  it('should rename previous chat and create new one if chat does not exist and previous chat is "Novo chat"', async () => {
    repository.findById.mockResolvedValue(null)
    const lastChatId = Id.create()
    const lastChat = Chat.create({ id: lastChatId.value, name: 'Novo chat' })
    repository.findLastCreatedByUser.mockResolvedValue(lastChat)

    const chatId = Id.create().value
    const userId = Id.create().value

    const result = await useCase.execute({ chatId, userId })

    expect(result).toEqual([])
    expect(repository.add).toHaveBeenCalledTimes(2)

    // Check first call (deduplicated name)
    expect(repository.add).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        id: expect.objectContaining({ value: chatId }),
        name: expect.objectContaining({ value: 'Novo chat(1)' }),
      }),
    )

    // Check second call (new chat name)
    expect(repository.add).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        id: expect.objectContaining({ value: chatId }),
        name: expect.objectContaining({ value: 'Novo chat' }),
      }),
    )
  })
})
