import { Datetime } from '@stardust/core/global/libs'
import type { SnippetDto } from '@stardust/core/playground/dtos'
import type { SupabaseSnippet } from '../types'
import type { Snippet } from '@stardust/core/playground/entities'

export const SupabaseSnippetMapper = () => {
  return {
    toDto(supabaseSnippet: SupabaseSnippet): SnippetDto {
      const snippetDto: SnippetDto = {
        id: supabaseSnippet.id ?? '',
        code: supabaseSnippet.code ?? '',
        isPublic: supabaseSnippet.is_public ?? true,
        title: supabaseSnippet.title ?? '',
        author: {
          id: supabaseSnippet.author_id ?? '',
          dto: {
            slug: supabaseSnippet.author_slug ?? '',
            name: supabaseSnippet.author_name ?? '',
            avatar: {
              name: supabaseSnippet.author_avatar_name ?? '',
              image: supabaseSnippet.author_avatar_image ?? '',
            },
          },
        },
        createdAt: new Datetime(supabaseSnippet.created_at).date(),
      }

      return snippetDto
    },

    toSupabase(
      snippet: Snippet,
    ): Omit<
      SupabaseSnippet,
      'author_name' | 'author_avatar_image' | 'author_avatar_name' | 'author_slug'
    > {
      const supabaseSnippet: Omit<
        SupabaseSnippet,
        'author_name' | 'author_avatar_image' | 'author_avatar_name' | 'author_slug'
      > = {
        id: snippet.id,
        author_id: snippet.authorId,
        is_public: snippet.isPublic.value,
        title: snippet.title.value,
        code: snippet.code.value,
        created_at: snippet.createdAt.toUTCString(),
      }

      return supabaseSnippet
    },
  }
}
