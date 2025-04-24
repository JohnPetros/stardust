import type { UserDto } from '../../global/dtos'
import { Datetime } from '../../global/libs'
import { Level, WeekStatus } from '../domain/structures'
import { AvatarAggregate, RocketAggregate, TierAggregate } from '../domain/aggregates'
import { Email, IdsList, Integer, Logical, Name, Slug } from '#global/structures'
import { RankingPosition } from '#ranking/structures'

export class UserFactory {
  static produce(dto: UserDto) {
    return {
      email: Email.create(dto.email.trim()),
      slug: dto.slug ? Slug.create(dto.slug) : Slug.create(dto.name),
      name: Name.create(dto.name),
      rocket: RocketAggregate.create(dto.rocket),
      avatar: AvatarAggregate.create(dto.avatar),
      tier: TierAggregate.create(dto.tier),
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
      unlockedAchievementsIds: IdsList.create(dto?.unlockedAchievementsIds),
      rescuableAchievementsIds: IdsList.create(dto?.rescuableAchievementsIds),
      acquiredRocketsIds: IdsList.create(dto?.acquiredRocketsIds),
      acquiredAvatarsIds: IdsList.create(dto?.acquiredAvatarsIds),
      unlockedStarsIds: IdsList.create(dto?.unlockedStarsIds),
      unlockedDocsIds: IdsList.create(dto?.unlockedDocsIds),
      completedChallengesIds: IdsList.create(dto?.completedChallengesIds),
      completedPlanetsIds: IdsList.create(dto?.completedPlanetsIds),
      upvotedCommentsIds: IdsList.create(dto?.upvotedCommentsIds),
      upvotedSolutionsIds: IdsList.create(dto?.upvotedSolutionsIds),
      createdAt: dto?.createdAt ?? new Datetime().date(),
      id: dto?.id,
    }
  }
}
