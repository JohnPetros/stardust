import type { UserDto } from '#global/dtos'
import { Email, Integer, List, Logical, Name, Slug } from '#global/structs'
import { Level, WeekStatus } from '#profile/structs'
import { Avatar, Rocket } from '#shop/entities'
import { RankingPosition } from '#ranking/structs'
import { Tier } from '#ranking/entities'

export class UserFactory {
  static produce(dto: UserDto) {
    return {
      email: Email.create(dto.email),
      slug: Slug.create(dto.slug),
      name: Name.create(dto.name),
      rocket: Rocket.create(dto.rocket),
      avatar: Avatar.create(dto.avatar),
      tier: Tier.create(dto.tier),
      level: Level.create(dto.level),
      coins: Integer.create('User coins', dto.coins),
      xp: Integer.create('User Xp', dto.xp),
      weeklyXp: Integer.create('User Weekly Xp', dto.weeklyXp),
      weekStatus: WeekStatus.create(dto.weekStatus),
      streak: Integer.create('User Streak', dto.streak),
      lastWeekRankingPosition: dto.lastWeekRankingPosition
        ? RankingPosition.create(dto.lastWeekRankingPosition)
        : null,
      didIncrementStreakOnSaturday: Logical.create(
        'Did user increment streak on saturday?',
        dto.didIncrementStreakOnSaturday,
      ),
      canSeeRankingResult: Logical.create(
        'Can user see ranking result?',
        dto.canSeeRankingResult,
      ),
      unlockedAchievementsIds: List.create(dto.unlockedAchievementsIds),
      rescuableAchievementsIds: List.create(dto.rescuableAchievementsIds),
      acquiredRocketsIds: List.create(dto.acquiredRocketsIds),
      acquiredAvatarsIds: List.create(dto.acquiredAvatarsIds),
      unlockedStarsIds: List.create(dto.unlockedStarsIds),
      unlockedDocsIds: List.create(dto.unlockedDocsIds),
      completedChallengesIds: List.create(dto.completedChallengesIds),
      completedPlanetsIds: List.create(dto.completedPlanetsIds),
      createdAt: new Date(dto.createdAt),
      id: dto?.id,
    }
  }
}
