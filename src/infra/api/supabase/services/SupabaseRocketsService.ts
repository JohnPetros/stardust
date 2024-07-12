import type { IRocketsSerivice } from '@/@core/interfaces/services'
import type { ShopItemsListingSettings } from '@/@core/types'
import {
  FetchShopRocketsListUnexpectedError,
  RocketNotFoundError,
  SaveAcquiredRocketUnexpectedError,
} from '@/@core/errors/rockets'
import { PaginationResponse, ServiceResponse } from '@/@core/responses'

import type { Supabase } from '../types/Supabase'
import { SupabasePostgrestError } from '../errors'
import { SupabaseRocketMapper } from '../mappers'

export const SupabaseRocketsService = (supabase: Supabase): IRocketsSerivice => {
  const supabaseRocketMapper = SupabaseRocketMapper()

  return {
    async fetchRocketById(rocketId: string) {
      const { data, error } = await supabase
        .from('rockets')
        .select('*')
        .eq('id', rocketId)
        .single()

      if (error) {
        return SupabasePostgrestError(error, RocketNotFoundError)
      }

      const rocket = supabaseRocketMapper.toDTO(data)

      return new ServiceResponse(rocket)
    },

    async fetchShopRocketsList({
      search,
      offset,
      limit,
      priceOrder,
      shouldFetchUnlocked = null,
      userId,
    }: ShopItemsListingSettings) {
      const canSearch = search.length > 1

      let query = supabase.from('rockets').select('*', {
        count: 'exact',
        head: false,
      })

      if (shouldFetchUnlocked !== null && shouldFetchUnlocked) {
        query = query.eq('users_acquired_rockets.user_id', userId)
      } else if (shouldFetchUnlocked !== null && !shouldFetchUnlocked) {
        query = query.neq('users_acquired_rockets.user_id', userId)
      }

      query = query
        .order('price', { ascending: priceOrder === 'ascending' })
        .ilike(canSearch ? 'name' : '', canSearch ? `%${search}%` : '')
        .range(offset, limit)

      const { data, count, error } = await query

      if (error) {
        return SupabasePostgrestError(error, FetchShopRocketsListUnexpectedError)
      }

      const rockets = data.map(supabaseRocketMapper.toDTO)

      const pagination = new PaginationResponse(rockets, count)

      return new ServiceResponse(pagination)
    },

    async saveAcquiredRocket(userId: string, rocketId: string) {
      const { error } = await supabase
        .from('users_acquired_rockets')
        .insert([{ rocket_id: rocketId, user_id: userId }])

      if (error) {
        return SupabasePostgrestError(error, SaveAcquiredRocketUnexpectedError)
      }

      return new ServiceResponse(true)
    },
  }
}
