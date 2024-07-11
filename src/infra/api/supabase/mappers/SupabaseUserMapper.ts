import type { UserDTO, AvatarDTO, RankingDTO, RocketDTO } from '@/@core/dtos'
import type { User } from '@/@core/domain/entities'

import type { SupabaseUser } from '../types/SupabaseUser'

export const SupabaseUserMapper = () => {
  return {
    toDTO(
      supabaseUser: SupabaseUser,
      avatarDTO: AvatarDTO,
      rocketDTO: RocketDTO,
      rankingDTO: RankingDTO
    ): UserDTO {
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
        avatar: avatarDTO,
        rocket: rocketDTO,
        ranking: rankingDTO,
        unlockedAchievementsCount: supabaseUser.unlocked_achievements_count ?? 0,
        unlockedStarsCount: supabaseUser.unlocked_stars_count ?? 0,
        acquiredRocketsCount: supabaseUser.acquired_rockets_count ?? 0,
        completedChallengesCount: supabaseUser.completed_challenges_count ?? 0,
        completedPlanetsCount: supabaseUser.completed_planets_count ?? 0,
        // lastPosition: supabaseUser.last_position ?? 0,
        // studyTime: supabaseUser.study_time ?? '',
        // didUpdateRanking: supabaseUser.did_update_ranking ?? false,
        // createdAt: supabaseUser.created_at ?? '',
        // didBreakStreak: supabaseUser.did_break_streak ?? false,
        // didCompleteSaturday: supabaseUser.did_complete_saturday ?? false,
        // weekStatus: supabaseUser.week_status as WeekStatus[],
        // isLoser: supabaseUser.is_loser ?? false,
      }

      return userDTO
    },

    toSupabase(userDTO: UserDTO): SupabaseUser {
      const supabaseUser: SupabaseUser = {
        id: userDTO.id,
        coins: userDTO.coins,
        email: userDTO.email,
        level: userDTO.level,
        avatar_id: userDTO.avatar.id,
        rocket_id: userDTO.rocket.id,
        ranking_id: userDTO.ranking.id,
        name: userDTO.name,
        slug: userDTO.slug,
        xp: userDTO.xp,
        weekly_xp: userDTO.weeklyXp,
        acquired_rockets_count: userDTO.acquiredRocketsCount,
        completed_challenges_count: userDTO.completedChallengesCount,
        unlocked_achievements_count: userDTO.unlockedAchievementsCount,
        completed_planets_count: userDTO.completedPlanetsCount,
        streak: userDTO.streak,
      }

      return supabaseUser as unknown as SupabaseUser
    },
  }
}
