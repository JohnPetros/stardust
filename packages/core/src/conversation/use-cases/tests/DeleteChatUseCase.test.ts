import { mock, type Mock } from 'ts-jest-mocker'
import { Id } from '#global/domain/structures/Id'
import { ChatNotFoundError } from '../../domain/errors'
import { DeleteChatUseCase } from '../DeleteChatUseCase'
import { Chat } from '../../domain/entities'
import type { ChatsRepository } from '../../interfaces'

describe('Delete Chat Use Case', () => {
  let repository: Mock<ChatsRepository>
  let useCase: DeleteChatUseCase

  beforeEach(() => {
    repository = mock<ChatsRepository>()
    repository.findById.mockImplementation()
    repository.remove.mockImplementation()

    useCase = new DeleteChatUseCase(repository)
  })

  it('should throw an error if the chat does not exist', async () => {
    repository.findById.mockResolvedValue(null)

    await expect(useCase.execute({ chatId: Id.create().value })).rejects.toThrow(
      ChatNotFoundError,
    )
  })

  it('should remove the chat', async () => {
    const chatId = Id.create().value
    const chat = Chat.create({ id: chatId, name: 'Chat Name' })
    repository.findById.mockResolvedValue(chat)

    await useCase.execute({ chatId: chatId })

    expect(repository.remove).toHaveBeenCalledWith(chat.id)
  })
})
