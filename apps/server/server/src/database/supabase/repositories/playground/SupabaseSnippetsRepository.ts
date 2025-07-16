import type { SnippetsRepository } from '@stardust/core/playground/interfaces'
import type { Id } from '@stardust/core/global/structures'
import type { Snippet } from '@stardust/core/playground/entities'
import type { SnippetsListParams } from '@stardust/core/playground/types'

import { SupabaseRepository } from '../SupabaseRepository'
import { SupabaseSnippetMapper } from '../../mappers/playground'
import { SupabasePostgreError } from '../../errors'

export class SupabaseSnippetsRepository
  extends SupabaseRepository
  implements SnippetsRepository
{
  async findById(snippetId: Id) {
    const { data, error } = await this.supabase
      .from('snippets_view')
      .select('*')
      .eq('id', snippetId.value)
      .single()

    if (error) {
      return this.handleQueryPostgresError(error)
    }

    return SupabaseSnippetMapper.toEntity(data)
  }

  async findManySnippets({ page, itemsPerPage, authorId }: SnippetsListParams) {
    const range = this.calculateQueryRange(page.value, itemsPerPage.value)

    const { data, error, count } = await this.supabase
      .from('snippets_view')
      .select('*', { count: 'exact' })
      .eq('author_id', authorId.value)
      .range(range.from, range.to)

    if (error) {
      throw new SupabasePostgreError(error)
    }

    const snippets = data.map(SupabaseSnippetMapper.toEntity)

    return {
      snippets,
      totalSnippetsCount: Number(count),
    }
  }

  async add(snippet: Snippet) {
    const supabaseSnippet = SupabaseSnippetMapper.toSupabase(snippet)
    const { error } = await this.supabase.from('snippets').insert({
      // @ts-ignore
      id: snippet.id.value,
      code: supabaseSnippet.code,
      title: supabaseSnippet.title,
      is_public: supabaseSnippet.is_public,
      created_at: supabaseSnippet.created_at,
      user_id: supabaseSnippet.author_id,
    })

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async replace(snippet: Snippet) {
    const { error } = await this.supabase
      .from('snippets')
      .update({
        title: snippet.title.value,
        code: snippet.code.value,
        is_public: snippet.isPublic.value,
      })
      .eq('id', snippet.id.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async remove(snippetId: Id) {
    const { error } = await this.supabase
      .from('snippets')
      .delete()
      .eq('id', snippetId.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }
}
