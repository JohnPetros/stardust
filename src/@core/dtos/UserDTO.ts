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
  avatarId: string
  rankingId: string
  rocketId: string
  // createdAt: string
  // didBreakStreak: boolean
  // didCompleteSaturday: boolean
  // didUpdateRanking: boolean
  // isLoser: boolean | null
  // lastPosition: number | null
  // studyTime: string
  // weekStatus: WeekStatus[]
  // unlockedStarsCount: number
  // acquiredRocketsCount: number
  // unlockedAchievementsCount: number
  // completedChallengesCount: number
  // completedPlanetsCount: number
}
