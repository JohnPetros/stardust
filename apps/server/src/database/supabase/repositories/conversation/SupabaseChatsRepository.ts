import type { ChatsRepository } from '@stardust/core/conversation/interfaces'
import type { Chat } from '@stardust/core/conversation/entities'
import type { Id } from '@stardust/core/global/structures'
import type { ManyItems } from '@stardust/core/global/types'
import type { ChatsListingParams } from '@stardust/core/conversation/types'

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

  async findManyByUser(params: ChatsListingParams): Promise<ManyItems<Chat>> {
    const range = this.calculateQueryRange(params.page.value, params.itemsPerPage.value)

    let query = this.supabase
      .from('chats')
      .select('*', { count: 'exact', head: false })
      .eq('user_id', params.userId.value)

    if (params.search && params.search.value.length > 1) {
      query = query.ilike('name', `%${params.search.value}%`)
    }

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(range.from, range.to)

    if (error) {
      throw new SupabasePostgreError(error)
    }

    const chats = data.map(SupabaseChatMapper.toEntity)

    return {
      items: chats,
      count: count ?? chats.length,
    }
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
