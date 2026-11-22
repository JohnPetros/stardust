import type {
  AvatarAggregateDto,
  GalaxyAggregateDto,
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
  currentGalaxy?: GalaxyAggregateDto | null
  hasCompletedSpace?: boolean
  hasEngineerInsignia?: boolean
  completedStarsIds?: string[]
  openedPlanetsIds?: string[]
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
