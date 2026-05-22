import type { ManyItems } from '@stardust/core/global/types'
import type { Note } from '@stardust/core/profile/entities'
import type { NotesRepository } from '@stardust/core/profile/interfaces'
import type { Id, OrdinalNumber, Text } from '@stardust/core/global/structures'

import { SupabaseRepository } from '../SupabaseRepository'
import { SupabasePostgreError } from '../../errors'
import { SupabaseNoteMapper } from '../../mappers/profile'

export class SupabaseNotesRepository
  extends SupabaseRepository
  implements NotesRepository
{
  async findById(noteId: Id): Promise<Note | null> {
    const { data, error } = await this.supabase
      .from('notes')
      .select('*')
      .eq('id', noteId.value)
      .single()

    if (error) {
      return this.handleQueryPostgresError(error)
    }

    return SupabaseNoteMapper.toEntity(data)
  }

  async findManyByUser({
    userId,
    page,
    itemsPerPage,
    search,
  }: {
    userId: Id
    page: OrdinalNumber
    itemsPerPage: OrdinalNumber
    search: Text
  }): Promise<ManyItems<Note>> {
    const range = this.calculateQueryRange(page.value, itemsPerPage.value)

    const { data, error, count } = await this.supabase
      .from('notes')
      .select('*', { count: 'exact' })
      .eq('user_id', userId.value)
      .ilike('title', `%${search.value}%`)
      .order('updated_at', { ascending: false })
      .range(range.from, range.to)

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return {
      items: data.map(SupabaseNoteMapper.toEntity),
      count: Number(count),
    }
  }

  async add(note: Note): Promise<void> {
    const supabaseNote = SupabaseNoteMapper.toSupabase(note)

    const { error } = await this.supabase.from('notes').insert(supabaseNote)

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async replace(note: Note): Promise<void> {
    const supabaseNote = SupabaseNoteMapper.toSupabase(note)

    const { error } = await this.supabase
      .from('notes')
      .update({
        title: supabaseNote.title,
        content: supabaseNote.content,
        updated_at: supabaseNote.updated_at,
      })
      .eq('id', note.id.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async remove(noteId: Id): Promise<void> {
    const { error } = await this.supabase.from('notes').delete().eq('id', noteId.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }
}
