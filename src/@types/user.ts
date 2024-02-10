import type { WeekStatus } from './WeekStatus'

export type User = {
  id: string
  email: string
  name: string
  slug: string
  level: number
  coins: number
  xp: number
  streak: number
  weeklyXp: number
  avatarId: string
  createdAt: string
  didBreakStreak: boolean
  didCompleteSaturday: boolean
  didUpdateRanking: boolean
  isLoser: boolean | null
  lastPosition: number | null
  rankingId: string
  rocketId: string
  studyTime: string
  weekStatus: WeekStatus[]
  unlockedStarsCount: number
  acquiredRocketsCount: number
  unlockedAchievementsCount: number
  completedChallengesCount: number
  completedPlanetsCount: number
}
