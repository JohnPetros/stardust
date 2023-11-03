'use client'

import { IRocketService } from './interfaces/IRocketService'

import type { Rocket } from '@/@types/rocket'
import { useSupabase } from '@/hooks/useSupabase'

export const RocketService = (): IRocketService => {
  const { supabase } = useSupabase()

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

    getRockets: async ({ search, offset, limit, priceOrder }) => {
      const { data, error } = await supabase
        .from('rockets')
        .select('*')
        .order('price', { ascending: priceOrder === 'ascending' })
        .range(offset, limit - 1)
        .returns<Rocket[]>()

      if (error) {
        throw new Error(error.message)
      }
      return data
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
