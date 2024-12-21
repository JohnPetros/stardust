import { Avatar, Rocket, Tier } from '../domain/entities'
import {
  Email,
  Integer,
  Level,
  List,
  Logical,
  Name,
  RankingPosition,
  Slug,
  WeekStatus,
} from '../domain/structs'
import type { UserDto } from '../dtos'

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
