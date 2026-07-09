import { Datetime } from '@stardust/core/global/libs'
import type { SnippetDto } from '@stardust/core/playground/entities/dtos'
import { Snippet } from '@stardust/core/playground/entities'

import type { SupabaseSnippet, SupabaseSnippetPayload } from '../../types'

export class SupabaseSnippetMapper {
  static toEntity(supabaseSnippet: SupabaseSnippet): Snippet {
    return Snippet.create(SupabaseSnippetMapper.toDto(supabaseSnippet))
  }

  static toDto(supabaseSnippet: SupabaseSnippet): SnippetDto {
    const snippetDto: SnippetDto = {
      id: supabaseSnippet.id ?? '',
      code: supabaseSnippet.code ?? '',
      isPublic: supabaseSnippet.is_public ?? true,
      title: supabaseSnippet.title ?? '',
      author: {
        id: supabaseSnippet.author_id ?? '',
        entity: {
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
  }

  static toSupabase(snippet: Snippet): SupabaseSnippetPayload {
    const supabaseSnippet: SupabaseSnippetPayload = {
      id: snippet.id.value,
      user_id: snippet.authorId.value,
      is_public: snippet.isPublic.value,
      title: snippet.title.value,
      code: snippet.code.value,
      created_at: snippet.createdAt.toUTCString(),
    }

    return supabaseSnippet
  }
}
