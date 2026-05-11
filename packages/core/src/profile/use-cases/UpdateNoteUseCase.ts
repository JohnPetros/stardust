import { Id, Text } from '#global/domain/structures/index'
import type { UseCase } from '#global/interfaces/UseCase'
import type { NoteDto } from '../domain/entities/dtos'
import { NoteNotFoundError } from '../domain/errors'
import type { NotesRepository } from '../interfaces'

type Request = {
  noteId: string
  noteTitle: string
  noteContent: string
  userId: string
}

type Response = Promise<NoteDto>

export class UpdateNoteUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: NotesRepository) {}

  async execute({ noteId, noteTitle, noteContent, userId }: Request): Response {
    const note = await this.findNote(Id.create(noteId), Id.create(userId))

    note.updateTitle(Text.create(noteTitle))
    note.updateContent(Text.create(noteContent))
    note.touch()

    await this.repository.replace(note)
    return note.dto
  }

  private async findNote(noteId: Id, userId: Id) {
    const note = await this.repository.findById(noteId)

    if (!note || note.userId.value !== userId.value) {
      throw new NoteNotFoundError()
    }

    return note
  }
}
