import type { IUsersService } from '@/@core/interfaces/services'
import { UpdateUserUnexpectedError, UserNotFoundError } from '@/@core/errors/users'
import { ServiceResponse } from '@/@core/responses'
import type { User } from '@/@core/domain/entities'

import { SupabaseUserMapper } from '../mappers'
import type { Supabase } from '../types'
import { SupabasePostgrestError } from '../errors'

export const SupabaseUsersService = (supabase: Supabase): IUsersService => {
  const supabaseUserMapper = SupabaseUserMapper()

  return {
    async fetchUserById(userId: string) {
      const { data, error } = await supabase
        .from('users')
        .select(
          '*, avatar:avatars(*), rocket:rockets(*), tier:tiers(*), users_unlocked_stars(star_id), users_unlocked_achievements(achievement_id), users_acquired_rockets(rocket_id), users_acquired_avatars(avatar_id), users_completed_challenges(challenge_id), users_rescuable_achievements(achievement_id)',
        )
        .eq('id', userId)
        .single()

      if (error) {
        return SupabasePostgrestError(error, UserNotFoundError)
      }

      const user = supabaseUserMapper.toDto(data)

      return new ServiceResponse(user)
    },

    async fetchUserBySlug(userSlug: string) {
      const { data, error } = await supabase
        .from('users')
        .select(
          '*, avatar:avatars(*), rocket:rockets(*), tier:tiers(*), users_unlocked_stars(star_id), users_unlocked_achievements(achievement_id), users_acquired_rockets(rocket_id), users_acquired_avatars(avatar_id), users_completed_challenges(challenge_id), users_rescuable_achievements(achievement_id)',
        )
        .eq('slug', userSlug)
        .single()

      if (error) return SupabasePostgrestError(error, UserNotFoundError)

      const user = supabaseUserMapper.toDto(data)

      return new ServiceResponse(user)
    },

    async fetchUserName(name: string) {
      const { data, error } = await supabase
        .from('users')
        .select('name')
        .eq('name', name)
        .single()

      if (error) return SupabasePostgrestError(error, UserNotFoundError)

      return new ServiceResponse(data.name)
    },

    async fetchUserEmail(email: string) {
      const { data, error } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .single()

      if (error) return SupabasePostgrestError(error, UserNotFoundError)

      return new ServiceResponse(data.email)
    },

    async updateUser(user: User) {
      const supabaseUser = supabaseUserMapper.toSupabase(user)

      const { error } = await supabase
        .from('users')
        // @ts-ignore
        .update(supabaseUser)
        .eq('id', user.id)

      if (error) {
        return SupabasePostgrestError(error, UpdateUserUnexpectedError)
      }

      return new ServiceResponse(true)
    },
  }
}
