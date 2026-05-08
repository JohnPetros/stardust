import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import { PaginationResponse, type RestResponse } from '@stardust/core/global/responses'
import type { NoteDto } from '@stardust/core/profile/entities/dtos'
import type { NotesRepository } from '@stardust/core/profile/interfaces'
import { ListNotesUseCase } from '@stardust/core/profile/use-cases'

import { ListNotesController } from '../ListNotesController'

type Schema = {
  queryParams: {
    page: number
    itemsPerPage: number
    search: string
  }
}

describe('List Notes Controller', () => {
  let http: Mock<Http<Schema>>
  let repository: Mock<NotesRepository>
  let controller: ListNotesController

  beforeEach(() => {
    http = mock()
    repository = mock()
    controller = new ListNotesController(repository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should extract query params and account id and execute list notes use case', async () => {
    const queryParams = {
      page: 2,
      itemsPerPage: 5,
      search: 'rascunho',
    }
    const userId = 'user-id'
    const note: NoteDto = {
      id: 'note-id',
      title: 'Minha nota',
      content: 'Conteudo em markdown',
      userId,
    }
    const response = new PaginationResponse({
      items: [note],
      totalItemsCount: 1,
      page: queryParams.page,
      itemsPerPage: queryParams.itemsPerPage,
    })
    const restResponse = mock<RestResponse>()
    const executeSpy = jest
      .spyOn(ListNotesUseCase.prototype, 'execute')
      .mockResolvedValue(response)

    http.getQueryParams.mockReturnValue(queryParams)
    http.getAccountId.mockResolvedValue(userId)
    http.sendPagination.mockReturnValue(restResponse)

    const result = await controller.handle(http)

    expect(http.getQueryParams).toHaveBeenCalledTimes(1)
    expect(http.getAccountId).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith({
      userId,
      page: queryParams.page,
      itemsPerPage: queryParams.itemsPerPage,
      search: queryParams.search,
    })
    expect(http.sendPagination).toHaveBeenCalledWith(response)
    expect(result).toBe(restResponse)
  })
})
