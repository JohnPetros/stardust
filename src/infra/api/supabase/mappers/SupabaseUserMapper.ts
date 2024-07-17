import type { UserDTO } from '@/@core/dtos'
import type { User } from '@/@core/domain/entities'

import type { SupabaseUser } from '../types/SupabaseUser'

export const SupabaseUserMapper = () => {
  return {
    toDTO(supabaseUser: SupabaseUser): UserDTO {
      const userDTO: UserDTO = {
        id: supabaseUser.id ?? '',
        email: supabaseUser.email ?? '',
        name: supabaseUser.name ?? '',
        slug: supabaseUser.slug ?? '',
        level: supabaseUser.level ?? 1,
        coins: supabaseUser.coins ?? 0,
        xp: supabaseUser.xp ?? 0,
        streak: supabaseUser.streak ?? 0,
        weeklyXp: supabaseUser.weekly_xp ?? 0,
        avatar: {
          id: supabaseUser.avatars?.id ?? '',
          image: supabaseUser.avatars?.image ?? '',
          name: supabaseUser.avatars?.name ?? '',
          price: supabaseUser.avatars?.price ?? 0,
        },
        ranking: {
          id: supabaseUser.rankings?.id ?? '',
          image: supabaseUser.rankings?.image ?? '',
          name: supabaseUser.rankings?.name ?? '',
          position: supabaseUser.rankings?.position ?? 0,
          reward: supabaseUser.rankings?.reward ?? 0,
        },
        rocket: {
          id: supabaseUser.rockets?.id ?? '',
          image: supabaseUser.rockets?.image ?? '',
          name: supabaseUser.rockets?.name ?? '',
          price: supabaseUser.rockets?.price ?? 0,
        },
        unlockedAchievementsIds:
          supabaseUser.users_unlocked_achievements?.map(
            ({ achievement_id }) => achievement_id
          ) ?? [],
        rescuableAchievementsIds:
          supabaseUser.users_rescuable_achievements?.map(
            ({ achievement_id }) => achievement_id
          ) ?? [],
        unlockedStarsIds:
          supabaseUser.users_unlocked_stars?.map(({ star_id }) => star_id) ?? [],
        acquiredRocketsIds:
          supabaseUser.users_acquired_rockets?.map(({ rocket_id }) => rocket_id) ?? [],
        acquiredAvatarsIds:
          supabaseUser.users_acquired_avatars?.map(({ avatar_id }) => avatar_id) ?? [],
        completedChallengesIds:
          supabaseUser.users_completed_challenges?.map(
            ({ challenge_id }) => challenge_id
          ) ?? [],
        completedPlanetsIds: [],
        didSeeRankingResult: supabaseUser.did_update_ranking,
        lastRankingPosition: supabaseUser.last_position,
        isRankingLoser: supabaseUser.is_loser ?? false,

        // studyTime: supabaseUser.study_time ?? '',
        // createdAt: supabaseUser.created_at ?? '',
        // didBreakStreak: supabaseUser.did_break_streak ?? false,
        // didCompleteSaturday: supabaseUser.did_complete_saturday ?? false,
        // weekStatus: supabaseUser.week_status as WeekStatus[],
      }

      return userDTO
    },

    toSupabase(user: User): SupabaseUser {
      const userDTO = user.dto

      const supabaseUser: SupabaseUser = {
        id: user.id,
        avatar_id: user.avatar.id,
        rocket_id: user.rocket.id,
        ranking_id: user.ranking.id,
        coins: userDTO.coins,
        email: userDTO.email,
        level: userDTO.level,
        name: userDTO.name,
        slug: userDTO.slug,
        xp: userDTO.xp,
        weekly_xp: userDTO.weeklyXp,
        streak: userDTO.streak,
      }

      return supabaseUser as unknown as SupabaseUser
    },
  }
}
