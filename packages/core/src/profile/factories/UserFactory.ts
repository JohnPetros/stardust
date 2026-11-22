import {
  Email,
  IdsList,
  InsigniaRole,
  Integer,
  Logical,
  Name,
  Slug,
} from '#global/domain/structures/index'
import { Datetime } from '#global/libs/index'
import { RankingPosition } from '#ranking/domain/structures/index'
import {
  AvatarAggregate,
  GalaxyAggregate,
  RocketAggregate,
  TierAggregate,
} from '../domain/aggregates'
import { Level, WeekStatus } from '../domain/structures'
import type { UserDto } from '../domain/entities/dtos'

export class UserFactory {
  static produce(dto: UserDto) {
    return {
      ...UserFactory.produceProfile(dto),
      ...UserFactory.produceProgress(dto),
      insigniaRoles: dto?.insigniaRoles ? dto.insigniaRoles.map(InsigniaRole.create) : [],
      ...UserFactory.produceFlags(dto),
      lastWeekRankingPosition: dto.lastWeekRankingPosition
        ? RankingPosition.create(dto.lastWeekRankingPosition)
        : null,
      ...UserFactory.produceIdsLists(dto),
      createdAt: dto?.createdAt ?? new Datetime().date(),
      id: dto?.id,
    }
  }

  private static produceIdsLists(dto: UserDto) {
    return {
      unlockedAchievementsIds: IdsList.create(dto?.unlockedAchievementsIds),
      rescuableAchievementsIds: IdsList.create(dto?.rescuableAchievementsIds),
      acquiredRocketsIds: IdsList.create(dto?.acquiredRocketsIds),
      acquiredAvatarsIds: IdsList.create(dto?.acquiredAvatarsIds),
      completedStarsIds: IdsList.create(dto?.completedStarsIds),
      openedPlanetsIds: IdsList.create(dto?.openedPlanetsIds),
      unlockedDocsIds: IdsList.create(dto?.unlockedDocsIds),
      completedChallengesIds: IdsList.create(dto?.completedChallengesIds),
      completedPlanetsIds: IdsList.create(dto?.completedPlanetsIds),
      upvotedCommentsIds: IdsList.create(dto?.upvotedCommentsIds),
      upvotedSolutionsIds: IdsList.create(dto?.upvotedSolutionsIds),
    }
  }

  private static produceFlags(dto: UserDto) {
    return {
      hasCompletedSpace: Logical.create(
        dto?.hasCompletedSpace ?? false,
        'Esse usuário já completou todos os planetas?',
      ),
      hasEngineerInsignia: Logical.create(
        dto?.hasEngineerInsignia ?? false,
        'Esse usuário possui a insígnia de engenheiro espacial?',
      ),
      didBreakStreak: Logical.create(
        dto?.didBreakStreak ?? false,
        'Esse usuário quebrou sua streak?',
      ),
      canSeeRankingResult: Logical.create(
        dto?.canSeeRankingResult ?? false,
        'Esse usuário pode ver o resultado do ranking?',
      ),
    }
  }

  private static produceProfile(dto: UserDto) {
    return {
      email: Email.create(dto.email.trim()),
      slug: dto.slug ? Slug.create(dto.slug) : Slug.create(dto.name),
      name: Name.create(dto.name),
      rocket: RocketAggregate.create(dto.rocket),
      currentGalaxy: dto.currentGalaxy ? GalaxyAggregate.create(dto.currentGalaxy) : null,
      avatar: AvatarAggregate.create(dto.avatar),
      tier: TierAggregate.create(dto.tier),
      level: Level.create(dto.level),
    }
  }

  private static produceProgress(dto: UserDto) {
    return {
      coins: Integer.create(dto.coins ?? 0, 'Moedas do usuário'),
      xp: Integer.create(dto.xp ?? 0, 'Xp do usuário'),
      weeklyXp: Integer.create(dto.weeklyXp ?? 0, 'Xp semanal do usuário'),
      weekStatus: WeekStatus.create(dto?.weekStatus),
      streak: Integer.create(dto?.streak ?? 0, 'Streak do usuário'),
    }
  }
}
