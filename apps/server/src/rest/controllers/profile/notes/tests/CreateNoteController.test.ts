import { mock, type Mock } from 'ts-jest-mocker'

import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type { NoteDto } from '@stardust/core/profile/entities/dtos'
import type { NotesRepository } from '@stardust/core/profile/interfaces'
import { CreateNoteUseCase } from '@stardust/core/profile/use-cases'

import { CreateNoteController } from '../CreateNoteController'

type Schema = {
  body: {
    title: string
    content: string
  }
}

describe('Create Note Controller', () => {
  let http: Mock<Http<Schema>>
  let repository: Mock<NotesRepository>
  let controller: CreateNoteController

  beforeEach(() => {
    http = mock()
    repository = mock()
    controller = new CreateNoteController(repository)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should extract body and account id and execute create note use case', async () => {
    const body = {
      title: 'Minha nota',
      content: 'Conteudo em markdown',
    }
    const userId = 'user-id'
    const response: NoteDto = {
      id: 'note-id',
      title: body.title,
      content: body.content,
      userId,
    }
    const restResponse = mock<RestResponse>()
    const executeSpy = jest
      .spyOn(CreateNoteUseCase.prototype, 'execute')
      .mockResolvedValue(response)

    http.getBody.mockResolvedValue(body)
    http.getAccountId.mockResolvedValue(userId)
    http.statusCreated.mockReturnValue(http)
    http.send.mockReturnValue(restResponse)

    await controller.handle(http)

    expect(http.getBody).toHaveBeenCalledTimes(1)
    expect(http.getAccountId).toHaveBeenCalledTimes(1)
    expect(executeSpy).toHaveBeenCalledWith({
      noteTitle: body.title,
      noteContent: body.content,
      userId,
    })
  })

  it('should respond with statusCreated().send(response)', async () => {
    const body = {
      title: 'Minha nota',
      content: 'Conteudo em markdown',
    }
    const userId = 'user-id'
    const response: NoteDto = {
      id: 'note-id',
      title: body.title,
      content: body.content,
      userId,
    }
    const restResponse = mock<RestResponse>()

    jest.spyOn(CreateNoteUseCase.prototype, 'execute').mockResolvedValue(response)
    http.getBody.mockResolvedValue(body)
    http.getAccountId.mockResolvedValue(userId)
    http.statusCreated.mockReturnValue(http)
    http.send.mockReturnValue(restResponse)

    const result = await controller.handle(http)

    expect(http.statusCreated).toHaveBeenCalledTimes(1)
    expect(http.send).toHaveBeenCalledWith(response)
    expect(result).toBe(restResponse)
  })

  it('should handle empty content on create flow', async () => {
    const body = {
      title: 'Minha nota',
      content: '',
    }
    const userId = 'user-id'
    const response: NoteDto = {
      id: 'note-id',
      title: body.title,
      content: body.content,
      userId,
    }

    jest.spyOn(CreateNoteUseCase.prototype, 'execute').mockResolvedValue(response)
    http.getBody.mockResolvedValue(body)
    http.getAccountId.mockResolvedValue(userId)
    http.statusCreated.mockReturnValue(http)
    http.send.mockReturnValue(mock<RestResponse>())

    await controller.handle(http)

    expect(CreateNoteUseCase.prototype.execute).toHaveBeenCalledWith({
      noteTitle: body.title,
      noteContent: body.content,
      userId,
    })
    expect(http.statusCreated).toHaveBeenCalledTimes(1)
  })
})
