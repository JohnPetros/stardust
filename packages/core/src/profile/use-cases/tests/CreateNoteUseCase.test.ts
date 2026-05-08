import { mock, type Mock } from 'ts-jest-mocker'

import { NotesFaker } from '#profile/domain/entities/fakers/NotesFaker'
import type { NotesRepository } from '../../interfaces'
import { CreateNoteUseCase } from '../CreateNoteUseCase'

describe('Create Note Use Case', () => {
  let repository: Mock<NotesRepository>
  let useCase: CreateNoteUseCase

  beforeEach(() => {
    repository = mock<NotesRepository>()
    repository.add.mockImplementation()
    useCase = new CreateNoteUseCase(repository)
  })

  it('should create a note', async () => {
    const dto = NotesFaker.fakeDto()

    await useCase.execute({
      noteTitle: dto.title,
      noteContent: dto.content,
      userId: dto.userId,
    })

    expect(repository.add).toHaveBeenCalledTimes(1)
    expect(repository.add.mock.calls[0][0].dto).toEqual(
      expect.objectContaining({
        title: dto.title,
        content: dto.content,
        userId: dto.userId,
      }),
    )
  })

  it('should return the created note dto', async () => {
    const dto = NotesFaker.fakeDto()

    const response = await useCase.execute({
      noteTitle: dto.title,
      noteContent: dto.content,
      userId: dto.userId,
    })

    expect(response).toEqual(
      expect.objectContaining({
        title: dto.title,
        content: dto.content,
        userId: dto.userId,
      }),
    )
    expect(response.id).toBeDefined()
    expect(response.createdAt).toBeInstanceOf(Date)
    expect(response.updatedAt).toBeInstanceOf(Date)
  })
})
