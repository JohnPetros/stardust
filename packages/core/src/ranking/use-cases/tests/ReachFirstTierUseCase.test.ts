import type { EventBroker } from '#global/interfaces/EventBroker'
import type { TiersRepository } from '#ranking/interfaces/TiersRepository'
import { type Mock, mock } from 'ts-jest-mocker'
import { ReachFirstTierUseCase } from '../ReachFirstTierUseCase'
import { UsersFaker } from '#profile/domain/entities/fakers/UsersFaker'
import { TiersFaker } from '#ranking/domain/entities/fakers/TiersFaker'
import { TierNotFoundError } from '#ranking/domain/errors/TierNotFoundError'
import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import { FirstTierReachedEvent } from '#ranking/domain/events/FirstTierReachedEvent'
import { Id } from '#global/domain/structures/Id'

describe('Reach First Tier Use Case', () => {
  let tiersRepository: Mock<TiersRepository>
  let eventBroker: Mock<EventBroker>
  let useCase: ReachFirstTierUseCase

  beforeEach(() => {
    tiersRepository = mock<TiersRepository>()
    eventBroker = mock<EventBroker>()
    tiersRepository.findByPosition.mockImplementation()
    eventBroker.publish.mockImplementation()
    useCase = new ReachFirstTierUseCase(tiersRepository, eventBroker)
  })

  it('should throw if tier is not found', () => {
    const user = UsersFaker.fake()
    tiersRepository.findByPosition.mockResolvedValue(null)

    expect(
      useCase.execute({
        user: { id: user.id.value, name: user.name.value, email: user.email.value },
        firstStarId: Id.create().value,
      }),
    ).rejects.toThrow(TierNotFoundError)
  })

  it('should find the tier with position 1', async () => {
    const user = UsersFaker.fake()
    const firstTier = TiersFaker.fake()
    tiersRepository.findByPosition.mockResolvedValue(firstTier)

    await useCase.execute({
      user: { id: user.id.value, name: user.name.value, email: user.email.value },
      firstStarId: Id.create().value,
    })

    expect(tiersRepository.findByPosition).toHaveBeenCalledWith(OrdinalNumber.create(1))
  })

  it('should publish the first tier reached event', async () => {
    const user = UsersFaker.fake()
    const firstTier = TiersFaker.fake()
    const firstStarId = Id.create()
    tiersRepository.findByPosition.mockResolvedValue(firstTier)

    await useCase.execute({
      user: { id: user.id.value, name: user.name.value, email: user.email.value },
      firstStarId: firstStarId.value,
    })

    expect(eventBroker.publish).toHaveBeenCalledWith(
      new FirstTierReachedEvent({
        user: { id: user.id.value, name: user.name.value, email: user.email.value },
        firstStarId: firstStarId.value,
        firstTierId: firstTier.id.value,
      }),
    )
  })
})
