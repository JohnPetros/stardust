import { Ranking } from '../../../ranking/Ranking'
import { RankingUsersFaker } from '@/@core/domain/entities/tests/fakers/RankingUserFaker'

export class RankingFaker {
  static fake(usersCount?: number): Ranking {
    return Ranking.create(
      Array.from({ length: usersCount ?? 20 }).map(() => RankingUsersFaker.fakeDto()),
    )
  }
}
