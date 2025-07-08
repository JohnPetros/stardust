import { type Mock, mock } from 'ts-jest-mocker'

import type { RankersRepository, TiersRepository } from '../../interfaces'
import { GetLastWeekRankingWinnersUseCase } from '../GetLastWeekRankingWinnersUseCase'
import { TierNotFoundError } from '#ranking/domain/errors/TierNotFoundError'
import { TiersFaker } from '#ranking/domain/entities/fakers/TiersFaker'
import { RankersFaker } from '#ranking/domain/entities/fakers/RankersFaker'
import { Id } from '#global/domain/structures/Id'

describe('Get Last Week Ranking Winners Use Case', () => {
  let tiersRepository: Mock<TiersRepository>
  let rankersRepository: Mock<RankersRepository>
  let useCase: GetLastWeekRankingWinnersUseCase

  beforeEach(() => {
    tiersRepository = mock<TiersRepository>()
    rankersRepository = mock<RankersRepository>()
    tiersRepository.findById.mockImplementation()
    tiersRepository.findByPosition.mockImplementation()
    rankersRepository.findAllByTier.mockImplementation()
    useCase = new GetLastWeekRankingWinnersUseCase(tiersRepository, rankersRepository)
  })

  it('should throw an error if tier is not found', () => {
    tiersRepository.findById.mockResolvedValue(null)

    expect(
      useCase.execute({
        currentWeekTierId: Id.create().value,
      }),
    ).rejects.toThrow(TierNotFoundError)
  })

  it('should return the last week ranking winners', async () => {
    const currentWeekTier = TiersFaker.fake({ position: 2 })
    const lastWeekTier = TiersFaker.fake({ position: 1 })
    const rankers = RankersFaker.fakeMany()
    tiersRepository.findById.mockResolvedValue(currentWeekTier)
    tiersRepository.findByPosition.mockResolvedValue(lastWeekTier)
    rankersRepository.findAllByTier.mockResolvedValue(rankers)

    const response = await useCase.execute({
      currentWeekTierId: currentWeekTier.id.value,
    })

    expect(tiersRepository.findByPosition).toHaveBeenCalledWith(lastWeekTier.position)
    expect(rankersRepository.findAllByTier).toHaveBeenCalledWith(lastWeekTier.id)
    expect(response.lastWeekTier).toEqual(lastWeekTier.dto)
    expect(response.lastWeekRankingWinners).toEqual(rankers.map((ranker) => ranker.dto))
  })

  it('should return the ranker as non loser if the current week tier position is less than the last week tier position', async () => {
    const currentWeekTier = TiersFaker.fake({ position: 2 })
    const lastWeekTier = TiersFaker.fake({ position: 1 })
    tiersRepository.findById.mockResolvedValue(currentWeekTier)
    tiersRepository.findByPosition.mockResolvedValue(lastWeekTier)
    rankersRepository.findAllByTier.mockResolvedValue(RankersFaker.fakeMany())

    const response = await useCase.execute({
      currentWeekTierId: currentWeekTier.id.value,
    })

    expect(response.isRankerLoser).toBeFalsy()
  })

  it('should return the ranker as non loser if the current week tier position is equal to the last week tier position', async () => {
    const currentWeekTier = TiersFaker.fake({ position: 1 })
    const lastWeekTier = TiersFaker.fake({ position: 1 })
    tiersRepository.findById.mockResolvedValue(currentWeekTier)
    tiersRepository.findByPosition.mockResolvedValue(lastWeekTier)
    rankersRepository.findAllByTier.mockResolvedValue(RankersFaker.fakeMany())

    const response = await useCase.execute({
      currentWeekTierId: currentWeekTier.id.value,
    })

    expect(response.isRankerLoser).toBeFalsy()
  })

  it('should return the ranker as loser if the current week tier position is less than the last week tier position', async () => {
    const currentWeekTier = TiersFaker.fake({ position: 1 })
    const lastWeekTier = TiersFaker.fake({ position: 2 })
    tiersRepository.findById.mockResolvedValue(currentWeekTier)
    tiersRepository.findByPosition.mockResolvedValue(lastWeekTier)
    rankersRepository.findAllByTier.mockResolvedValue(RankersFaker.fakeMany())

    const response = await useCase.execute({
      currentWeekTierId: currentWeekTier.id.value,
    })

    expect(response.isRankerLoser).toBeTruthy()
  })
})
