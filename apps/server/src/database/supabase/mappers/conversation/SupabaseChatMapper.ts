import { Chat } from '@stardust/core/conversation/entities'

import type { SupabaseChat } from '../../types'

export class SupabaseChatMapper {
  static toEntity(supabaseChat: SupabaseChat): Chat {
    return Chat.create({
      id: supabaseChat.id,
      name: supabaseChat.name,
      createdAt: supabaseChat.created_at,
    })
  }

  static toSupabase(chat: Chat): SupabaseChat {
    return {
      id: chat.id.value,
      name: chat.name.value,
      created_at: chat.createdAt.toISOString(),
      user_id: '',
    }
  }
}
