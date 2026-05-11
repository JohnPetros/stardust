import type { Id, OrdinalNumber, Text } from '#global/domain/structures/index'
import type { ManyItems } from '#global/domain/types/ManyItems'
import type { Note } from '../domain/entities'

export interface NotesRepository {
  findById(noteId: Id): Promise<Note | null>
  findManyByUser(params: {
    userId: Id
    page: OrdinalNumber
    itemsPerPage: OrdinalNumber
    search: Text
  }): Promise<ManyItems<Note>>
  add(note: Note): Promise<void>
  replace(note: Note): Promise<void>
  remove(noteId: Id): Promise<void>
}
