import type { TierDto } from '#ranking/dtos'
import type { AvatarDto, RocketDto } from '#shop/dtos'

export type UserDto = {
  id?: string
  slug?: string
  email: string
  name: string
  level?: number
  coins?: number
  xp?: number
  weeklyXp?: number
  weekStatus?: string[]
  streak?: number
  tier: TierDto
  rocket: RocketDto
  avatar: AvatarDto
  unlockedStarsIds?: string[]
  acquiredRocketsIds?: string[]
  unlockedDocsIds?: string[]
  acquiredAvatarsIds?: string[]
  unlockedAchievementsIds?: string[]
  rescuableAchievementsIds?: string[]
  completedChallengesIds?: string[]
  completedPlanetsIds?: string[]
  upvotedCommentsIds?: string[]
  upvotedSolutionsIds?: string[]
  canSeeRankingResult?: boolean
  hasCompletedSpace?: boolean
  lastWeekRankingPosition?: number | null
  createdAt?: Date
  didBreakStreak?: boolean
  // studyTime: string
}
