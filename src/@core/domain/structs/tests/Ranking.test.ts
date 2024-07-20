import { RankingUsersFaker } from '../../entities/tests/fakers/RankingUserFaker'
import { Ranking } from '../Ranking'

describe('Ranking Struct', () => {
  it('should be created with users ordered by xp in a descending order', () => {
    const fakeUsersDTO = [
      RankingUsersFaker.fakeDTO({ xp: 1 }),
      RankingUsersFaker.fakeDTO({ xp: 3 }),
      RankingUsersFaker.fakeDTO({ xp: 5 }),
      RankingUsersFaker.fakeDTO({ xp: 4 }),
      RankingUsersFaker.fakeDTO({ xp: 2 }),
    ]

    const ranking = Ranking.create(fakeUsersDTO)
    const rankingUsers = ranking.users

    expect(rankingUsers[0].dto).toEqual(fakeUsersDTO[2])
    expect(rankingUsers[1].dto).toEqual(fakeUsersDTO[3])
    expect(rankingUsers[2].dto).toEqual(fakeUsersDTO[1])
    expect(rankingUsers[3].dto).toEqual(fakeUsersDTO[4])
    expect(rankingUsers[4].dto).toEqual(fakeUsersDTO[0])
  })

  it('should get the winners, that is, the users with the most xp', () => {
    const fakeWinnersDTO = [
      RankingUsersFaker.fakeDTO({ xp: 5000 }),
      RankingUsersFaker.fakeDTO({ xp: 4000 }),
      RankingUsersFaker.fakeDTO({ xp: 3000 }),
      RankingUsersFaker.fakeDTO({ xp: 2000 }),
      RankingUsersFaker.fakeDTO({ xp: 1000 }),
    ]

    const fakeUsersDTO = [...RankingUsersFaker.fakeManyDTO(), ...fakeWinnersDTO]

    const ranking = Ranking.create(fakeUsersDTO)
    const rankingWinners = ranking.winners

    expect(rankingWinners).toHaveLength(Ranking.WINNERS_COUNT)
    expect(rankingWinners.map((winner) => winner.dto)).toEqual(fakeWinnersDTO)
  })

  it('should get the losers, that is, the users with the less xp', () => {
    const fakeLosersDTO = [
      RankingUsersFaker.fakeDTO({ xp: 5 }),
      RankingUsersFaker.fakeDTO({ xp: 4 }),
      RankingUsersFaker.fakeDTO({ xp: 3 }),
      RankingUsersFaker.fakeDTO({ xp: 2 }),
      RankingUsersFaker.fakeDTO({ xp: 1 }),
    ]

    const fakeUsersDTO = [
      ...RankingUsersFaker.fakeManyDTO(20, { xp: 100 }),
      ...fakeLosersDTO,
    ]

    const ranking = Ranking.create(fakeUsersDTO)
    const rankingLosers = ranking.losers

    expect(rankingLosers).toHaveLength(Ranking.LOSERS_COUNT)
    expect(rankingLosers.map((winner) => winner.dto)).toEqual(fakeLosersDTO)
  })
})
