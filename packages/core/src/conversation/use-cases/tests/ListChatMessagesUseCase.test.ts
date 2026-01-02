import { mock, type Mock } from 'ts-jest-mocker'
import { Id } from '#global/domain/structures/Id'
import { ListChatMessagesUseCase } from '../ListChatMessagesUseCase'
import { Chat } from '../../domain/entities'
import { ChatMessage } from '../../domain/structures'
import { ChatNotFoundError } from '../../domain/errors'
import type { ChatMessagesRepository, ChatsRepository } from '../../interfaces'

describe('List Chat Messages Use Case', () => {
  let chatsRepository: Mock<ChatsRepository>
  let chatMessagesRepository: Mock<ChatMessagesRepository>
  let useCase: ListChatMessagesUseCase

  beforeEach(() => {
    chatsRepository = mock<ChatsRepository>()
    chatMessagesRepository = mock<ChatMessagesRepository>()

    chatsRepository.findById.mockImplementation()
    chatMessagesRepository.findAllByChat.mockImplementation()

    useCase = new ListChatMessagesUseCase(chatsRepository, chatMessagesRepository)
  })

  it('should throw if the chat is not found', async () => {
    chatsRepository.findById.mockResolvedValue(null)

    await expect(useCase.execute({ chatId: Id.create().value })).rejects.toThrow(
      ChatNotFoundError,
    )
    expect(chatMessagesRepository.findAllByChat).not.toHaveBeenCalled()
  })

  it('should return chat messages when the chat exists', async () => {
    const chatId = Id.create()
    const chat = Chat.create({ id: chatId.value, name: 'Chat Name' })
    chatsRepository.findById.mockResolvedValue(chat)

    const message = ChatMessage.create({
      id: Id.create().value,
      content: 'Hello',
      sender: 'user',
      sentAt: new Date().toISOString(),
    })
    chatMessagesRepository.findAllByChat.mockResolvedValue([message])

    const response = await useCase.execute({ chatId: chatId.value })

    expect(chatMessagesRepository.findAllByChat).toHaveBeenCalledWith(chat.id)
    expect(response).toEqual([message.dto])
  })
})
