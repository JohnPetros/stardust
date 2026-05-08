import { mock, type Mock } from 'ts-jest-mocker'

import { NoteNotFoundError } from '#profile/domain/errors/NoteNotFoundError'
import { NotesFaker } from '#profile/domain/entities/fakers/NotesFaker'
import type { NotesRepository } from '../../interfaces'
import { UpdateNoteUseCase } from '../UpdateNoteUseCase'

describe('Update Note Use Case', () => {
  let repository: Mock<NotesRepository>
  let useCase: UpdateNoteUseCase

  beforeEach(() => {
    repository = mock<NotesRepository>()
    repository.findById.mockImplementation()
    repository.replace.mockImplementation()
    useCase = new UpdateNoteUseCase(repository)
  })

  it('should throw an error if the note is not found', async () => {
    const note = NotesFaker.fake()
    repository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({
        noteId: note.id.value,
        noteTitle: note.title.value,
        noteContent: note.content.value,
        userId: note.userId.value,
      }),
    ).rejects.toThrow(NoteNotFoundError)
  })

  it('should throw an error if the user does not own the note', async () => {
    const note = NotesFaker.fake()
    repository.findById.mockResolvedValue(note)

    await expect(
      useCase.execute({
        noteId: note.id.value,
        noteTitle: note.title.value,
        noteContent: note.content.value,
        userId: NotesFaker.fake().userId.value,
      }),
    ).rejects.toThrow(NoteNotFoundError)
  })

  it('should replace the note with the updated data', async () => {
    const note = NotesFaker.fake({ updatedAt: new Date('2026-05-01T00:00:00.000Z') })
    repository.findById.mockResolvedValue(note)
    const touchSpy = jest.spyOn(note, 'touch')
    const newTitle = 'Updated note title'
    const newContent = 'Updated note content'

    await useCase.execute({
      noteId: note.id.value,
      noteTitle: newTitle,
      noteContent: newContent,
      userId: note.userId.value,
    })

    expect(touchSpy).toHaveBeenCalledTimes(1)
    expect(note.title.value).toBe(newTitle)
    expect(note.content.value).toBe(newContent)
    expect(repository.replace).toHaveBeenCalledTimes(1)
    expect(repository.replace).toHaveBeenCalledWith(note)
  })

  it('should return the updated note dto', async () => {
    const note = NotesFaker.fake()
    repository.findById.mockResolvedValue(note)
    const newTitle = 'Updated note title'
    const newContent = 'Updated note content'

    const response = await useCase.execute({
      noteId: note.id.value,
      noteTitle: newTitle,
      noteContent: newContent,
      userId: note.userId.value,
    })

    expect(response).toEqual(
      expect.objectContaining({
        id: note.id.value,
        title: newTitle,
        content: newContent,
        userId: note.userId.value,
      }),
    )
    expect(response.updatedAt).toBeInstanceOf(Date)
  })
})
