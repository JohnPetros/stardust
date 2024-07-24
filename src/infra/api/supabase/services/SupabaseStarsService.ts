import type { IStarsService } from '@/@core/interfaces/services'
import { ServiceResponse } from '@/@core/responses'
import { SaveUnlockedStarUnexpectedError, StarNotFoundError } from '@/@core/errors/stars'

import type { Supabase } from '../types/Supabase'
import { SupabaseStarMapper } from '../mappers'
import { SupabasePostgrestError } from '../errors'

export const SupabaseStarsService = (supabase: Supabase): IStarsService => {
  const supabaseStarMapper = SupabaseStarMapper()

  return {
    async fetchStarBySlug(starSlug: string) {
      const { data, error } = await supabase
        .from('stars')
        .select('*')
        .eq('slug', starSlug)
        .single()

      if (error) {
        return SupabasePostgrestError(error, StarNotFoundError)
      }

      const star = supabaseStarMapper.toDTO(data)

      return new ServiceResponse(star)
    },

    async fetchStarById(starId: string) {
      const { data, error } = await supabase
        .from('stars')
        .select('*')
        .eq('id', starId)
        .single()

      if (error) {
        return SupabasePostgrestError(error, StarNotFoundError)
      }

      const starDTO = supabaseStarMapper.toDTO(data)

      return new ServiceResponse(starDTO)
    },

    async saveUserUnlockedStar(starId: string, userId: string) {
      const { error } = await supabase
        .from('users_unlocked_stars')
        .insert({ star_id: starId, user_id: userId })

      if (error) {
        return SupabasePostgrestError(error, SaveUnlockedStarUnexpectedError)
      }

      return new ServiceResponse(true)
    },

    //   async fetchNextStar(currentStar: Star, userId: string) {
    //     const { data, error } = await supabase
    //       .from('stars')
    //       .select('id, users_unlocked_stars(id)')
    //       .match({
    //         planet_id: currentStar.planetId,
    //         number: currentStar.number + 1,
    //       })
    //       .eq('users_unlocked_stars.user_id', userId)
    //       .single<{ id: string; users_unlocked_stars?: [] }>()

    //     if (error) {
    //       return null
    //     }

    //     if (data) {
    //       const { users_unlocked_stars } = data

    //       const nextStar = {
    //         id: data.id,
    //         isUnlocked: users_unlocked_stars && users_unlocked_stars.length > 0,
    //       }

    //       return nextStar
    //     }

    //     return null
    //   },

    //   async fetchNextStarFromNextPlanet(currentPlanetId: string, userId: string) {
    //     const { data, error } = await supabase
    //       .rpc('fetch_next_star_from_next_planet', {
    //         _current_planet_id: currentPlanetId,
    //         _user_id: userId,
    //       })
    //       .single()

    //     if (error) {
    //       return null
    //     }

    //     if (data && data.id && typeof data.is_unlocked !== 'undefined') {
    //       const nextStar: Pick<Star, 'id' | 'isUnlocked'> = {
    //         id: data.id,
    //         isUnlocked: Boolean(data.is_unlocked),
    //       }

    //       return nextStar
    //     }

    //     return null
    //   },

    //   async fetchUserUnlockedStarsIds(userId: string) {
    //     const { data, error } = await supabase
    //       .from('users_unlocked_stars')
    //       .select('star_id')
    //       .eq('user_id', userId)

    //     if (error) {
    //       throw new Error(error.message)
    //     }

    //     return data.map(({ star_id }) => star_id)
    //   },

    async verifyStarIsUnlocked(starId: string, userId: string) {
      const { data, error } = await supabase
        .from('users_unlocked_stars')
        .select('star_id, user_id')
        .eq('star_id', starId)
        .eq('user_id', userId)
        .single()

      if (error) {
        return new ServiceResponse(false)
      }

      return new ServiceResponse(Boolean(data))
    },
  }
}
