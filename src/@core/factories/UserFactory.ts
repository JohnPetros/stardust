import { Avatar, Ranking, Rocket } from '../domain/entities'
import {
  Email,
  Name,
  Slug,
  Integer,
  OrdinalNumber,
  Logical,
  RankingPosition,
} from '../domain/structs'
import { IdsCollection } from '../domain/structs/IdsCollection'
import type { UserDTO } from '../dtos'

export class UserFactory {
  static produce(dto: UserDTO) {
    return {
      email: Email.create(dto.email),
      slug: Slug.create(dto.slug),
      name: Name.create(dto.name),
      rocket: Rocket.create(dto.rocket),
      avatar: Avatar.create(dto.avatar),
      ranking: Ranking.create(dto.ranking),
      level: OrdinalNumber.create('level', dto.level),
      coins: Integer.create('coins', dto.coins),
      xp: Integer.create('xp', dto.xp),
      weeklyXp: Integer.create('weekly xp', dto.weeklyXp),
      streak: Integer.create('streak', dto.streak),
      lastRankingPosition: dto.lastRankingPosition
        ? RankingPosition.create(dto.lastRankingPosition)
        : null,
      didSeeRankingResult: Logical.create(
        'did user see ranking result?',
        dto.didSeeRankingResult
      ),
      isRankingLoser: Logical.create('is user ranking loser?', dto.isRankingLoser),
      unlockedAchievementsIds: IdsCollection.create(
        'unlocked achievements ids',
        dto.unlockedAchievementsIds
      ),
      rescuableAchievementsIds: IdsCollection.create(
        'rescuable achievements ids',
        dto.rescuableAchievementsIds
      ),
      acquiredRocketsIds: IdsCollection.create(
        'acquired rockets ids',
        dto.acquiredRocketsIds
      ),
      acquiredAvatarsIds: IdsCollection.create(
        'acquired avatars ids',
        dto.acquiredAvatarsIds
      ),
      unlockedStarsIds: IdsCollection.create('unlocked stars ids', dto.unlockedStarsIds),
      completedChallengesIds: IdsCollection.create(
        'completed challenges ids',
        dto.completedChallengesIds
      ),
      completedPlanetsIds: IdsCollection.create(
        'completed planets ids',
        dto.completedPlanetsIds
      ),
      id: dto?.id,
    }
  }
}
