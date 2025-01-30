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
  rocket: {
    id: string
    dto?: RocketDto
  }
  avatar: {
    id: string
    dto?: AvatarDto
  }
  tier: {
    id: string
    dto?: TierDto
  }
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
}
