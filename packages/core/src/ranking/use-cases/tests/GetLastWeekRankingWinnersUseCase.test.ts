import { type Mock, mock } from 'ts-jest-mocker'

import type { RankersRepository, TiersRepository } from '../../interfaces'
import { GetLastWeekRankingWinnersUseCase } from '../GetLastWeekRankingWinnersUseCase'
import { TierNotFoundError } from '#ranking/domain/errors/TierNotFoundError'
import { TiersFaker } from '#ranking/domain/entities/fakers/TiersFaker'
import { RankersFaker } from '#ranking/domain/entities/fakers/RankersFaker'
import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'

describe('Get Last Week Ranking Winners Use Case', () => {
  let tiersRepository: Mock<TiersRepository>
  let rankersRepository: Mock<RankersRepository>
  let useCase: GetLastWeekRankingWinnersUseCase

  beforeEach(() => {
    tiersRepository = mock<TiersRepository>()
    rankersRepository = mock<RankersRepository>()
    tiersRepository.findByPosition.mockImplementation()
    rankersRepository.findAllByTier.mockImplementation()
    useCase = new GetLastWeekRankingWinnersUseCase(tiersRepository, rankersRepository)
  })

  it('should throw an error if tier is not found', () => {
    const lastWeekTierPosition = 1
    const currentWeekTierPosition = 2
    tiersRepository.findById.mockResolvedValue(null)

    expect(
      useCase.execute({
        lastWeekTierPosition,
        currentWeekTierPosition,
      }),
    ).rejects.toThrow(TierNotFoundError)
  })

  it('should return the last week ranking winners', async () => {
    const lastWeekTier = TiersFaker.fake()
    const rankers = RankersFaker.fakeMany()
    const currentWeekTierPosition = 2
    tiersRepository.findByPosition.mockResolvedValue(lastWeekTier)
    rankersRepository.findAllByTier.mockResolvedValue(rankers)

    const response = await useCase.execute({
      lastWeekTierPosition: lastWeekTier.position.value,
      currentWeekTierPosition,
    })

    expect(tiersRepository.findByPosition).toHaveBeenCalledWith(
      OrdinalNumber.create(lastWeekTier.position.value),
    )
    expect(rankersRepository.findAllByTier).toHaveBeenCalledWith(lastWeekTier.id)
    expect(response.lastWeekTier).toEqual(lastWeekTier.dto)
    expect(response.lastWeekRankingWinners).toEqual(rankers.map((ranker) => ranker.dto))
  })

  it('should return the user as non loser if the current week tier position is less than the last week tier position', async () => {
    const lastWeekTier = TiersFaker.fake({ position: 1 })
    tiersRepository.findByPosition.mockResolvedValue(lastWeekTier)
    rankersRepository.findAllByTier.mockResolvedValue(RankersFaker.fakeMany())

    const response = await useCase.execute({
      lastWeekTierPosition: lastWeekTier.position.value,
      currentWeekTierPosition: 2,
    })

    expect(response.isUserLoser).toBeFalsy()
  })

  it('should return the user as non loser if the current week tier position is equal to the last week tier position', async () => {
    const lastWeekTier = TiersFaker.fake({ position: 1 })
    tiersRepository.findByPosition.mockResolvedValue(lastWeekTier)
    rankersRepository.findAllByTier.mockResolvedValue(RankersFaker.fakeMany())

    const response = await useCase.execute({
      lastWeekTierPosition: lastWeekTier.position.value,
      currentWeekTierPosition: 1,
    })

    expect(response.isUserLoser).toBeFalsy()
  })

  it('should return the user as loser if the current week tier position is greater than the last week tier position', async () => {
    const lastWeekTier = TiersFaker.fake({ position: 2 })
    tiersRepository.findByPosition.mockResolvedValue(lastWeekTier)
    rankersRepository.findAllByTier.mockResolvedValue(RankersFaker.fakeMany())

    const response = await useCase.execute({
      lastWeekTierPosition: lastWeekTier.position.value,
      currentWeekTierPosition: 1,
    })

    expect(response.isUserLoser).toBeTruthy()
  })
})
