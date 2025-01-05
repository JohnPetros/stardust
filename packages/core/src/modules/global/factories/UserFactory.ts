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
      coins: Integer.create(dto.coins ?? 0, 'Moedas do usuário'),
      xp: Integer.create(dto.xp ?? 0, 'Xp do usuário'),
      weeklyXp: Integer.create(dto.weeklyXp ?? 0, 'Xp semanal do usuário'),
      weekStatus: WeekStatus.create(dto?.weekStatus),
      streak: Integer.create(dto?.streak ?? 0, 'Streak do usuário'),
      lastWeekRankingPosition: dto.lastWeekRankingPosition
        ? RankingPosition.create(dto.lastWeekRankingPosition)
        : null,
      didBreakStreak: Logical.create(
        dto?.didBreakStreak ?? false,
        'Esse usuário quebrou sua streak?',
      ),
      canSeeRankingResult: Logical.create(
        dto?.canSeeRankingResult ?? false,
        'Esse usuário pode ver o resultado do ranking?',
      ),
      hasCompletedSpace: Logical.create(
        dto?.hasCompletedSpace ?? false,
        'Esse usuário já completou todos os planetas?',
      ),
      unlockedAchievementsIds: List.create(dto?.unlockedAchievementsIds ?? []),
      rescuableAchievementsIds: List.create(dto?.rescuableAchievementsIds ?? []),
      acquiredRocketsIds: List.create(dto?.acquiredRocketsIds ?? []),
      acquiredAvatarsIds: List.create(dto?.acquiredAvatarsIds ?? []),
      unlockedStarsIds: List.create(dto?.unlockedStarsIds ?? []),
      unlockedDocsIds: List.create(dto?.unlockedDocsIds ?? []),
      completedChallengesIds: List.create(dto?.completedChallengesIds ?? []),
      completedPlanetsIds: List.create(dto?.completedPlanetsIds ?? []),
      upvotedCommentsIds: List.create(dto?.upvotedCommentsIds ?? []),
      upvotedSolutionsIds: List.create(dto?.upvotedCommentsIds ?? []),
      createdAt: dto?.createdAt ?? new Date(),
      id: dto?.id,
    }
  }
}
