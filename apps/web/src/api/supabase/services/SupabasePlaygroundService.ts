import { ApiResponse, PaginationResponse } from '@stardust/core/responses'
import type { IPlaygroundService } from '@stardust/core/interfaces'
import type { Snippet } from '@stardust/core/playground/entities'

import type { Supabase } from '../types/Supabase'
import { SupabasePostgrestError } from '../errors'
import { SupabaseSnippetMapper } from '../mappers'
import { calculateSupabaseRange } from '../utils'

export const SupabasePlaygroundService = (supabase: Supabase): IPlaygroundService => {
  const supabaseSnippetMapper = SupabaseSnippetMapper()

  return {
    async fetchSnippetById(snippetId: string) {
      const { data, error, status } = await supabase
        .from('snippets_view')
        .select('*')
        .eq('id', snippetId)
        .single()

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inseperado ao buscar esse snippet',
          status,
        )
      }

      const snippet = supabaseSnippetMapper.toDto(data)
      return new ApiResponse({ body: snippet })
    },

    async fetchSnippetsList({ page, itemsPerPage, authorId }) {
      const range = calculateSupabaseRange(page, itemsPerPage)

      const { data, error, status, count } = await supabase
        .from('snippets_view')
        .select('*', { count: 'exact' })
        .eq('author_id', authorId)
        .range(range.from, range.to)

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inseperado ao buscar seus snippets',
          status,
        )
      }

      const snippets = data.map(supabaseSnippetMapper.toDto)
      return new ApiResponse({ body: new PaginationResponse(snippets, Number(count)) })
    },

    async saveSnippet(snippet: Snippet) {
      const supabaseSnippet = supabaseSnippetMapper.toSupabase(snippet)
      const { error, status } = await supabase.from('snippets').insert({
        // @ts-ignore
        id: snippet.id,
        code: supabaseSnippet.code,
        title: supabaseSnippet.title,
        is_public: supabaseSnippet.is_public,
        created_at: supabaseSnippet.created_at,
        user_id: supabaseSnippet.author_id,
      })

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao salvar esse snippet',
          status,
        )
      }

      return new ApiResponse()
    },

    async updateSnippet(snippet: Snippet) {
      const { error, status } = await supabase
        .from('snippets')
        .update({
          title: snippet.title.value,
          code: snippet.code.value,
          is_public: snippet.isPublic.value,
        })
        .eq('id', snippet.id)

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao atualizar snippet',
          status,
        )
      }

      return new ApiResponse()
    },

    async deleteSnippet(snippetId: string) {
      const { error, status } = await supabase
        .from('snippets')
        .delete()
        .eq('id', snippetId)

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao deletar comentário',
          status,
        )
      }

      return new ApiResponse()
    },
  }
}
