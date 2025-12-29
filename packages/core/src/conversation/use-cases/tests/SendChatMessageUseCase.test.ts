import { mock, type Mock } from 'ts-jest-mocker'
import { Id } from '#global/domain/structures/Id'
import { ChatMessagesExceededError, ChatNotFoundError } from '../../domain/errors'
import { SendChatMessageUseCase } from '../SendChatMessageUseCase'
import { Chat } from '../../domain/entities'
import { ChatMessage } from '../../domain/structures'
import type { ChatsRepository } from '../../interfaces'
import type { ChatMessageDto } from '../../domain/structures/dtos'

describe('Send Chat Message Use Case', () => {
  let repository: Mock<ChatsRepository>
  let useCase: SendChatMessageUseCase

  beforeEach(() => {
    repository = mock<ChatsRepository>()
    repository.findById.mockImplementation()
    repository.findAllMessagesByChat.mockImplementation()
    repository.addMessage.mockImplementation()

    useCase = new SendChatMessageUseCase(repository)
  })

  it('should throw an error if the chat does not exist', async () => {
    repository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({
        chatId: Id.create().value,
        chatMessageDto: {} as ChatMessageDto,
      }),
    ).rejects.toThrow(ChatNotFoundError)
  })

  it('should throw an error if the max messages limit is exceeded', async () => {
    const chatId = Id.create().value
    const chat = Chat.create({ id: chatId, name: 'Chat Name' })
    const messages = Array.from({ length: 50 }, () =>
      ChatMessage.create({
        id: Id.create().value,
        content: 'content',
        sender: 'user',
        sentAt: new Date().toISOString(),
      }),
    )

    repository.findById.mockResolvedValue(chat)
    repository.findAllMessagesByChat.mockResolvedValue(messages)

    await expect(
      useCase.execute({
        chatId: chatId,
        chatMessageDto: {} as ChatMessageDto,
      }),
    ).rejects.toThrow(ChatMessagesExceededError)
  })

  it('should send and add a message to the chat', async () => {
    const chatId = Id.create().value
    const chat = Chat.create({ id: chatId, name: 'Chat Name' })

    repository.findById.mockResolvedValue(chat)
    repository.findAllMessagesByChat.mockResolvedValue([])

    const chatMessageDto: ChatMessageDto = {
      id: Id.create().value,
      content: 'Hello World',
      sender: 'user',
      sentAt: new Date().toISOString(),
    }

    const result = await useCase.execute({
      chatId: chatId,
      chatMessageDto,
    })

    expect(repository.addMessage).toHaveBeenCalledWith(chat.id, expect.any(ChatMessage))
    expect(result).toEqual(chatMessageDto)
  })
})
