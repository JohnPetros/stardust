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
      slug: dto.slug ? Slug.create(dto.slug) : Slug.create(dto.name),
      name: Name.create(dto.name),
      rocket: Rocket.create(dto.rocket),
      avatar: Avatar.create(dto.avatar),
      tier: Tier.create(dto.tier),
      level: Level.create(dto.level),
      coins: Integer.create('User coins', dto.coins ?? 0),
      xp: Integer.create('User Xp', dto.xp ?? 0),
      weeklyXp: Integer.create('User Weekly Xp', dto.weeklyXp ?? 0),
      weekStatus: WeekStatus.create(dto?.weekStatus),
      streak: Integer.create('User Streak', dto?.streak ?? 0),
      lastWeekRankingPosition: dto.lastWeekRankingPosition
        ? RankingPosition.create(dto.lastWeekRankingPosition)
        : null,
      didIncrementStreakOnSaturday: Logical.create(
        'Did user increment streak on saturday?',
        dto?.didIncrementStreakOnSaturday ?? false,
      ),
      canSeeRankingResult: Logical.create(
        'Can user see ranking result?',
        dto?.canSeeRankingResult ?? false,
      ),
      unlockedAchievementsIds: List.create(dto?.unlockedAchievementsIds ?? []),
      rescuableAchievementsIds: List.create(dto?.rescuableAchievementsIds ?? []),
      acquiredRocketsIds: List.create(dto?.acquiredRocketsIds ?? []),
      acquiredAvatarsIds: List.create(dto?.acquiredAvatarsIds ?? []),
      unlockedStarsIds: List.create(dto?.unlockedStarsIds ?? []),
      unlockedDocsIds: List.create(dto?.unlockedDocsIds ?? []),
      completedChallengesIds: List.create(dto?.completedChallengesIds ?? []),
      completedPlanetsIds: List.create(dto?.completedPlanetsIds ?? []),
      createdAt: dto?.createdAt ? new Date(dto?.createdAt) : new Date(),
      id: dto?.id,
    }
  }
}
