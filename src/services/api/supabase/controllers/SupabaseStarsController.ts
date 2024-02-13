import { IStarsController } from '../../interfaces/IStarsController'
import { SupabaseStarAdapter } from '../adapters/SupabaseStarAdapter'
import type { Supabase } from '../types/Supabase'

import type { Star } from '@/@types/Star'

export const SupabaseStarsController = (
  supabase: Supabase
): IStarsController => {
  return {
    async getStarBySlug(starSlug: string) {
      const { data, error } = await supabase
        .from('stars')
        .select('*, questions(*)')
        .eq('slug', starSlug)
        .order('order', { foreignTable: 'questions', ascending: true })
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return SupabaseStarAdapter(data)
    },

    async getStarById(starId: string) {
      const { data, error } = await supabase
        .from('stars')
        .select('*')
        .eq('id', starId)
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return SupabaseStarAdapter(data)
    },

    async getNextStar(currentStar: Star, userId: string) {
      const { data, error } = await supabase
        .from('stars')
        .select('id, users_unlocked_stars(id)')
        .match({
          planet_id: currentStar.planetId,
          number: currentStar.number + 1,
        })
        .eq('users_unlocked_stars.user_id', userId)
        .single<{ id: string; users_unlocked_stars?: [] }>()

      if (error) {
        console.error(error)
        return null
      }

      if (data) {
        const { users_unlocked_stars } = data

        const nextStar = {
          id: data.id,
          isUnlocked: users_unlocked_stars && users_unlocked_stars.length > 0,
        }

        return nextStar
      }

      return null
    },

    async getNextStarFromNextPlanet(currentPlanetId: string, userId: string) {
      const { data, error } = await supabase
        .rpc('get_next_star_from_next_planet', {
          _current_planet_id: currentPlanetId,
          _user_id: userId,
        })
        .single()

      if (error) {
        return null
      }

      if (data && data.id && typeof data.is_unlocked !== 'undefined') {
        const nextStar: Pick<Star, 'id' | 'isUnlocked'> = {
          id: data.id,
          isUnlocked: Boolean(data.is_unlocked),
        }

        return nextStar
      }

      return null
    },

    async getUserUnlockedStarsIds(userId: string) {
      const { data, error } = await supabase
        .from('users_unlocked_stars')
        .select('star_id')
        .eq('user_id', userId)

      if (error) {
        throw new Error(error.message)
      }

      return data.map(({ star_id }) => star_id)
    },

    async addUnlockedStar(starId: string, userId: string) {
      const { error } = await supabase
        .from('users_unlocked_stars')
        .insert([{ star_id: starId, user_id: userId }])

      if (error) {
        throw new Error(error.message)
      }
    },
  }
}
