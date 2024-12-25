import { RankingUsersFaker } from '#fakers/entities'
import { Ranking } from '../Ranking'

describe('Ranking Struct', () => {
  it('should be created with users ordered by xp in a descending order', () => {
    const fakeUsersDto = [
      RankingUsersFaker.fakeDto({ xp: 1 }),
      RankingUsersFaker.fakeDto({ xp: 3 }),
      RankingUsersFaker.fakeDto({ xp: 5 }),
      RankingUsersFaker.fakeDto({ xp: 4 }),
      RankingUsersFaker.fakeDto({ xp: 2 }),
    ]

    const ranking = Ranking.create(fakeUsersDto)
    const rankingUsers = ranking.users

    expect(rankingUsers[0]?.dto).toEqual(fakeUsersDto[2])
    expect(rankingUsers[1]?.dto).toEqual(fakeUsersDto[3])
    expect(rankingUsers[2]?.dto).toEqual(fakeUsersDto[1])
    expect(rankingUsers[3]?.dto).toEqual(fakeUsersDto[4])
    expect(rankingUsers[4]?.dto).toEqual(fakeUsersDto[0])
  })

  it('should get the winners, that is, the users with the most xp', () => {
    const fakeWinnersDto = [
      RankingUsersFaker.fakeDto({ xp: 5000 }),
      RankingUsersFaker.fakeDto({ xp: 4000 }),
      RankingUsersFaker.fakeDto({ xp: 3000 }),
      RankingUsersFaker.fakeDto({ xp: 2000 }),
      RankingUsersFaker.fakeDto({ xp: 1000 }),
    ]

    const fakeUsersDto = [...RankingUsersFaker.fakeManyDto(), ...fakeWinnersDto]

    const ranking = Ranking.create(fakeUsersDto)
    const rankingWinners = ranking.winners

    expect(rankingWinners).toHaveLength(Ranking.WINNERS_COUNT)
    expect(rankingWinners.map((winner) => winner.dto)).toEqual(fakeWinnersDto)
  })

  it('should get the losers, that is, the users with the less xp', () => {
    const fakeLosersDto = [
      RankingUsersFaker.fakeDto({ xp: 5 }),
      RankingUsersFaker.fakeDto({ xp: 4 }),
      RankingUsersFaker.fakeDto({ xp: 3 }),
      RankingUsersFaker.fakeDto({ xp: 2 }),
      RankingUsersFaker.fakeDto({ xp: 1 }),
    ]

    const fakeUsersDto = [
      ...RankingUsersFaker.fakeManyDto(20, { xp: 100 }),
      ...fakeLosersDto,
    ]

    const ranking = Ranking.create(fakeUsersDto)
    const rankingLosers = ranking.losers

    expect(rankingLosers).toHaveLength(Ranking.LOSERS_COUNT)
    expect(rankingLosers.map((winner) => winner.dto)).toEqual(fakeLosersDto)
  })
})
