import { RankingsServiceMock } from '@/@core/__tests__/mocks/services'
import { UpdateRankingsUseCase } from '../UpdateRankingsUseCase'
import { RankingFaker } from '@/@core/domain/structs/tests/fakers'
import type { Ranking } from '@/@core/domain/structs'

let rankingsServiceMock: RankingsServiceMock
let useCase: UpdateRankingsUseCase

describe('Update Rankings Use Case', () => {
  beforeEach(() => {
    rankingsServiceMock = new RankingsServiceMock()
    useCase = new UpdateRankingsUseCase(rankingsServiceMock)
  })

  it('should reset all rankings state', async () => {
    expect(rankingsServiceMock.isReset).toBeFalsy()

    await useCase.do()

    expect(rankingsServiceMock.isReset).toBeTruthy()
  })

  it('should put each loser in the previous ranking', async () => {
    const rankings: Array<{ data: Ranking; tierId: string }> = []

    for (const tier of rankingsServiceMock.tiers) {
      const rankingData = RankingFaker.fake()

      rankings.push({ data: rankingData, tierId: tier.id })
      rankingsServiceMock.users.push(
        ...rankingData.users.map((user) => ({ ...user.dto, tierId: tier.id }))
      )
    }

    await useCase.do()

    for (let index = 1; index < rankings.length - 1; index++) {
      const currentRanking = rankings[index]
      const nextRanking = rankings[index + 1]

      const losers = await rankingsServiceMock.fetchRankingLosersByTier(
        currentRanking.tierId
      )
      expect(losers.data).toEqual(
        nextRanking.data.losers.map((loser) => ({
          ...loser.dto,
          tierId: currentRanking.tierId,
        }))
      )
    }
  })

  it('should put each winner in the next ranking', async () => {
    const rankings: Array<{ data: Ranking; tierId: string }> = []

    for (const tier of rankingsServiceMock.tiers) {
      const rankingData = RankingFaker.fake()

      rankings.push({ data: rankingData, tierId: tier.id })
      rankingsServiceMock.users.push(
        ...rankingData.users.map((user) => ({ ...user.dto, tierId: tier.id }))
      )
    }

    await useCase.do()

    for (let index = 1; index < rankings.length - 1; index++) {
      const currentRanking = rankings[index]
      const previousRanking = rankings[index - 1]

      const winners = await rankingsServiceMock.fetchRankingWinnersByTier(
        currentRanking.tierId
      )
      expect(winners.data).toEqual(
        previousRanking.data.winners.map((winner) => ({
          ...winner.dto,
          tierId: currentRanking.tierId,
        }))
      )
    }
  })

  it('should allow users to see their ranking result', async () => {
    expect(rankingsServiceMock.canUsersSeeRankingResult).toBeFalsy()

    await useCase.do()

    expect(rankingsServiceMock.canUsersSeeRankingResult).toBeTruthy()
  })

  it('should update last week ranking positions', async () => {
    expect(rankingsServiceMock.areLastWeekRankingPositionsUpdated).toBeFalsy()

    await useCase.do()

    expect(rankingsServiceMock.areLastWeekRankingPositionsUpdated).toBeTruthy()
  })
})
