import { User } from '@/@core/domain/entities'
import { IUsersService } from '@/@core/interfaces/services'
import { UpdateUserFailedError, UserNotFoundError } from '@/@core/errors/users'
import { ServiceResponse } from '@/@core/responses'

import { supabaseUserMapper } from '../mappers'
import type { Supabase } from '../types'

import { SupabasePostgrestError } from '../errors'

export const SupabaseUsersService = (supabase: Supabase): IUsersService => {
  return {
    async getUserById(userId: string) {
      const { data, error } = await supabase
        .rpc('get_user_by_id', {
          _user_id: userId,
        })
        .single()

      if (error) return SupabasePostgrestError(error, UserNotFoundError)

      const user = supabaseUserMapper.toDomain(data)

      return new ServiceResponse(user)
    },

    async getUserBySlug(userSlug: string) {
      const { data, error } = await supabase
        .rpc('get_user_by_slug', {
          _user_slug: userSlug,
        })
        .single()

      if (error) return SupabasePostgrestError(error, UserNotFoundError)

      const user = supabaseUserMapper.toDomain(data)

      return new ServiceResponse(user)
    },

    async updateUser(user: User) {
      const supabaseUser = supabaseUserMapper.toSupabase(user)

      const { error } = await supabase
        .from('users')
        // @ts-ignore
        .update(supabaseUser)
        .eq('id', user.id)

      if (error) {
        return SupabasePostgrestError(error, UpdateUserFailedError)
      }

      return new ServiceResponse(true)
    },
  }
}
