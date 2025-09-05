import { mock, type Mock } from 'ts-jest-mocker'
import { UpdateRankingsUseCase } from '../UpdateRankingsUseCase'
import type { TiersRepository } from '#ranking/interfaces/TiersRepository'
import type { RankersRepository } from '#ranking/interfaces/RankersRepository'
import type { EventBroker } from '#global/interfaces/EventBroker'
import { TiersFaker } from '#ranking/domain/entities/fakers/TiersFaker'
import { RankersFaker } from '#ranking/domain/entities/fakers/RankersFaker'
import { RankingUpdatedEvent } from '#ranking/domain/events/RankingUpdatedEvent'
import { Ranking } from '#ranking/domain/structures/Ranking'
import { RankingLosersDefinedEvent } from '#ranking/domain/events/RankingLosersDefinedEvent'
import { RankingWinnersDefinedEvent } from '#ranking/domain/events/RankingWinnersDefinedEvent'

describe('Update Rankings Use Case', () => {
  let tiersRepository: Mock<TiersRepository>
  let rankersRepository: Mock<RankersRepository>
  let eventBroker: Mock<EventBroker>
  let useCase: UpdateRankingsUseCase

  beforeEach(() => {
    tiersRepository = mock<TiersRepository>()
    rankersRepository = mock<RankersRepository>()
    eventBroker = mock<EventBroker>()
    tiersRepository.findAll.mockImplementation()
    rankersRepository.removeAll.mockImplementation()
    rankersRepository.findAllByTier.mockImplementation()
    rankersRepository.addLosers.mockImplementation()
    rankersRepository.addWinners.mockImplementation()
    eventBroker.publish.mockImplementation()

    useCase = new UpdateRankingsUseCase(tiersRepository, rankersRepository, eventBroker)
  })

  it('should remove all current rankers', async () => {
    tiersRepository.findAll.mockResolvedValue(TiersFaker.fakeMany(6))
    rankersRepository.findAllByTier.mockResolvedValue(RankersFaker.fakeMany(6))
    await useCase.execute()

    expect(rankersRepository.removeAll).toHaveBeenCalled()
  })

  it('should publish a ranking updated event for each tier', async () => {
    const tiers = TiersFaker.fakeMany(6)
    tiersRepository.findAll.mockResolvedValue(tiers)
    rankersRepository.findAllByTier.mockResolvedValue(RankersFaker.fakeMany(6))
    await useCase.execute()

    tiers.forEach((tier) => {
      expect(eventBroker.publish).toHaveBeenCalledWith(
        new RankingUpdatedEvent({ tierId: tier.id.value }),
      )
    })
  })

  it('should add losers to the repository for each tier', async () => {
    const tiers = TiersFaker.fakeMany(6)
    const ranking = Ranking.create(RankersFaker.fakeManyDto(10))
    tiersRepository.findAll.mockResolvedValue(tiers)
    rankersRepository.findAllByTier.mockResolvedValue(ranking.users)
    await useCase.execute()

    expect(rankersRepository.addLosers).toHaveBeenCalledTimes(tiers.length)
    tiers.forEach((tier) => {
      expect(rankersRepository.addLosers).toHaveBeenCalledWith(ranking.losers, tier.id)
    })
  })

  it('should publish a ranking losers defined event for each tier except the last one', async () => {
    const tiers = TiersFaker.fakeMany(6)
    const ranking = Ranking.create(RankersFaker.fakeManyDto(10))
    tiersRepository.findAll.mockResolvedValue(tiers)
    rankersRepository.findAllByTier.mockResolvedValue(ranking.users)

    await useCase.execute()

    tiers.slice(0, tiers.length - 1).forEach((tier) => {
      expect(eventBroker.publish).toHaveBeenCalledWith(
        new RankingLosersDefinedEvent({
          tierId: tier.id.value,
          losersIds: ranking.losers.map((loser) => loser.id.value),
        }),
      )
    })
  })

  it('should publish a ranking winners defined event for each tier except the first one', async () => {
    const tiers = TiersFaker.fakeMany(6)
    const ranking = Ranking.create(RankersFaker.fakeManyDto(10))
    tiersRepository.findAll.mockResolvedValue(tiers)
    rankersRepository.findAllByTier.mockResolvedValue(ranking.users)

    await useCase.execute()

    tiers.slice(1, tiers.length).forEach((tier) => {
      expect(eventBroker.publish).toHaveBeenCalledWith(
        new RankingWinnersDefinedEvent({
          tierId: tier.id.value,
          winnersIds: ranking.winners.map((winner) => winner.id.value),
        }),
      )
    })
  })

  it('should add losers to the repository for each tier', async () => {
    const tiers = TiersFaker.fakeMany(6)
    const ranking = Ranking.create(RankersFaker.fakeManyDto(10))
    tiersRepository.findAll.mockResolvedValue(tiers)
    rankersRepository.findAllByTier.mockResolvedValue(ranking.users)
    await useCase.execute()

    expect(rankersRepository.addLosers).toHaveBeenCalledTimes(tiers.length)
    tiers.forEach((tier) => {
      expect(rankersRepository.addLosers).toHaveBeenCalledWith(ranking.losers, tier.id)
    })
  })
})
