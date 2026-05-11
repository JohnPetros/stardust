import type { NoteDto } from '@stardust/core/profile/entities/dtos'
import { Note } from '@stardust/core/profile/entities'

import type { SupabaseNote } from '../../types'

export class SupabaseNoteMapper {
  static toEntity(supabaseNote: SupabaseNote): Note {
    return Note.create(SupabaseNoteMapper.toDto(supabaseNote))
  }

  static toDto(supabaseNote: SupabaseNote): NoteDto {
    return {
      id: supabaseNote.id,
      title: supabaseNote.title,
      content: supabaseNote.content,
      userId: supabaseNote.user_id,
      createdAt: new Date(supabaseNote.created_at),
      updatedAt: new Date(supabaseNote.updated_at),
    }
  }

  static toSupabase(note: Note): SupabaseNote {
    return {
      id: note.id.value,
      title: note.title.value,
      content: note.content.value,
      user_id: note.userId.value,
      created_at: note.createdAt.toUTCString(),
      updated_at: note.updatedAt.toUTCString(),
    }
  }
}
