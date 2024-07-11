import type { AvatarDTO } from './AvatarDTO'
import type { RankingDTO } from './RankingDTO'
import type { RocketDTO } from './RocketDTO'

export type UserDTO = {
  id: string
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
  unlockedStarsCount: number
  acquiredRocketsCount: number
  unlockedAchievementsCount: number
  completedChallengesCount: number
  completedPlanetsCount: number

  // createdAt: string
  // didBreakStreak: boolean
  // didCompleteSaturday: boolean
  // didUpdateRanking: boolean
  // isLoser: boolean | null
  // lastPosition: number | null
  // studyTime: string
  // weekStatus: WeekStatus[]
}
