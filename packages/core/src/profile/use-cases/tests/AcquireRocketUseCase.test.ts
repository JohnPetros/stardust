import { mock, type Mock } from 'ts-jest-mocker'

import { Integer } from '#global/domain/structures/Integer'
import type { Broker } from '#global/interfaces/Broker'
import { UsersFaker } from '#profile/domain/entities/fakers/UsersFaker'
import { RocketAggregatesFaker } from '#profile/domain/aggregates/fakers/RocketAggregatesFaker'
import { UserNotFoundError } from '#profile/domain/errors/UserNotFoundError'
import { ShopItemPurchasedEvent } from '#profile/domain/events/ShopItemPurchasedEvent'
import { AcquireRocketUseCase } from '../AcquireRocketUseCase'
import type { UsersRepository } from '../../interfaces'

describe('Acquire Rocket Use Case', () => {
  let broker: Mock<Broker>
  let repository: Mock<UsersRepository>
  let useCase: AcquireRocketUseCase

  beforeEach(() => {
    broker = mock<Broker>()
    broker.publish.mockImplementation()
    repository = mock<UsersRepository>()
    repository.findById.mockImplementation()
    repository.replace.mockImplementation()
    repository.addAcquiredRocket.mockImplementation()
    useCase = new AcquireRocketUseCase(repository, broker)
  })

  it('should throw an error if the user is not found', async () => {
    const user = UsersFaker.fake()
    const rocket = RocketAggregatesFaker.fake()
    repository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({
        userId: user.id.value,
        rocketId: rocket.id.value,
        rocketName: rocket.name.value,
        rocketImage: rocket.image.value,
        rocketPrice: 0,
      }),
    ).rejects.toThrow(UserNotFoundError)

    expect(repository.addAcquiredRocket).not.toHaveBeenCalled()
    expect(broker.publish).not.toHaveBeenCalled()
  })

  it('should add the acquire rocket to the repository only if the user can acquire the rocket and not has acquired it yet', async () => {
    const rocket = RocketAggregatesFaker.fake()
    let user = UsersFaker.fake({ coins: 100, acquiredRocketsIds: [rocket.id.value] })
    user.acquireRocket = jest.fn()
    repository.findById.mockResolvedValue(user)

    await useCase.execute({
      userId: user.id.value,
      rocketId: rocket.id.value,
      rocketName: rocket.name.value,
      rocketImage: rocket.image.value,
      rocketPrice: 101,
    })

    expect(repository.addAcquiredRocket).toHaveBeenCalledTimes(0)
    expect(broker.publish).not.toHaveBeenCalled()

    user = UsersFaker.fake({ coins: 100, acquiredRocketsIds: [rocket.id.value] })
    repository.findById.mockResolvedValue(user)

    await useCase.execute({
      userId: user.id.value,
      rocketId: rocket.id.value,
      rocketName: rocket.name.value,
      rocketImage: rocket.image.value,
      rocketPrice: 0,
    })

    expect(repository.addAcquiredRocket).toHaveBeenCalledTimes(0)
    expect(broker.publish).not.toHaveBeenCalled()

    user = UsersFaker.fake({ coins: 100, acquiredRocketsIds: [] })
    repository.findById.mockResolvedValue(user)

    await useCase.execute({
      userId: user.id.value,
      rocketId: rocket.id.value,
      rocketName: rocket.name.value,
      rocketImage: rocket.image.value,
      rocketPrice: 0,
    })

    expect(repository.addAcquiredRocket).toHaveBeenCalledTimes(1)
    expect(repository.addAcquiredRocket).toHaveBeenCalledWith(rocket.id, user.id)
    expect(broker.publish).toHaveBeenCalledWith(
      expect.objectContaining<ShopItemPurchasedEvent>({
        name: ShopItemPurchasedEvent._NAME,
        payload: {
          userId: user.id.value,
          itemId: rocket.id.value,
          itemType: 'rocket',
          itemName: rocket.name.value,
          itemPrice: 0,
        },
      }),
    )
  })

  it('should try to acquire the rocket', async () => {
    const rocket = RocketAggregatesFaker.fake()
    const user = UsersFaker.fake()
    user.acquireRocket = jest.fn()
    const rocketPrice = Integer.create(100)
    repository.findById.mockResolvedValue(user)

    await useCase.execute({
      userId: user.id.value,
      rocketId: rocket.id.value,
      rocketName: rocket.name.value,
      rocketImage: rocket.image.value,
      rocketPrice: rocketPrice.value,
    })

    expect(user.acquireRocket).toHaveBeenCalledTimes(1)
    expect(user.acquireRocket).toHaveBeenCalledWith(rocket, rocketPrice)
  })
})
