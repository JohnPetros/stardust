import type { UserDto } from '@stardust/core/global/dtos'
import type { User } from '@stardust/core/global/entities'
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
          dto: {
            image: supabaseUser.avatar?.image ?? '',
            name: supabaseUser.avatar?.name ?? '',
            price: supabaseUser.avatar?.price ?? 0,
            isAcquiredByDefault: supabaseUser.avatar?.is_acquired_by_default ?? false,
            isSelectedByDefault: supabaseUser.avatar?.is_selected_by_default ?? false,
          },
        },
        tier: {
          id: supabaseUser.tier?.id ?? '',
          dto: {
            image: supabaseUser.tier?.image ?? '',
            name: supabaseUser.tier?.name ?? '',
            position: supabaseUser.tier?.position ?? 0,
            reward: supabaseUser.tier?.reward ?? 0,
          },
        },
        rocket: {
          id: supabaseUser.rocket?.id ?? '',
          dto: {
            image: supabaseUser.rocket?.image ?? '',
            name: supabaseUser.rocket?.name ?? '',
            price: supabaseUser.rocket?.price ?? 0,
            isAcquiredByDefault: supabaseUser.rocket?.is_acquired_by_default ?? false,
            isSelectedByDefault: supabaseUser.rocket?.is_selected_by_default ?? false,
          },
        },
        unlockedAchievementsIds:
          supabaseUser.unlocked_achievements_ids?.filter(Boolean) ?? [],
        rescuableAchievementsIds:
          supabaseUser.rescuable_achievements_ids?.filter(Boolean) ?? [],
        unlockedStarsIds: supabaseUser.unlocked_stars_ids?.filter(Boolean) ?? [],
        acquiredRocketsIds: supabaseUser.acquired_rockets_ids?.filter(Boolean) ?? [],
        acquiredAvatarsIds: supabaseUser.acquired_avatars_ids?.filter(Boolean) ?? [],
        completedChallengesIds:
          supabaseUser.completed_challenges_ids?.filter(Boolean) ?? [],
        upvotedCommentsIds: supabaseUser.upvoted_comments_ids?.filter(Boolean) ?? [],
        upvotedSolutionsIds: supabaseUser.upvoted_solutions_ids?.filter(Boolean) ?? [],
        completedPlanetsIds: [],
        canSeeRankingResult: supabaseUser.can_see_ranking ?? false,
        lastWeekRankingPosition: supabaseUser.last_week_ranking_position,
        weekStatus: supabaseUser.week_status ?? [],
        createdAt: supabaseUser.created_at
          ? new Date(supabaseUser.created_at)
          : new Date(),
      }

      return userDto
    },

    toSupabase(user: User): SupabaseUser {
      // @ts-ignore
      const supabaseUser: SupabaseUser = {
        id: user.id,
        avatar_id: user.avatarId,
        rocket_id: user.rocketId,
        tier_id: user.tierId,
        coins: user.coins.value,
        email: user.email.value,
        level: user.level.value,
        name: user.name.value,
        slug: user.slug.value,
        xp: user.xp.value,
        weekly_xp: user.weeklyXp.value,
        week_status: user.weekStatus.statuses,
        streak: user.streak.value,
        can_see_ranking: user.canSeeRankingResult.value,
        did_break_streak: user.didBreakStreak.value,
        created_at: user.createdAt.toDateString(),
      }

      return supabaseUser as unknown as SupabaseUser
    },
  }
}
