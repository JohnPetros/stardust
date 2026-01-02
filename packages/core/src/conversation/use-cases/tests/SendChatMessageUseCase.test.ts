import { mock, type Mock } from 'ts-jest-mocker'
import { Id } from '#global/domain/structures/Id'
import { ChatMessagesExceededError, ChatNotFoundError } from '../../domain/errors'
import { SendChatMessageUseCase } from '../SendChatMessageUseCase'
import { Chat } from '../../domain/entities'
import { ChatMessage } from '../../domain/structures'
import type { ChatMessagesRepository, ChatsRepository } from '../../interfaces'
import type { ChatMessageDto } from '../../domain/structures/dtos'

describe('Send Chat Message Use Case', () => {
  let chatsRepository: Mock<ChatsRepository>
  let chatMessagesRepository: Mock<ChatMessagesRepository>
  let useCase: SendChatMessageUseCase

  beforeEach(() => {
    chatsRepository = mock<ChatsRepository>()
    chatMessagesRepository = mock<ChatMessagesRepository>()

    chatsRepository.findById.mockImplementation()
    chatMessagesRepository.findAllByChat.mockImplementation()
    chatMessagesRepository.add.mockImplementation()

    useCase = new SendChatMessageUseCase(chatsRepository, chatMessagesRepository)
  })

  it('should throw an error if the chat does not exist', async () => {
    chatsRepository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({
        chatId: Id.create().value,
        chatMessageDto: {} as ChatMessageDto,
      }),
    ).rejects.toThrow(ChatNotFoundError)
  })

  it('should send and add a message to the chat', async () => {
    const chatId = Id.create().value
    const chat = Chat.create({ id: chatId, name: 'Chat Name' })

    chatsRepository.findById.mockResolvedValue(chat)
    chatMessagesRepository.findAllByChat.mockResolvedValue([])

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

    expect(chatMessagesRepository.add).toHaveBeenCalledWith(
      chat.id,
      expect.any(ChatMessage),
    )
    expect(result).toEqual(chatMessageDto)
  })
})
