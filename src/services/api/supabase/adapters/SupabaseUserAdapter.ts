import type { SupabaseUser } from '../types/SupabaseUser'

import type { User } from '@/@types/User'
import type { WeekStatus } from '@/@types/WeekStatus'

export const SupabaseUserAdapter = (supabaseUser: SupabaseUser) => {
  const user: User = {
    id: supabaseUser.id ?? '',
    email: supabaseUser.email ?? '',
    name: supabaseUser.name ?? '',
    slug: supabaseUser.slug ?? '',
    level: supabaseUser.level ?? 1,
    coins: supabaseUser.coins ?? 0,
    xp: supabaseUser.xp ?? 0,
    weeklyXp: supabaseUser.weekly_xp ?? 0,
    avatarId: supabaseUser.avatar_id ?? '',
    rankingId: supabaseUser.ranking_id ?? '',
    rocketId: supabaseUser.rocket_id ?? '',
    streak: supabaseUser.streak ?? 0,
    acquiredRocketsCount: supabaseUser.acquired_rockets_count ?? 0,
    completedChallengesCount: supabaseUser.completed_challenges_count ?? 0,
    completedPlanetsCount: supabaseUser.completed_planets_count ?? 0,
    unlockedStarsCount: supabaseUser.unlocked_stars_count ?? 0,
    unlockedAchievementsCount: supabaseUser.unlocked_achievements_count ?? 0,
    lastPosition: supabaseUser.last_position ?? 0,
    studyTime: supabaseUser.study_time ?? '',
    didUpdateRanking: supabaseUser.did_update_ranking ?? false,
    createdAt: supabaseUser.created_at ?? '',
    didBreakStreak: supabaseUser.did_break_streak ?? false,
    didCompleteSaturday: supabaseUser.did_complete_saturday ?? false,
    weekStatus: supabaseUser.week_status as WeekStatus[],
    isLoser: supabaseUser.is_loser ?? false,
  }

  return user
}
