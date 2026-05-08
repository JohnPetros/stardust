import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { NoteDto } from '@stardust/core/profile/entities/dtos'
import type { NotesRepository } from '@stardust/core/profile/interfaces'
import { UpdateNoteUseCase } from '@stardust/core/profile/use-cases'

import { UpdateNoteController } from '../UpdateNoteController'

type Schema = {
  routeParams: {
    noteId: string
  }
  body: {
    title: string
    content: string
  }
}

describe('Update Note Controller', () => {
  let http: Mock<Http<Schema>>
  let repository: Mock<NotesRepository>
  let controller: UpdateNoteController

  beforeEach(() => {
    http = mock()
    repository = mock()
    controller = new UpdateNoteController(repository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should extract route params, body and account id and execute update note use case', async () => {
    const noteId = 'note-id'
    const body = {
      title: 'Nota atualizada',
      content: 'Conteudo atualizado',
    }
    const userId = 'user-id'
    const response: NoteDto = {
      id: noteId,
      title: body.title,
      content: body.content,
      userId,
    }
    const restResponse = mock<RestResponse>()
    const executeSpy = jest
      .spyOn(UpdateNoteUseCase.prototype, 'execute')
      .mockResolvedValue(response)

    http.getRouteParams.mockReturnValue({ noteId })
    http.getBody.mockResolvedValue(body)
    http.getAccountId.mockResolvedValue(userId)
    http.statusOk.mockReturnValue(http)
    http.send.mockReturnValue(restResponse)

    await controller.handle(http)

    expect(http.getRouteParams).toHaveBeenCalledTimes(1)
    expect(http.getBody).toHaveBeenCalledTimes(1)
    expect(http.getAccountId).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith({
      noteId,
      noteTitle: body.title,
      noteContent: body.content,
      userId,
    })
  })

  it('should respond with statusOk().send(response)', async () => {
    const noteId = 'note-id'
    const body = {
      title: 'Nota atualizada',
      content: 'Conteudo atualizado',
    }
    const userId = 'user-id'
    const response: NoteDto = {
      id: noteId,
      title: body.title,
      content: body.content,
      userId,
    }
    const restResponse = mock<RestResponse>()

    jest.spyOn(UpdateNoteUseCase.prototype, 'execute').mockResolvedValue(response)
    http.getRouteParams.mockReturnValue({ noteId })
    http.getBody.mockResolvedValue(body)
    http.getAccountId.mockResolvedValue(userId)
    http.statusOk.mockReturnValue(http)
    http.send.mockReturnValue(restResponse)

    const result = await controller.handle(http)

    expect(http.statusOk).toHaveBeenCalledTimes(1)
    expect(http.send).toHaveBeenCalledWith(response)
    expect(result).toBe(restResponse)
  })
})
