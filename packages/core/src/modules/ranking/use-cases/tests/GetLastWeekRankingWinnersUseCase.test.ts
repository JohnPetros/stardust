import { RankingUsersFaker, TiersFaker, UsersFaker } from '#fakers/entities'
import { RankingServiceMock } from '#mocks/services'
import { GetLastWeekRankingWinnersUseCase } from '../GetLastWeekRankingWinnersUseCase'
import type { RankingUser } from '#ranking/entities'
import type { UserDto } from '@stardust/core/global/dtos'

let rankingServiceMock: RankingServiceMock
let useCase: GetLastWeekRankingWinnersUseCase
let fakeUserDto: UserDto

function fakeRankingUsersFixture(tierId: string, count?: number) {
  return RankingUsersFaker.fakeManyDto(count, { tierId })
}

describe('Get Last Week Ranking Winners Use Case', () => {
  beforeEach(() => {
    rankingServiceMock = new RankingServiceMock()
    fakeUserDto = UsersFaker.fakeDto()
    useCase = new GetLastWeekRankingWinnersUseCase(rankingServiceMock)
  })

  it('should return the last week tier of user if any', async () => {
    const fakeLastWeekTier = rankingServiceMock.tiers[0]
    const fakeRankingUser = RankingUsersFaker.fakeDto({
      tierId: fakeLastWeekTier?.id,
    })

    fakeUserDto = UsersFaker.fakeDto({ id: fakeRankingUser.id, tier: fakeLastWeekTier })

    rankingServiceMock.users.push(fakeRankingUser)

    const { lastWeekTier } = await useCase.do(fakeUserDto)

    expect(lastWeekTier).toEqual(fakeLastWeekTier)
  })

  it("should set the last week tier of user to the user's current tier if no tier is found on search the the last week", async () => {
    const fakeCurrentTier = TiersFaker.fakeDto()

    fakeUserDto = UsersFaker.fakeDto({ tier: fakeCurrentTier })

    const fakeRankingUsers = RankingUsersFaker.fakeManyDto(10, {
      tierId: fakeCurrentTier.id,
    })
    rankingServiceMock.users = fakeRankingUsers

    const { lastWeekTier } = await useCase.do(fakeUserDto)

    expect(lastWeekTier).toEqual(fakeCurrentTier)
  })

  it('should return the last week ranking winners ordered as podium', async () => {
    const fakeLastWeekTier = rankingServiceMock.tiers[0]
    let fakeRankingWinners: RankingUser[] = []

    if (fakeLastWeekTier)
      fakeRankingWinners = fakeRankingUsersFixture(fakeLastWeekTier?.id)

    const firstFakeWinner = RankingUsersFaker.fakeDto({
      xp: 3000,
      tierId: fakeLastWeekTier?.id,
    })
    const secondFakeWinner = RankingUsersFaker.fakeDto({
      xp: 2000,
      tierId: fakeLastWeekTier?.id,
    })
    const thirdFakeWinner = RankingUsersFaker.fakeDto({
      xp: 1000,
      tierId: fakeLastWeekTier?.id,
    })

    fakeUserDto = UsersFaker.fakeDto({
      tier: fakeLastWeekTier,
    })

    rankingServiceMock.winners = [
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
    rankingServiceMock.losers = [RankingUsersFaker.fakeDto({ id: fakeUserDto.id })]

    const response1 = await useCase.do(fakeUserDto)

    expect(response1.isUserLoser).toBe(true)

    rankingServiceMock.losers = []

    const response2 = await useCase.do(fakeUserDto)

    expect(response2.isUserLoser).toBe(false)
  })
})
