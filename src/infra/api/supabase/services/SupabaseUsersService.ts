import type { User } from '@/@core/domain/entities'
import type { IUsersService } from '@/@core/interfaces/services'
import {
  SaveUserAcquiredRocketUnexpectedError,
  UpdateUserUnexpectedError,
  UserNotFoundError,
} from '@/@core/errors/users'
import { ServiceResponse } from '@/@core/responses'

import { SupabaseUserMapper } from '../mappers'
import type { Supabase } from '../types'

import { SupabasePostgrestError } from '../errors'

export const SupabaseUsersService = (supabase: Supabase): IUsersService => {
  const supabaseUserMapper = SupabaseUserMapper()

  return {
    async fetchUserById(userId: string) {
      const { data, error } = await supabase
        .rpc('get_user_by_id', {
          _user_id: userId,
        })
        .single()

      if (error) return SupabasePostgrestError(error, UserNotFoundError)

      const user = supabaseUserMapper.toDomain(data)

      return new ServiceResponse(user)
    },

    async fetchUserBySlug(userSlug: string) {
      const { data, error } = await supabase
        .rpc('get_user_by_slug', {
          _user_slug: userSlug,
        })
        .single()

      if (error) return SupabasePostgrestError(error, UserNotFoundError)

      const user = supabaseUserMapper.toDomain(data)

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

    async fetchUserUnlockedStarsIds(userId: string) {
      const { data, error } = await supabase
        .from('users_unlocked_stars')
        .select('star_id')
        .eq('user_id', userId)

      if (error) return SupabasePostgrestError(error, UserNotFoundError)

      const ids = data.map(({ star_id }) => star_id)

      return new ServiceResponse(ids)
    },

    async saveUserAcquiredRocket(userId: string, rocketId: string) {
      const { error } = await supabase
        .from('users_acquired_rockets')
        .insert([{ rocket_id: rocketId, user_id: userId }])

      if (error) {
        return SupabasePostgrestError(error, SaveUserAcquiredRocketUnexpectedError)
      }

      return new ServiceResponse(true)
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
