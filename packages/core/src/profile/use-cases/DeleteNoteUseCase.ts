import { Id } from '#global/domain/structures/index'
import type { UseCase } from '#global/interfaces/UseCase'
import { NoteNotFoundError } from '../domain/errors'
import type { NotesRepository } from '../interfaces'

type Request = {
  noteId: string
  userId: string
}

type Response = Promise<void>

export class DeleteNoteUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: NotesRepository) {}

  async execute({ noteId, userId }: Request): Response {
    const note = await this.repository.findById(Id.create(noteId))

    if (!note || note.userId.value !== userId) {
      throw new NoteNotFoundError()
    }

    await this.repository.remove(note.id)
  }
}
