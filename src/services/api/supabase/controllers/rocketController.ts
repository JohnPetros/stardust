import { IRocketsController } from '../../interfaces/IRocketsController'

import type { Rocket } from '@/@types/rocket'
import type { Supabase } from '@/@types/supabase'

export const RocketsController = (supabase: Supabase): IRocketsController => {
  return {
    getRocket: async (rocketId: string) => {
      const { data, error } = await supabase
        .from('rockets')
        .select('*')
        .eq('id', rocketId)
        .single<Rocket>()

      if (error) {
        throw new Error(error.message)
      }
      return data
    },

    getRockets: async ({
      search,
      offset,
      limit,
      priceOrder,
      shouldFetchUnlocked = null,
      userId,
    }) => {
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
        throw new Error(error.message)
      }

      return { rockets: data as Rocket[], count }
    },

    getUserAcquiredRocketsIds: async (userId: string) => {
      const { data, error } = await supabase
        .from('users_acquired_rockets')
        .select('rocket_id')
        .eq('user_id', userId)

      if (error) {
        throw new Error(error.message)
      }

      return data.map((data) => data.rocket_id)
    },

    addUserAcquiredRocket: async (rocketId: string, userId: string) => {
      const { error } = await supabase
        .from('users_acquired_rockets')
        .insert([{ rocket_id: rocketId, user_id: userId }])

      if (error) {
        return error.message
      }
    },
  }
}