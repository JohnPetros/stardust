import { mock, type Mock } from 'ts-jest-mocker'
import { Id } from '#global/domain/structures/Id'
import { ListChatMessagesUseCase } from '../ListChatMessagesUseCase'
import { Chat } from '../../domain/entities'
import { ChatMessage } from '../../domain/structures'
import type { ChatMessagesRepository, ChatsRepository } from '../../interfaces'

describe('List Chat Messages Use Case', () => {
  let chatsRepository: Mock<ChatsRepository>
  let chatMessagesRepository: Mock<ChatMessagesRepository>
  let useCase: ListChatMessagesUseCase

  beforeEach(() => {
    chatsRepository = mock<ChatsRepository>()
    chatMessagesRepository = mock<ChatMessagesRepository>()

    chatsRepository.findById.mockImplementation()
    chatsRepository.findLastCreatedByUser.mockImplementation()
    chatsRepository.add.mockImplementation()
    chatsRepository.replace.mockImplementation()

    chatMessagesRepository.findAllByChat.mockImplementation()

    useCase = new ListChatMessagesUseCase(chatsRepository, chatMessagesRepository)
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

    chatsRepository.findById.mockResolvedValue(chat)
    chatMessagesRepository.findAllByChat.mockResolvedValue(messages)

    const result = await useCase.execute({
      chatId: chatId.value,
      userId: Id.create().value,
    })

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(chatMessageId.value)
  })

  it('should create a new chat if chat does not exist and no previous "Novo chat"', async () => {
    chatsRepository.findById.mockResolvedValue(null)
    chatsRepository.findLastCreatedByUser.mockResolvedValue(null)

    const chatId = Id.create().value
    const userId = Id.create().value

    const result = await useCase.execute({ chatId, userId })

    expect(result).toEqual([])
    expect(chatsRepository.add).toHaveBeenCalledTimes(1)
    expect(chatsRepository.add).toHaveBeenCalledWith(
      expect.objectContaining({
        name: expect.objectContaining({ value: 'Novo chat' }),
        id: expect.objectContaining({ value: chatId }),
      }),
      expect.objectContaining({ value: userId }),
    )
  })

  it('should rename previous chat and create new one if chat does not exist and previous chat is "Novo chat"', async () => {
    chatsRepository.findById.mockResolvedValue(null)
    const lastChatId = Id.create()
    const lastChat = Chat.create({ id: lastChatId.value, name: 'Novo chat' })
    chatsRepository.findLastCreatedByUser.mockResolvedValue(lastChat)

    const chatId = Id.create().value
    const userId = Id.create().value

    const result = await useCase.execute({ chatId, userId })

    expect(result).toEqual([])

    // Should rename the previous chat
    expect(chatsRepository.replace).toHaveBeenCalledTimes(1)
    expect(chatsRepository.replace).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.objectContaining({ value: lastChatId.value }),
        name: expect.objectContaining({ value: 'Novo chat(1)' }),
      }),
    )

    // Should create the new chat
    expect(chatsRepository.add).toHaveBeenCalledTimes(1)
    expect(chatsRepository.add).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.objectContaining({ value: chatId }),
        name: expect.objectContaining({ value: 'Novo chat' }),
      }),
      expect.objectContaining({ value: userId }),
    )
  })
})
