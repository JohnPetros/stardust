'use client'

import { IStarService } from './interfaces/IStarService'

import type { Star } from '@/@types/star'
import { useSupabase } from '@/hooks/useSupabase'

export const StarService = (): IStarService => {
  const { supabase } = useSupabase()

  return {
    getStar: async (starId: string) => {
      const { data, error } = await supabase
        .from('stars')
        .select('*, questions(*)')
        .eq('id', starId)
        .order('order', { foreignTable: 'questions', ascending: true })
        .single<Star>()

      if (error) {
        throw new Error(error.message)
      }

      return data
    },

    getNextStar: async (currentStar: Star, userId: string) => {
      const { data, error } = await supabase
        .from('stars')
        .select('id, users_unlocked_stars(*)')
        .match({
          planet_id: currentStar.planet_id,
          number: currentStar.number + 1,
        })
        .eq('users_unlocked_stars.user_id', userId)
        .returns<Star & { users_unlocked_stars?: [] }>()

      if (error) {
        throw new Error(error.message)
      }

      if (!data) return null

      const { users_unlocked_stars } = data

      const nextStar = {
        ...data,
        isUnlocked: users_unlocked_stars && users_unlocked_stars.length > 0,
      }

      delete nextStar.users_unlocked_stars

      return nextStar as Star
    },

    getNextStarFromNextPlanet: async (
      currentPlanetId: string,
      userId: string
    ) => {
      const { data: nextStarId, error: nextStarIdError } = await supabase.rpc(
        'get_next_star_id_from_next_planet',
        {
          current_planet_id: currentPlanetId,
        }
      )

      console.log({ nextStarId })

      if (nextStarIdError) {
        throw new Error(nextStarIdError.message)
      }

      const { data, error } = await supabase
        .from('stars')
        .select('id, users_unlocked_stars(*)')
        .eq('id', nextStarId)
        .eq('users_unlocked_stars.user_id', userId)
        .single<Star & { users_unlocked_stars?: [] }>()

      if (error) {
        throw new Error(error.message)
      }

      console.log({ data })

      if (!data) return null

      const nextStar = {
        ...data,
        isUnlocked:
          data && data.users_unlocked_stars
            ? data.users_unlocked_stars.length > 0
            : false,
      }

      return nextStar as Star
    },

    getUserUnlockedStarsIds: async (userId: string) => {
      const { data, error } = await supabase
        .from('users_unlocked_stars')
        .select('star_id')
        .eq('user_id', userId)

      if (error) {
        throw new Error(error.message)
      }

      return data.map(({ star_id }) => star_id)
    },

    addUnlockedStar: async (starId: string, userId: string) => {
      const { error } = await supabase
        .from('users_unlocked_stars')
        .insert([{ star_id: starId, user_id: userId }])

      if (error) {
        throw new Error(error.message)
      }
    },
  }
}