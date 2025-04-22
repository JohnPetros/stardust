import type { UserDto } from '../../dtos'
import { Email, Integer, List, Logical, Name, Slug } from '../structs'
import { Level, WeekStatus } from '../../../profile/domain/structs'
import { Avatar, Rocket } from '../../../shop/domain/entities'
import { RankingPosition } from '../../../ranking/domain/structs'
import { Tier } from '../../../ranking/domain/entities'
import { Datetime } from '../../libs'

export class UserFactory {
  static produce(dto: UserDto) {
    return {
      email: Email.create(dto.email.trim()),
      slug: dto.slug ? Slug.create(dto.slug) : Slug.create(dto.name),
      name: Name.create(dto.name),
      rocket: {
        id: dto.rocket.id,
        entity: dto.rocket.dto ? Rocket.create(dto.rocket.dto) : undefined,
      },
      avatar: {
        id: dto.avatar.id,
        entity: dto.avatar.dto ? Avatar.create(dto.avatar.dto) : undefined,
      },
      tier: {
        id: dto.tier.id,
        entity: dto.tier.dto ? Tier.create(dto.tier.dto) : undefined,
      },
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
      upvotedSolutionsIds: List.create(dto?.upvotedSolutionsIds ?? []),
      createdAt: dto?.createdAt ?? new Datetime().date(),
      id: dto?.id,
    }
  }
}
