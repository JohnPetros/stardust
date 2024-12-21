import type { IAvatarsService } from '@/@core/interfaces/services'
import type { ShopItemsListingSettings } from '@/@core/types'
import {
  AvatarNotFoundError,
  FetchShopAvatarsListUnexpectedError,
  SaveAcquiredAvatarUnexpectedError,
} from '@/@core/errors/avatars'
import { PaginationResponse, ServiceResponse } from '@/@core/responses'

import type { Supabase } from '../types/Supabase'
import { SupabasePostgrestError } from '../errors'
import { SupabaseAvatarMapper } from '../mappers'

export const SupabaseAvatarsService = (supabase: Supabase): IAvatarsService => {
  const supabaseAvatarMapper = SupabaseAvatarMapper()

  return {
    async fetchAvatarById(avatarId: string) {
      const { data, error } = await supabase
        .from('avatars')
        .select('*')
        .eq('id', avatarId)
        .single()

      if (error) {
        return SupabasePostgrestError(error, AvatarNotFoundError)
      }

      const avatar = supabaseAvatarMapper.toDto(data)

      return new ServiceResponse(avatar)
    },

    async fetchShopAvatarsList({
      search,
      offset,
      limit,
      order,
    }: ShopItemsListingSettings) {
      let query = supabase.from('avatars').select('*', {
        count: 'exact',
        head: false,
      })

      if (search && search.length > 1) {
        query = query.ilike('name', `%${search}%`)
      }

      query = query
        .order('price', { ascending: order === 'ascending' })
        .range(offset, limit)

      const { data, count, error } = await query

      if (error) {
        return SupabasePostgrestError(error, FetchShopAvatarsListUnexpectedError)
      }

      const avatars = data.map(supabaseAvatarMapper.toDto)

      const pagination = new PaginationResponse(avatars, count)

      return new ServiceResponse(pagination)
    },

    async saveAcquiredAvatar(avatarId: string, userId: string) {
      const { error } = await supabase
        .from('users_acquired_avatars')
        .insert({ avatar_id: avatarId, user_id: userId })

      if (error) {
        return SupabasePostgrestError(error, SaveAcquiredAvatarUnexpectedError)
      }

      return new ServiceResponse(true)
    },
  }
}
