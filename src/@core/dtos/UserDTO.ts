import type { AvatarDTO } from './AvatarDTO'
import type { RankingDTO } from './RankingDTO'
import type { RocketDTO } from './RocketDTO'

export type UserDTO = {
  id?: string
  slug: string
  email: string
  name: string
  level: number
  coins: number
  xp: number
  weeklyXp: number
  streak: number
  ranking: RankingDTO
  rocket: RocketDTO
  avatar: AvatarDTO
  unlockedStarsIds: string[]
  acquiredRocketsIds: string[]
  acquiredAvatarsIds: string[]
  unlockedAchievementsIds: string[]
  rescuableAchievementsIds: string[]
  completedChallengesIds: string[]
  completedPlanetsIds: string[]
  didSeeRankingResult: boolean
  lastRankingPosition: number | null
  isRankingLoser: boolean

  // createdAt: string
  // didBreakStreak: boolean
  // didCompleteSaturday: boolean
  // studyTime: string
  // weekStatus: WeekStatus[]
}
