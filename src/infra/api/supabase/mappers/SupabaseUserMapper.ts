import type { UserDTO } from '@/@core/dtos/UserDTO'
import { User } from '@/@core/domain/entities'

import type { SupabaseUser } from '../types/SupabaseUser'

export const SupabaseUserMapper = () => {
  return {
    toDomain(supabaseUser: SupabaseUser): User {
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
        avatarId: supabaseUser.avatar_id ?? '',
        rankingId: supabaseUser.ranking_id ?? '',
        rocketId: supabaseUser.rocket_id ?? '',
        // acquiredRocketsCount: supabaseUser.acquired_rockets_count ?? 0,
        // completedChallengesCount: supabaseUser.completed_challenges_count ?? 0,
        // completedPlanetsCount: supabaseUser.completed_planets_count ?? 0,
        // unlockedStarsCount: supabaseUser.unlocked_stars_count ?? 0,
        // unlockedAchievementsCount: supabaseUser.unlocked_achievements_count ?? 0,
        // lastPosition: supabaseUser.last_position ?? 0,
        // studyTime: supabaseUser.study_time ?? '',
        // didUpdateRanking: supabaseUser.did_update_ranking ?? false,
        // createdAt: supabaseUser.created_at ?? '',
        // didBreakStreak: supabaseUser.did_break_streak ?? false,
        // didCompleteSaturday: supabaseUser.did_complete_saturday ?? false,
        // weekStatus: supabaseUser.week_status as WeekStatus[],
        // isLoser: supabaseUser.is_loser ?? false,
      }

      return User.create(userDTO)
    },

    toSupabase(user: User): SupabaseUser {
      const userProps = Object.keys(user.dto) as Partial<keyof User>[]

      return userProps.reduce((supabaseUser, userProp) => {
        switch (userProp) {
          case 'id':
            return { ...supabaseUser, id: user.id }
          case 'email':
            return { ...supabaseUser, email: user.email.value }
          case 'slug':
            return { ...supabaseUser, slug: user.slug.value }
          case 'level':
            return { ...supabaseUser, level: user.level }
          case 'name':
            return { ...supabaseUser, name: user.name.value }
          case 'xp':
            return { ...supabaseUser, xp: user.xp }
          case 'streak':
            return { ...supabaseUser, streak: user.streak }
          case 'coins':
            return { ...supabaseUser, coins: user.coins }
          case 'avatarId':
            return { ...supabaseUser, avatar_id: user.avatarId }
          case 'rankingId':
            return {
              ...supabaseUser,
              ranking_id: user.rankingId,
            }
          case 'weeklyXp':
            return {
              ...supabaseUser,
              weekly_xp: user.weeklyXp,
            }
          // case 'weekStatus':
          //   return {
          //     ...supabaseUser,
          //     week_status: user.weekStatus,
          //   }
          // case 'didBreakStreak':
          //   return { ...supabaseUser, did_break_streak: user.didBreakStreak }
          // case 'didCompleteSaturday':
          //   return {
          //     ...supabaseUser,
          //     did_complete_saturday: user.didCompleteSaturday,
          //   }
          // case 'didUpdateRanking':
          //   return {
          //     ...supabaseUser,
          //     did_update_ranking: user.didUpdateRanking,
          //   }
          // case 'isLoser':
          //   return {
          //     ...supabaseUser,
          //     is_loser: user.isLoser,
          //   }
          // case 'lastPosition':
          //   return {
          //     ...supabaseUser,
          //     last_position: user.lastPosition,
          //   }
          // case 'studyTime':
          //   return {
          //     ...supabaseUser,
          //     study_time: user.studyTime,
          //   }
          default:
            return supabaseUser
        }
      }, {} as SupabaseUser)
    },
  }
}
