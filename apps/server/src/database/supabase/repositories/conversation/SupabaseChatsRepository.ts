import type { ChatsRepository } from '@stardust/core/conversation/interfaces'
import type { Chat } from '@stardust/core/conversation/entities'

import type { Id } from '@stardust/core/global/structures'

import { SupabaseRepository } from '../SupabaseRepository'
import { SupabaseChatMapper } from '../../mappers/conversation'
import { SupabasePostgreError } from '../../errors'

export class SupabaseChatsRepository
  extends SupabaseRepository
  implements ChatsRepository
{
  async findById(chatId: Id): Promise<Chat | null> {
    const { data, error } = await this.supabase
      .from('chats')
      .select('*')
      .eq('id', chatId.value)
      .single()

    if (error) {
      return this.handleQueryPostgresError(error)
    }
    return SupabaseChatMapper.toEntity(data)
  }

  async findAllByUser(userId: Id): Promise<Chat[]> {
    const { data, error } = await this.supabase
      .from('chats')
      .select('*')
      .eq('user_id', userId.value)
      .order('created_at', { ascending: false })

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return data.map(SupabaseChatMapper.toEntity)
  }

  async findLastCreatedByUser(userId: Id): Promise<Chat | null> {
    const { data, error } = await this.supabase
      .from('chats')
      .select('*')
      .eq('user_id', userId.value)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      return this.handleQueryPostgresError(error)
    }
    return SupabaseChatMapper.toEntity(data)
  }

  async add(chat: Chat, userId: Id): Promise<void> {
    const supabaseChat = SupabaseChatMapper.toSupabase(chat)
    const { error } = await this.supabase.from('chats').insert({
      ...supabaseChat,
      user_id: userId.value,
    })

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async replace(chat: Chat): Promise<void> {
    const { error } = await this.supabase
      .from('chats')
      .update({
        name: chat.name.value,
      })
      .eq('id', chat.id.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async remove(chatId: Id): Promise<void> {
    const { error } = await this.supabase.from('chats').delete().eq('id', chatId.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }
}
