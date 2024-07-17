import { RANKING } from '@/@core/domain/constants'
import { Ranking, User } from '@/@core/domain/entities'
import type { RankingDTO, RankingWinnerDTO, UserDTO } from '@/@core/dtos'
import type { IUseCase } from '@/@core/interfaces/handlers'
import type { IRankingsService, IUsersService } from '@/@core/interfaces/services'
import { RankingNotFoundError } from '@/@core/errors/rankings'

type Request = {
  userDTO: UserDTO
  rankingsDTO: RankingDTO[]
}

type Response = Promise<{
  rankingWinners: RankingWinnerDTO[]
  user: UserDTO
}>

export class ObserveRankingWinnersUseCase implements IUseCase<Request, Response> {
  constructor(
    private usersService: IUsersService,
    private rankingsService: IRankingsService
  ) {}

  async do({ userDTO, rankingsDTO }: Request): Response {
    const user = User.create(userDTO)
    const rankings = rankingsDTO.map(Ranking.create)

    if (!user.didSeeRankingResult.false)
      return {
        user: user.dto,
        rankingWinners: [],
      }

    const lastWeekRankingPositionValue = this.getLastRankingPositionValue(user)

    const lastWeekRanking = rankings.find(
      (ranking) => ranking.position.value === lastWeekRankingPositionValue
    )

    if (!lastWeekRanking) {
      throw new RankingNotFoundError()
    }

    const rankingWinnersresponse = await this.rankingsService.fetchRankingWinners(
      lastWeekRanking.id
    )

    if (rankingWinnersresponse.isFailure) {
      rankingWinnersresponse.throwError()
    }

    const rankingWinners = this.orderRankingWinnersByPosition(rankingWinnersresponse.data)

    user.seeRankingResult()

    const userResponse = await this.usersService.updateUser(user)

    if (userResponse.isFailure) {
      userResponse.throwError()
    }

    return {
      rankingWinners,
      user: user.dto,
    }
  }

  private getLastRankingPositionValue(user: User) {
    const lastRankingPosition = RANKING.tiersCount

    if (user.isRankingWinner && user.ranking.position.value !== lastRankingPosition) {
      return user.ranking.position.value - 1
    }

    if (user.isRankingLoser.true) {
      return user.ranking.position.value + 1
    }

    return user.ranking.position.value
  }

  private orderRankingWinnersByPosition(rankingWinners: RankingWinnerDTO[]) {
    rankingWinners.sort((a: RankingWinnerDTO, b: RankingWinnerDTO) => {
      if (a.position === 2) {
        return -1
      }
      if (a.position === 1) {
        return b.position === 2 ? 1 : -1
      }
      if (a.position === 3) {
        return b.position === 2 || b.position === 1 ? 1 : -1
      }

      return 1
    })

    return rankingWinners
  }
}
