import { mock, type Mock } from 'ts-jest-mocker'
import { CreateChatUseCase } from '../CreateChatUseCase'
import type { ChatsRepository } from '../../interfaces'
import { Chat } from '../../domain/entities'
import { Id } from '#global/domain/structures/Id'

describe('Create Chat Use Case', () => {
  let repository: Mock<ChatsRepository>
  let useCase: CreateChatUseCase

  beforeEach(() => {
    repository = mock<ChatsRepository>()
    repository.findLastCreatedByUser.mockImplementation()
    repository.add.mockImplementation()

    useCase = new CreateChatUseCase(repository)
  })

  it('should create a chat with the default name when there is no previous chat', async () => {
    repository.findLastCreatedByUser.mockResolvedValue(null)
    const userId = Id.create().value

    const chat = await useCase.execute({ userId })

    const [createdChat, savedUserId] = repository.add.mock.calls[0]
    expect(savedUserId.value).toBe(userId)
    expect(createdChat.name.value).toBe('Novo chat')
    expect(chat.name).toBe('Novo chat')
  })

  it('should deduplicate the default chat name when the last chat already uses it', async () => {
    const lastChat = Chat.create({ id: Id.create().value, name: 'Novo chat(2)' })
    repository.findLastCreatedByUser.mockResolvedValue(lastChat)

    const userId = Id.create().value
    const chat = await useCase.execute({ userId })

    const [createdChat] = repository.add.mock.calls[0]
    expect(createdChat.name.value).toBe('Novo chat(3)')
    expect(chat.name).toBe('Novo chat(3)')
  })
})
