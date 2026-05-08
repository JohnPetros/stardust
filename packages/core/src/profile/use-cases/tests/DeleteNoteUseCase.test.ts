import { mock, type Mock } from 'ts-jest-mocker'

import { NoteNotFoundError } from '#profile/domain/errors/NoteNotFoundError'
import { NotesFaker } from '#profile/domain/entities/fakers/NotesFaker'
import type { NotesRepository } from '../../interfaces'
import { DeleteNoteUseCase } from '../DeleteNoteUseCase'

describe('Delete Note Use Case', () => {
  let repository: Mock<NotesRepository>
  let useCase: DeleteNoteUseCase

  beforeEach(() => {
    repository = mock<NotesRepository>()
    repository.findById.mockImplementation()
    repository.remove.mockImplementation()
    useCase = new DeleteNoteUseCase(repository)
  })

  it('should throw an error if the note is not found', async () => {
    const note = NotesFaker.fake()
    repository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({
        noteId: note.id.value,
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
        userId: NotesFaker.fake().userId.value,
      }),
    ).rejects.toThrow(NoteNotFoundError)
  })

  it('should remove the note', async () => {
    const note = NotesFaker.fake()
    repository.findById.mockResolvedValue(note)

    await useCase.execute({
      noteId: note.id.value,
      userId: note.userId.value,
    })

    expect(repository.remove).toHaveBeenCalledTimes(1)
    expect(repository.remove).toHaveBeenCalledWith(note.id)
  })
})
