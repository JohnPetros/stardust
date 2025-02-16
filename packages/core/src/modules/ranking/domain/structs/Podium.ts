import type { RankingUserDto } from '#ranking/dtos'
import { RankingUser } from '#ranking/entities'

export class Podium {
  private constructor(readonly winners: RankingUser[]) {}

  static create(winnersDto: RankingUserDto[]) {
    const winners = winnersDto.map(RankingUser.create)

    const orderedWinners = Podium.orderWinners(winners)
    return new Podium(orderedWinners)
  }

  static orderWinners(winners: RankingUser[]) {
    const orderedWinners = [...winners].sort((a: RankingUser, b: RankingUser) => {
      const previousPosition = a.rankingPosition.position.value
      const nextPosition = b.rankingPosition.position.value

      if (previousPosition === 2) {
        return -1
      }
      if (previousPosition === 1) {
        return nextPosition === 2 ? 1 : -1
      }
      if (previousPosition === 3) {
        return nextPosition === 2 || nextPosition === 1 ? 1 : -1
      }

      return 1
    })

    return orderedWinners
  }
}
