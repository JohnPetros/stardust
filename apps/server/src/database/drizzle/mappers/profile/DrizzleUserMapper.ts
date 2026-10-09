import { User } from '@stardust/core/profile/entities'
import type { UserDto } from '@stardust/core/profile/entities/dtos'
import type { DrizzleUser, DrizzleInsertUser } from '../../types/entities/profile'

export class DrizzleUserMapper {
  static toEntity(row: DrizzleUser): User {
    return User.create(DrizzleUserMapper.toDto(row))
  }
  static toDto(row: DrizzleUser): UserDto {
    return {
      ...accountProfile(row),
      ...appearance(row),
      ...progress(row),
      ...rankingState(row),
    }
  }

  static toPersistence(user: User): DrizzleInsertUser {
    return {
      ...persistenceIdentity(user),
      ...persistenceSelection(user),
      ...persistencePerformance(user),
      ...persistenceStudyRoutine(user),
    }
  }
}

function accountProfile(row: DrizzleUser) {
  return {
    ...identity(row),
    ...performance(row),
    ...studyRoutine(row),
  }
}

function appearance(row: DrizzleUser) {
  return {
    avatar: selectedItem(row.avatar),
    rocket: selectedItem(row.rocket),
    tier: selectedTier(row),
  }
}

function selectedTier(row: DrizzleUser) {
  return {
    id: row.tier?.id ?? '',
    entity: tierProfile(row.tier),
  }
}
function identity(row: DrizzleUser) {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    slug: row.slug,
    createdAt: row.createdAt,
  }
}
function performance(row: DrizzleUser) {
  return { level: row.level, coins: row.coins, xp: row.xp, weeklyXp: row.weeklyXp }
}
function studyRoutine(row: DrizzleUser) {
  return {
    streak: row.streak,
    didBreakStreak: row.didBreakStreak,
    weekStatus: row.weekStatus,
  }
}
function rankingState(row: DrizzleUser) {
  return {
    canSeeRankingResult: row.canSeeRanking,
    hasCompletedSpace: row.hasCompletedSpace,
    lastWeekRankingPosition: row.lastWeekRankingPosition,
  }
}
function selectedItem(item: DrizzleUser['avatar'] | DrizzleUser['rocket']) {
  return {
    id: item?.id ?? '',
    entity: { name: item?.name ?? '', image: item?.image ?? '' },
  }
}
function tierProfile(tier: DrizzleUser['tier']) {
  return {
    name: tier?.name ?? '',
    image: tier?.image ?? '',
    position: tier?.position ?? 0,
    reward: tier?.reward ?? 0,
  }
}
function progress(row: DrizzleUser) {
  return {
    ...achievements(row),
    ...starUnlocks(row),
    ...acquisitions(row),
    ...endorsements(row),
    ...completions(row),
  }
}
function relationshipIds<Row>(
  rows: readonly Row[] | null | undefined,
  id: (row: Row) => string,
): string[] {
  return rows?.map(id) ?? []
}
function achievements(row: DrizzleUser) {
  return {
    ...achievementProgress(row),
    insigniaRoles: row.insignias?.map((item) => item.role) ?? [],
  }
}
function achievementProgress(row: DrizzleUser) {
  return {
    unlockedAchievementsIds: relationshipIds(
      row.usersUnlockedAchievements,
      (item) => item.achievementId,
    ),
    rescuableAchievementsIds: relationshipIds(
      row.usersRescuableAchievements,
      (item) => item.achievementId,
    ),
  }
}
function starUnlocks(row: DrizzleUser) {
  return {
    unlockedStarsIds: relationshipIds(row.usersUnlockedStars, (item) => item.starId),
    recentlyUnlockedStarsIds: relationshipIds(
      row.usersRecentlyUnlockedStars,
      (item) => item.starId,
    ),
  }
}
function acquisitions(row: DrizzleUser) {
  return {
    acquiredRocketsIds: relationshipIds(
      row.usersAcquiredRockets,
      (item) => item.rocketId,
    ),
    acquiredAvatarsIds: relationshipIds(
      row.usersAcquiredAvatars,
      (item) => item.avatarId,
    ),
  }
}
function endorsements(row: DrizzleUser) {
  return {
    upvotedCommentsIds: relationshipIds(
      row.usersUpvotedComments,
      (item) => item.commentId,
    ),
    upvotedSolutionsIds: relationshipIds(
      row.usersUpvotedSolutions,
      (item) => item.solutionId,
    ),
  }
}
function completions({ usersCompletedChallenges, usersCompletedPlanets }: DrizzleUser) {
  return {
    completedChallengesIds: relationshipIds(
      usersCompletedChallenges,
      (item) => item.challengeId,
    ),
    completedPlanetsIds:
      usersCompletedPlanets?.flatMap((item) => (item.planetId ? [item.planetId] : [])) ??
      [],
  }
}
function persistenceIdentity(user: User) {
  return {
    id: user.id.value,
    name: user.name.value,
    email: user.email.value,
    slug: user.slug.value,
  }
}
function persistenceSelection(user: User) {
  return {
    avatarId: user.avatar.id.value,
    rocketId: user.rocket.id.value,
    tierId: user.tier.id.value,
  }
}
function persistencePerformance(user: User) {
  return {
    coins: user.coins.value,
    xp: user.xp.value,
    weeklyXp: user.weeklyXp.value,
    level: user.level.value.number.value,
  }
}
function persistenceStudyRoutine(user: User) {
  return {
    streak: user.streak.value,
    weekStatus: user.weekStatus.value,
    canSeeRanking: user.canSeeRankingResult.value,
    didBreakStreak: user.didBreakStreak.value,
  }
}
