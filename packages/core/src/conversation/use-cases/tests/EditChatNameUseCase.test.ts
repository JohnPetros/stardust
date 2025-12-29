import { mock, type Mock } from 'ts-jest-mocker'
import { Id } from '#global/domain/structures/Id'
import { ChatNotFoundError } from '../../domain/errors'
import { EditChatNameUseCase } from '../EditChatNameUseCase'
import { Chat } from '../../domain/entities'
import type { ChatsRepository } from '../../interfaces'

describe('Edit Chat Name Use Case', () => {
  let repository: Mock<ChatsRepository>
  let useCase: EditChatNameUseCase

  beforeEach(() => {
    repository = mock<ChatsRepository>()
    repository.findById.mockImplementation()
    repository.replace.mockImplementation()

    useCase = new EditChatNameUseCase(repository)
  })

  it('should throw an error if the chat does not exist', async () => {
    repository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({ chatId: Id.create().value, chatName: 'New Name' }),
    ).rejects.toThrow(ChatNotFoundError)
  })

  it('should update the chat name', async () => {
    const chatId = Id.create().value
    const chat = Chat.create({ id: chatId, name: 'Old Name' })
    repository.findById.mockResolvedValue(chat)

    const result = await useCase.execute({ chatId: chatId, chatName: 'New Name' })

    expect(chat.name.value).toBe('New Name')
    expect(repository.replace).toHaveBeenCalledWith(chat)
    expect(result.name).toBe('New Name')
  })
})
