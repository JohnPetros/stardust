import type { UseCase } from '#global/interfaces/UseCase'
import type { NoteDto } from '../domain/entities/dtos'
import { Note } from '../domain/entities'
import type { NotesRepository } from '../interfaces'

type Request = {
  noteTitle: string
  noteContent: string
  userId: string
}

type Response = Promise<NoteDto>

export class CreateNoteUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: NotesRepository) {}

  async execute({ noteTitle, noteContent, userId }: Request): Response {
    const note = Note.create({
      title: noteTitle,
      content: noteContent,
      userId,
    })

    await this.repository.add(note)
    return note.dto
  }
}
