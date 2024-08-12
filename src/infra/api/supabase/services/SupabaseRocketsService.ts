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
      order,
    }: ShopItemsListingSettings) {
      let query = supabase.from('rockets').select('*', {
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
        return SupabasePostgrestError(error, FetchShopRocketsListUnexpectedError)
      }

      const rockets = data.map(supabaseRocketMapper.toDTO)

      const pagination = new PaginationResponse(rockets, count)

      return new ServiceResponse(pagination)
    },

    async saveAcquiredRocket(rocketId: string, userId: string) {
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
