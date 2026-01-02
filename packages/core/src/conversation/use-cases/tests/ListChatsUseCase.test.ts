import { mock, type Mock } from 'ts-jest-mocker'
import { ListChatsUseCase } from '../ListChatsUseCase'
import type { ChatsRepository } from '../../interfaces'
import { Chat } from '../../domain/entities'
import { Id } from '#global/domain/structures/Id'
import { PaginationResponse } from '#global/responses/PaginationResponse'
import { Text } from '#global/domain/structures/Text'
import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'

describe('List Chats Use Case', () => {
  let repository: Mock<ChatsRepository>
  let useCase: ListChatsUseCase

  beforeEach(() => {
    repository = mock<ChatsRepository>()
    repository.findManyByUser.mockImplementation()

    useCase = new ListChatsUseCase(repository)
  })

  it('should list chats with pagination', async () => {
    const request = {
      userId: Id.create().value,
      search: 'rocket',
      page: 2,
      itemsPerPage: 5,
    }

    const chat = Chat.create({ id: Id.create().value, name: 'Rocket Chat' })
    repository.findManyByUser.mockResolvedValue({ items: [chat], count: 1 })

    const response = await useCase.execute(request)

    expect(repository.findManyByUser).toHaveBeenCalledWith({
      userId: expect.any(Id),
      search: expect.any(Text),
      page: expect.any(OrdinalNumber),
      itemsPerPage: expect.any(OrdinalNumber),
    })

    const callArgs = repository.findManyByUser.mock.calls[0][0]
    expect(callArgs.userId.value).toBe(request.userId)
    expect(callArgs.search?.value).toBe(request.search)
    expect(callArgs.page.value).toBe(request.page)
    expect(callArgs.itemsPerPage.value).toBe(request.itemsPerPage)

    expect(response).toEqual(new PaginationResponse([chat.dto], 1, request.itemsPerPage))
  })
})
