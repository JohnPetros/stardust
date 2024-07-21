import type { AvatarDTO } from './AvatarDTO'
import type { RocketDTO } from './RocketDTO'
import type { TierDTO } from './TierDTO'

export type UserDTO = {
  id?: string
  slug: string
  email: string
  name: string
  level: number
  coins: number
  xp: number
  weeklyXp: number
  weekStatus: string[]
  streak: number
  tier: TierDTO
  rocket: RocketDTO
  avatar: AvatarDTO
  unlockedStarsIds: string[]
  acquiredRocketsIds: string[]
  acquiredAvatarsIds: string[]
  unlockedAchievementsIds: string[]
  rescuableAchievementsIds: string[]
  completedChallengesIds: string[]
  completedPlanetsIds: string[]
  canSeeRankingResult: boolean
  lastWeekRankingPosition: number | null
  createdAt: string
  // didBreakStreak: boolean
  // didCompleteSaturday: boolean
  // studyTime: string
  // weekStatus: WeekStatus[]
}
