import type { Avatar, Ranking, Rocket, User } from '@/@core/domain/entities'
import type { IUsersService } from '@/@core/interfaces/services'
import {
  SaveUserAcquiredAvatarUnexpectedError,
  SaveUserAcquiredRocketUnexpectedError,
  SaveUserUnlockedStarUnexpectedError,
  UpdateUserUnexpectedError,
  UserNotFoundError,
} from '@/@core/errors/users'
import { ServiceResponse } from '@/@core/responses'
import { FetchUserAcquiredRocketsIdsUnexpectedError } from '@/@core/errors/rockets'
import { FetchUserAcquiredAvatarsIdsUnexpectedError } from '@/@core/errors/users/FetchUserAcquiredAvatarsIdsUnexpectedError'
import type { AvatarDTO, RankingDTO, RocketDTO } from '@/@core/dtos'

import { SupabaseUserMapper } from '../mappers'
import type { Supabase, SupabaseUser } from '../types'
import { SupabasePostgrestError } from '../errors'
import { SupabaseRocketsService } from './SupabaseRocketsService'
import { SupabaseRankingsService } from './SupabaseRankingsService'
import { SupabaseAvatarsService } from './SupabaseAvatarsService'

export const SupabaseUsersService = (supabase: Supabase): IUsersService => {
  const supabaseUserMapper = SupabaseUserMapper()
  const avatarsService = SupabaseAvatarsService(supabase)
  const rocketsService = SupabaseRocketsService(supabase)
  const rankingsService = SupabaseRankingsService(supabase)

  async function fetchUserItems(user: SupabaseUser): Promise<{
    avatar: AvatarDTO
    rocket: RocketDTO
    ranking: RankingDTO
  }> {
    const avatarResponse = await avatarsService.fetchAvatarById(user.avatar_id ?? '')
    if (avatarResponse.isFailure) avatarResponse.throwError()

    const rocketResponse = await rocketsService.fetchRocketById(user.rocket_id ?? '')
    if (rocketResponse.isFailure) rocketResponse.throwError()

    const rankingResponse = await rankingsService.fetchRankingById(user.ranking_id ?? '')
    if (rankingResponse.isFailure) rankingResponse.throwError()

    return {
      avatar: avatarResponse.data,
      rocket: rocketResponse.data,
      ranking: rankingResponse.data,
    }
  }

  return {
    async fetchUserById(userId: string) {
      const userResponse = await supabase
        .rpc('get_user_by_id', {
          _user_id: userId,
        })
        .single()

      const userData = userResponse.data

      if (!userData || userResponse.error) {
        return SupabasePostgrestError(userResponse.error, UserNotFoundError)
      }

      const { avatar, ranking, rocket } = await fetchUserItems(userData)

      const user = supabaseUserMapper.toDTO(userData, avatar, rocket, ranking)

      return new ServiceResponse(user)
    },

    async fetchUserBySlug(userSlug: string) {
      const { data: userData, error } = await supabase
        .rpc('get_user_by_slug', {
          _user_slug: userSlug,
        })
        .single()

      if (!userData || error) return SupabasePostgrestError(error, UserNotFoundError)

      const { avatar, ranking, rocket } = await fetchUserItems(userData)

      const user = supabaseUserMapper.toDTO(userData, avatar, rocket, ranking)

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

    async fetchUserAcquiredRocketsIds(userId: string) {
      const { data, error } = await supabase
        .from('users_acquired_rockets')
        .select('rocket_id')
        .eq('user_id', userId)

      if (error) {
        return SupabasePostgrestError(error, FetchUserAcquiredRocketsIdsUnexpectedError)
      }

      const ids = data.map((data) => data.rocket_id)

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

    async fetchUserAcquiredAvatarsIds(userId: string) {
      const { data, error } = await supabase
        .from('users_acquired_avatars')
        .select('avatar_id')
        .eq('user_id', userId)

      if (error) {
        return SupabasePostgrestError(error, FetchUserAcquiredAvatarsIdsUnexpectedError)
      }

      const ids = data.map((data) => data.avatar_id)

      return new ServiceResponse(ids)
    },

    async saveUserAcquiredAvatar(avatarId: string, userId: string) {
      const { error } = await supabase
        .from('users_acquired_avatars')
        .insert({ avatar_id: avatarId, user_id: userId })

      if (error) {
        return SupabasePostgrestError(error, SaveUserAcquiredAvatarUnexpectedError)
      }

      return new ServiceResponse(true)
    },

    async updateUser(userDTO: UserDTO) {
      const supabaseUser = supabaseUserMapper.toSupabase(userDTO)

      const { error } = await supabase
        .from('users')
        // @ts-ignore
        .update(supabaseUser)
        .eq('id', userDTO.id)

      if (error) {
        return SupabasePostgrestError(error, UpdateUserUnexpectedError)
      }

      return new ServiceResponse(true)
    },

    async saveUserUnlockedStar(starId: string, userId: string) {
      const { error } = await supabase
        .from('users_unlocked_stars')
        .insert({ star_id: starId, user_id: userId })

      if (error) {
        return SupabasePostgrestError(error, SaveUserUnlockedStarUnexpectedError)
      }

      return new ServiceResponse(true)
    },
  }
}
