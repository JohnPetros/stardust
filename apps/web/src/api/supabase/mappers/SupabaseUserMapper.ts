import type { UserDto } from '#dtos'
import type { User } from '@/@core/domain/entities'

import type { SupabaseUser } from '../types/SupabaseUser'

export const SupabaseUserMapper = () => {
  return {
    toDto(supabaseUser: SupabaseUser): UserDto {
      const userDto: UserDto = {
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
          id: supabaseUser.avatar?.id ?? '',
          image: supabaseUser.avatar?.image ?? '',
          name: supabaseUser.avatar?.name ?? '',
          price: supabaseUser.avatar?.price ?? 0,
        },
        tier: {
          id: supabaseUser.tier?.id ?? '',
          image: supabaseUser.tier?.image ?? '',
          name: supabaseUser.tier?.name ?? '',
          position: supabaseUser.tier?.position ?? 0,
          reward: supabaseUser.tier?.reward ?? 0,
        },
        rocket: {
          id: supabaseUser.rocket?.id ?? '',
          image: supabaseUser.rocket?.image ?? '',
          name: supabaseUser.rocket?.name ?? '',
          price: supabaseUser.rocket?.price ?? 0,
        },
        unlockedAchievementsIds:
          supabaseUser.users_unlocked_achievements?.map(
            ({ achievement_id }) => achievement_id,
          ) ?? [],
        rescuableAchievementsIds:
          supabaseUser.users_rescuable_achievements?.map(
            ({ achievement_id }) => achievement_id,
          ) ?? [],
        unlockedStarsIds:
          supabaseUser.users_unlocked_stars?.map(({ star_id }) => star_id) ?? [],
        acquiredRocketsIds:
          supabaseUser.users_acquired_rockets?.map(({ rocket_id }) => rocket_id) ?? [],
        acquiredAvatarsIds:
          supabaseUser.users_acquired_avatars?.map(({ avatar_id }) => avatar_id) ?? [],
        completedChallengesIds:
          supabaseUser.users_completed_challenges?.map(
            ({ challenge_id }) => challenge_id,
          ) ?? [],
        completedPlanetsIds: [],
        canSeeRankingResult: supabaseUser.can_see_ranking,
        lastWeekRankingPosition: supabaseUser.last_week_ranking_position,
        weekStatus: supabaseUser.week_status,
        createdAt: supabaseUser.created_at,
        didIncrementStreakOnSaturday: supabaseUser.did_complete_saturday,

        // studyTime: supabaseUser.study_time ?? '',
        // createdAt: supabaseUser.created_at ?? '',
        // didBreakStreak: supabaseUser.did_break_streak ?? false,
        // didCompleteSaturday: supabaseUser.did_complete_saturday ?? false,
        // weekStatus: supabaseUser.week_status as WeekStatus[],
      }

      return userDto
    },

    toSupabase(user: User): SupabaseUser {
      const userDto = user.dto

      // @ts-ignore
      const supabaseUser: SupabaseUser = {
        id: user.id,
        avatar_id: user.avatar.id,
        rocket_id: user.rocket.id,
        tier_id: user.tier.id,
        coins: userDto.coins,
        email: userDto.email,
        level: userDto.level,
        name: userDto.name,
        slug: userDto.slug,
        xp: userDto.xp,
        weekly_xp: userDto.weeklyXp,
        streak: userDto.streak,
        can_see_ranking: userDto.canSeeRankingResult,
        created_at: userDto.createdAt,
        week_status: userDto.weekStatus,
      }

      return supabaseUser as unknown as SupabaseUser
    },
  }
}
