import { RankingFaker } from '#fakers/structs'
import { RankingServiceMock } from '#mocks/services'
import type { Ranking } from '../../domain/structs'
import { UpdateRankingsUseCase } from '../UpdateRankingsUseCase'

let rankingServiceMock: RankingServiceMock
let useCase: UpdateRankingsUseCase

describe('Update Rankings Use Case', () => {
  beforeEach(() => {
    rankingServiceMock = new RankingServiceMock()
    useCase = new UpdateRankingsUseCase(rankingServiceMock)
  })

  it('should reset all rankings state', async () => {
    expect(rankingServiceMock.isReset).toBeFalsy()

    await useCase.do()

    expect(rankingServiceMock.isReset).toBeTruthy()
  })

  it('should put each loser in the previous ranking if any', async () => {
    const rankings: Array<{ data: Ranking; tierId: string }> = []

    for (const tier of rankingServiceMock.tiers) {
      const rankingData = RankingFaker.fake()

      rankings.push({ data: rankingData, tierId: tier.id })
      rankingServiceMock.users.push(...rankingData.users.map((user) => ({ ...user.dto })))
    }

    await useCase.do()

    for (let index = 0; index < rankings.length; index++) {
      const currentRanking = rankings[index]
      const nextRanking = rankings[index + 1]

      if (!currentRanking || !nextRanking) continue

      const losers = await rankingServiceMock.fetchRankingLosersByTier(
        currentRanking.tierId,
      )
      expect(losers.body).toEqual(
        nextRanking.data.losers.map((loser) => ({
          ...loser.dto,
          tierId: currentRanking.tierId,
        })),
      )
    }
  })

  it('should put each winner in the next ranking', async () => {
    const rankings: Array<{ data: Ranking; tierId: string }> = []

    for (const tier of rankingServiceMock.tiers) {
      const rankingData = RankingFaker.fake()

      rankings.push({ data: rankingData, tierId: tier.id })
      rankingServiceMock.users.push(...rankingData.users.map((user) => ({ ...user.dto })))
    }

    await useCase.do()

    for (let index = 1; index < rankings.length; index++) {
      const currentRanking = rankings[index]
      const previousRanking = rankings[index - 1]

      if (!currentRanking || !previousRanking) continue

      const winners = await rankingServiceMock.fetchRankingWinnersByTier(
        currentRanking.tierId,
      )
      expect(winners.body).toEqual(
        previousRanking.data.winners.map((winner) => ({
          ...winner.dto,
          tierId: currentRanking.tierId,
        })),
      )
    }
  })

  it('should allow users to see their ranking result', async () => {
    expect(rankingServiceMock.canUsersSeeRankingResult).toBeFalsy()

    await useCase.do()

    expect(rankingServiceMock.canUsersSeeRankingResult).toBeTruthy()
  })

  it('should update last week ranking positions', async () => {
    expect(rankingServiceMock.areLastWeekRankingPositionsUpdated).toBeFalsy()

    await useCase.do()

    expect(rankingServiceMock.areLastWeekRankingPositionsUpdated).toBeTruthy()
  })
})
