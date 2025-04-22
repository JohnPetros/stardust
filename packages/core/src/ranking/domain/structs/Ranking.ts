import type { RankingUserDto } from '../../dtos'
import { RankingUser } from '../entities'

export class Ranking {
  static readonly WINNERS_COUNT = 5
  static readonly TOP_WINNERS_COUNT = 3
  static readonly LOSERS_COUNT = 5
  static readonly BASE_REWARD = 5

  private constructor(readonly users: RankingUser[]) {}

  static create(usersDto: RankingUserDto[]): Ranking {
    const rankingUsers = Ranking.orderUsersByXp([...usersDto])

    return new Ranking(rankingUsers.map(RankingUser.create))
  }

  static orderUsersByXp(users: RankingUserDto[]) {
    users.sort((previousUser: RankingUserDto, currentUser: RankingUserDto) => {
      return previousUser.position - currentUser.position
    })

    return users
  }

  get winners() {
    return this.users.slice(0, Ranking.WINNERS_COUNT)
  }

  get losers() {
    return this.users.slice(this.users.length - Ranking.LOSERS_COUNT)
  }
}
