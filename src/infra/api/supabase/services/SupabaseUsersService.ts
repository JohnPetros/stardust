import type { IUsersService } from '@/@core/interfaces/services'
import { UpdateUserUnexpectedError, UserNotFoundError } from '@/@core/errors/users'
import { ServiceResponse } from '@/@core/responses'
import type { User } from '@/@core/domain/entities'
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
      const { data, error } = await supabase
        .from('users')
        .select(
          '*, users_unlocked_stars(star_id), users_unlocked_achievements(achievement_id), users_acquired_rockets(rocket_id), users_acquired_avatars(avatar_id), users_completed_challenges(challenge_id), users_rescuable_achievements(achievement_id)'
        )
        .eq('id', userId)
        .single()

      if (error) {
        return SupabasePostgrestError(error, UserNotFoundError)
      }

      const { avatar, ranking, rocket } = await fetchUserItems(data)

      const user = supabaseUserMapper.toDTO(data, avatar, ranking, rocket)

      return new ServiceResponse(user)
    },

    async fetchUserBySlug(userSlug: string) {
      const { data, error } = await supabase
        .from('users')
        .select(
          '*, users_unlocked_stars(star_id), users_unlocked_achievements(achievement_id), users_acquired_rockets(rocket_id), users_acquired_avatars(avatar_id), users_completed_challenges(challenge_id), users_rescuable_achievements(achievement_id)'
        )
        .eq('slug', userSlug)
        .single()

      if (error) return SupabasePostgrestError(error, UserNotFoundError)

      const { avatar, ranking, rocket } = await fetchUserItems(data)

      const user = supabaseUserMapper.toDTO(data, avatar, ranking, rocket)

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
