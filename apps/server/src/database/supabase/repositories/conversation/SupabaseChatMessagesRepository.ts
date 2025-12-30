import type { ChatMessagesRepository } from '@stardust/core/conversation/interfaces'
import type { ChatMessage } from '@stardust/core/conversation/structures'
import type { Id } from '@stardust/core/global/structures'

import { SupabaseRepository } from '../SupabaseRepository'
import { SupabaseChatMessageMapper } from '../../mappers/conversation'
import { SupabasePostgreError } from '../../errors'

export class SupabaseChatMessagesRepository
  extends SupabaseRepository
  implements ChatMessagesRepository
{
  async findAllByChat(chatId: Id): Promise<ChatMessage[]> {
    const { data, error } = await this.supabase
      .from('chat_messages')
      .select('*')
      .eq('chat_id', chatId.value)
      .order('created_at', { ascending: true })

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return data.map(SupabaseChatMessageMapper.toEntity)
  }

  async add(chatId: Id, chatMessage: ChatMessage): Promise<void> {
    const { error } = await this.supabase
      .from('chat_messages')
      .insert(SupabaseChatMessageMapper.toSupabase(chatId.value, chatMessage))

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }
}
