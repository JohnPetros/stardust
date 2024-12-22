import { RankingsServiceMock } from '@/@core/__tests__/mocks/services'
import { GetLastWeekRankingWinnersUseCase } from '../GetLastWeekRankingWinnersUseCase'
import { TiersFaker, UsersFaker } from '@/@core/domain/entities/tests/fakers'
import { RankingUsersFaker } from '@/@core/domain/entities/tests/fakers/RankingUserFaker'
import type { UserDto } from '@stardust/core/global/dtos'

let rankingsServiceMock: RankingsServiceMock
let useCase: GetLastWeekRankingWinnersUseCase
let fakeUserDto: UserDto

function fakeRankingUsersFixture(tierId: string, count?: number) {
  return RankingUsersFaker.fakeManyDto(count, { tierId })
}

describe('Get Last Week Ranking Winners Use Case', () => {
  beforeEach(() => {
    rankingsServiceMock = new RankingsServiceMock()
    fakeUserDto = UsersFaker.fakeDto()
    useCase = new GetLastWeekRankingWinnersUseCase(rankingsServiceMock)
  })

  it('should return the last week tier of user if any', async () => {
    const fakeLastWeekTier = rankingsServiceMock.tiers[0]
    const fakeRankingUser = RankingUsersFaker.fakeDto({
      tierId: fakeLastWeekTier.id,
    })

    fakeUserDto = UsersFaker.fakeDto({ id: fakeRankingUser.id, tier: fakeLastWeekTier })

    rankingsServiceMock.users.push(fakeRankingUser)

    const { lastWeekTier } = await useCase.do(fakeUserDto)

    expect(lastWeekTier).toEqual(fakeLastWeekTier)
  })

  it("should set the last week tier of user to the user's current tier if no tier is found on search the the last week", async () => {
    const fakeCurrentTier = TiersFaker.fakeDto()

    fakeUserDto = UsersFaker.fakeDto({ tier: fakeCurrentTier })

    const fakeRankingUsers = RankingUsersFaker.fakeManyDto(10, {
      tierId: fakeCurrentTier.id,
    })
    rankingsServiceMock.users = fakeRankingUsers

    const { lastWeekTier } = await useCase.do(fakeUserDto)

    expect(lastWeekTier).toEqual(fakeCurrentTier)
  })

  it('should return the last week ranking winners ordered as podium', async () => {
    const fakeLastWeekTier = rankingsServiceMock.tiers[0]
    const fakeRankingWinners = fakeRankingUsersFixture(fakeLastWeekTier.id)

    const firstFakeWinner = RankingUsersFaker.fakeDto({
      xp: 3000,
      tierId: fakeLastWeekTier.id,
    })
    const secondFakeWinner = RankingUsersFaker.fakeDto({
      xp: 2000,
      tierId: fakeLastWeekTier.id,
    })
    const thirdFakeWinner = RankingUsersFaker.fakeDto({
      xp: 1000,
      tierId: fakeLastWeekTier.id,
    })

    fakeUserDto = UsersFaker.fakeDto({
      tier: fakeLastWeekTier,
    })

    rankingsServiceMock.winners = [
      ...fakeRankingWinners,
      firstFakeWinner,
      secondFakeWinner,
      thirdFakeWinner,
    ]

    const { lastWeekRankingWinners } = await useCase.do(fakeUserDto)

    expect(lastWeekRankingWinners[0]).toEqual(secondFakeWinner)
    expect(lastWeekRankingWinners[1]).toEqual(firstFakeWinner)
    expect(lastWeekRankingWinners[2]).toEqual(thirdFakeWinner)
  })

  it("should return user's loser state", async () => {
    rankingsServiceMock.losers = [RankingUsersFaker.fakeDto({ id: fakeUserDto.id })]

    const response1 = await useCase.do(fakeUserDto)

    expect(response1.isUserLoser).toBe(true)

    rankingsServiceMock.losers = []

    const response2 = await useCase.do(fakeUserDto)

    expect(response2.isUserLoser).toBe(false)
  })
})
