import type { RankingUserDTO } from '@/@core/dtos'
import { RankingUser } from '../entities/RankingUser'

export class Ranking {
  static readonly WINNERS_COUNT = 5
  static readonly TOP_WINNERS_COUNT = 3
  static readonly LOSERS_COUNT = 5
  static readonly BASE_REWARD = 5

  private constructor(readonly users: RankingUser[]) {}

  static create(usersDTO: RankingUserDTO[]): Ranking {
    const rankingUsers = Ranking.orderUsersByXp([...usersDTO])

    return new Ranking(
      rankingUsers.map((user, index) => RankingUser.create(user, index + 1))
    )
  }

  static orderUsersByXp(users: RankingUserDTO[]) {
    users.sort((previousUser: RankingUserDTO, currentUser: RankingUserDTO) => {
      return currentUser.xp - previousUser.xp
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
