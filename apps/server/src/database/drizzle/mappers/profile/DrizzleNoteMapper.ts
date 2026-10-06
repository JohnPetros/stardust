import { Note } from '@stardust/core/profile/entities'
import type { DrizzleNote, DrizzleInsertNote } from '../../types/entities/profile'

export class DrizzleNoteMapper {
  static toEntity(row: DrizzleNote): Note {
    return Note.create({
      id: row.id,
      ...DrizzleNoteMapper.content(row),
      userId: row.userId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    })
  }
  static toPersistence(note: Note): DrizzleInsertNote {
    return note.dto
  }
  private static content(row: DrizzleNote): Pick<DrizzleNote, 'title' | 'content'> {
    const { title, content } = row
    return { title, content }
  }
}
