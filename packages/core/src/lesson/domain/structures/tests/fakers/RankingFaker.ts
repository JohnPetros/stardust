import { RankingUsersFaker } from '#fakers/entities'
import { Ranking } from '../../../../../ranking/domain/structures'

export class RankingFaker {
  static fake(usersCount?: number): Ranking {
    return Ranking.create(
      Array.from({ length: usersCount ?? 20 }).map(() => RankingUsersFaker.fakeDto()),
    )
  }
}
