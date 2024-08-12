import { RankingsServiceMock } from '@/@core/__tests__/mocks/services'
import { GetLastWeekRankingWinnersUseCase } from '../GetLastWeekRankingWinnersUseCase'
import { TiersFaker, UsersFaker } from '@/@core/domain/entities/tests/fakers'
import { RankingUsersFaker } from '@/@core/domain/entities/tests/fakers/RankingUserFaker'
import type { UserDTO } from '@/@core/dtos'

let rankingsServiceMock: RankingsServiceMock
let useCase: GetLastWeekRankingWinnersUseCase
let fakeUserDTO: UserDTO

function fakeRankingUsersFixture(tierId: string, count?: number) {
  return RankingUsersFaker.fakeManyDTO(count, { tierId })
}

describe('Get Last Week Ranking Winners Use Case', () => {
  beforeEach(() => {
    rankingsServiceMock = new RankingsServiceMock()
    fakeUserDTO = UsersFaker.fakeDTO()
    useCase = new GetLastWeekRankingWinnersUseCase(rankingsServiceMock)
  })

  it('should return the last week tier of user if any', async () => {
    const fakeLastWeekTier = rankingsServiceMock.tiers[0]
    const fakeRankingUser = RankingUsersFaker.fakeDTO({
      tierId: fakeLastWeekTier.id,
    })

    fakeUserDTO = UsersFaker.fakeDTO({ id: fakeRankingUser.id, tier: fakeLastWeekTier })

    rankingsServiceMock.users.push(fakeRankingUser)

    const { lastWeekTier } = await useCase.do(fakeUserDTO)

    expect(lastWeekTier).toEqual(fakeLastWeekTier)
  })

  it("should set the last week tier of user to the user's current tier if no tier is found on search the the last week", async () => {
    const fakeCurrentTier = TiersFaker.fakeDTO()

    fakeUserDTO = UsersFaker.fakeDTO({ tier: fakeCurrentTier })

    const fakeRankingUsers = RankingUsersFaker.fakeManyDTO(10, {
      tierId: fakeCurrentTier.id,
    })
    rankingsServiceMock.users = fakeRankingUsers

    const { lastWeekTier } = await useCase.do(fakeUserDTO)

    expect(lastWeekTier).toEqual(fakeCurrentTier)
  })

  it('should return the last week ranking winners ordered as podium', async () => {
    const fakeLastWeekTier = rankingsServiceMock.tiers[0]
    const fakeRankingWinners = fakeRankingUsersFixture(fakeLastWeekTier.id)

    const firstFakeWinner = RankingUsersFaker.fakeDTO({
      xp: 3000,
      tierId: fakeLastWeekTier.id,
    })
    const secondFakeWinner = RankingUsersFaker.fakeDTO({
      xp: 2000,
      tierId: fakeLastWeekTier.id,
    })
    const thirdFakeWinner = RankingUsersFaker.fakeDTO({
      xp: 1000,
      tierId: fakeLastWeekTier.id,
    })

    fakeUserDTO = UsersFaker.fakeDTO({
      tier: fakeLastWeekTier,
    })

    rankingsServiceMock.winners = [
      ...fakeRankingWinners,
      firstFakeWinner,
      secondFakeWinner,
      thirdFakeWinner,
    ]

    const { lastWeekRankingWinners } = await useCase.do(fakeUserDTO)

    expect(lastWeekRankingWinners[0]).toEqual(secondFakeWinner)
    expect(lastWeekRankingWinners[1]).toEqual(firstFakeWinner)
    expect(lastWeekRankingWinners[2]).toEqual(thirdFakeWinner)
  })

  it("should return user's loser state", async () => {
    rankingsServiceMock.losers = [RankingUsersFaker.fakeDTO({ id: fakeUserDTO.id })]

    const response1 = await useCase.do(fakeUserDTO)

    expect(response1.isUserLoser).toBe(true)

    rankingsServiceMock.losers = []

    const response2 = await useCase.do(fakeUserDTO)

    expect(response2.isUserLoser).toBe(false)
  })
})
