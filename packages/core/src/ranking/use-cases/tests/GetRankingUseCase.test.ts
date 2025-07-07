import { type Mock, mock } from 'ts-jest-mocker'

import { Id } from '#global/domain/structures/Id'
import { TierNotFoundError } from '#ranking/domain/errors/TierNotFoundError'
import { TiersFaker } from '#ranking/domain/entities/fakers/TiersFaker'
import { RankersFaker } from '#ranking/domain/entities/fakers/RankersFaker'
import { GetRankingUseCase } from '../GetRankingUseCase'
import type { TiersRepository, RankersRepository } from '../../interfaces'

describe('Get Ranking Use Case', () => {
  let tiersRepository: Mock<TiersRepository>
  let rankersRepository: Mock<RankersRepository>
  let useCase: GetRankingUseCase

  beforeEach(() => {
    tiersRepository = mock<TiersRepository>()
    rankersRepository = mock<RankersRepository>()
    tiersRepository.findById.mockImplementation()
    rankersRepository.findAllByTierOrderedByXp.mockImplementation()
    useCase = new GetRankingUseCase(tiersRepository, rankersRepository)
  })

  it('should throw if tier is not found', () => {
    const tierId = Id.create()
    tiersRepository.findById.mockResolvedValue(null)

    expect(useCase.execute({ tierId: tierId.value })).rejects.toThrow(TierNotFoundError)
  })

  it('should return the rankers of the tier', async () => {
    const tier = TiersFaker.fake()
    const rankers = RankersFaker.fakeMany(5)
    tiersRepository.findById.mockResolvedValue(tier)
    rankersRepository.findAllByTierOrderedByXp.mockResolvedValue(rankers)

    const response = await useCase.execute({ tierId: tier.id.value })

    expect(rankersRepository.findAllByTierOrderedByXp).toHaveBeenCalledWith(tier.id)
    expect(response).toEqual({
      rankers: rankers.map((ranker) => ranker.dto),
    })
  })
})
