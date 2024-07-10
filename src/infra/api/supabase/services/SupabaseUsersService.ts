import { User } from '@/@core/domain/entities'
import { IUsersService } from '@/@core/interfaces/services'
import { UpdateUserUnexpectedError, UserNotFoundError } from '@/@core/errors/users'
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

    async getUserName(name: string) {
      const { data, error } = await supabase
        .from('users')
        .select('name')
        .eq('name', name)
        .single()

      if (error) return SupabasePostgrestError(error, UserNotFoundError)

      return new ServiceResponse(data.name)
    },

    async getUserEmail(email: string) {
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
