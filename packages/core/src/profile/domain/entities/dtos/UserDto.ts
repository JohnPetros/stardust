import type {
  AvatarAggregateDto,
  RocketAggregateDto,
  TierAggregateDto,
} from '../../aggregates/dtos'

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
  rocket: RocketAggregateDto
  avatar: AvatarAggregateDto
  tier: TierAggregateDto
  hasCompletedSpace?: boolean
  hasEngineerInsignia?: boolean
  unlockedStarsIds?: string[]
  recentlyUnlockedStarsIds?: string[]
  acquiredRocketsIds?: string[]
  unlockedDocsIds?: string[]
  acquiredAvatarsIds?: string[]
  insigniaRoles?: string[]
  unlockedAchievementsIds?: string[]
  rescuableAchievementsIds?: string[]
  completedChallengesIds?: string[]
  completedPlanetsIds?: string[]
  upvotedCommentsIds?: string[]
  upvotedSolutionsIds?: string[]
  canSeeRankingResult?: boolean
  lastWeekRankingPosition?: number | null
  createdAt?: Date
  didBreakStreak?: boolean
}
