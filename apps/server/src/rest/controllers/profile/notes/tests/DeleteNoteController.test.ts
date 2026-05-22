import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { NotesRepository } from '@stardust/core/profile/interfaces'
import { DeleteNoteUseCase } from '@stardust/core/profile/use-cases'

import { DeleteNoteController } from '../DeleteNoteController'

type Schema = {
  routeParams: {
    noteId: string
  }
}

describe('Delete Note Controller', () => {
  let http: Mock<Http<Schema>>
  let repository: Mock<NotesRepository>
  let controller: DeleteNoteController

  beforeEach(() => {
    http = mock()
    repository = mock()
    controller = new DeleteNoteController(repository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should extract route params and account id and execute delete note use case', async () => {
    const noteId = 'note-id'
    const userId = 'user-id'
    const restResponse = mock<RestResponse>()
    const executeSpy = jest
      .spyOn(DeleteNoteUseCase.prototype, 'execute')
      .mockResolvedValue()

    http.getRouteParams.mockReturnValue({ noteId })
    http.getAccountId.mockResolvedValue(userId)
    http.statusOk.mockReturnValue(http)
    http.send.mockReturnValue(restResponse)

    await controller.handle(http)

    expect(http.getRouteParams).toHaveBeenCalledTimes(1)
    expect(http.getAccountId).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith({ noteId, userId })
  })

  it('should respond with statusOk().send(response)', async () => {
    const noteId = 'note-id'
    const userId = 'user-id'
    const restResponse = mock<RestResponse>()

    jest.spyOn(DeleteNoteUseCase.prototype, 'execute').mockResolvedValue()
    http.getRouteParams.mockReturnValue({ noteId })
    http.getAccountId.mockResolvedValue(userId)
    http.statusOk.mockReturnValue(http)
    http.send.mockReturnValue(restResponse)

    const result = await controller.handle(http)

    expect(http.statusOk).toHaveBeenCalledTimes(1)
    expect(http.send).toHaveBeenCalledWith(undefined)
    expect(result).toBe(restResponse)
  })
})
