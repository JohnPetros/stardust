import { mock, type Mock } from 'ts-jest-mocker'
import type { Database } from '#global/interfaces/Database'
import type { Broker } from '#global/interfaces/Broker'
import { Id } from '#global/domain/structures/Id'
import { Integer } from '#global/domain/structures/Integer'
import { AvatarsFaker } from '../../domain/entities/fakers/AvatarsFaker'
import { RocketsFaker } from '../../domain/entities/fakers/RocketsFaker'
import { ShopItemsAcquiredByDefaultEvent } from '../../domain/events'
import {
  SelectedAvatarByDefaultNotFoundError,
  SelectedRocketByDefaultNotFoundError,
} from '../../domain/errors'
import type { AvatarsRepository, RocketsRepository } from '../../interfaces'
import { AquireDefaultShopItemsUseCase } from '../AquireDefaultShopItemsUseCase'

describe('AquireDefaultShopItemsUseCase', () => {
  let database: Mock<Database>
  let broker: Mock<Broker>
  let avatars: Mock<AvatarsRepository>
  let rockets: Mock<RocketsRepository>
  let useCase: AquireDefaultShopItemsUseCase

  beforeEach(() => {
    database = mock<Database>()
    database.run.mockImplementation(async (operation) => operation())
    broker = mock<Broker>()
    broker.publish.mockResolvedValue(undefined)
    avatars = mock<AvatarsRepository>()
    rockets = mock<RocketsRepository>()
    useCase = new AquireDefaultShopItemsUseCase(database, rockets, avatars, broker)
  })

  const request = () => ({
    user: { id: Id.create().value, name: 'User', email: 'user@example.com' },
    firstUnlockedStarId: Id.create().value,
    firstReachedTierId: Id.create().value,
  })

  it('selects free defaults and enqueues their IDs with onboarding context', async () => {
    const avatar = AvatarsFaker.fake({
      price: 0,
      isAcquiredByDefault: true,
      isSelectedByDefault: true,
    })
    const rocket = RocketsFaker.fake({
      price: 0,
      isAcquiredByDefault: true,
      isSelectedByDefault: true,
    })
    avatars.findAllByPrice.mockResolvedValue([avatar])
    rockets.findAllByPrice.mockResolvedValue([rocket])
    const input = request()

    await useCase.execute(input)

    expect(database.run).toHaveBeenCalledTimes(1)
    expect(avatars.findAllByPrice).toHaveBeenCalledWith(Integer.create(0))
    expect(rockets.findAllByPrice).toHaveBeenCalledWith(Integer.create(0))
    expect(broker.publish).toHaveBeenCalledWith(
      new ShopItemsAcquiredByDefaultEvent({
        ...input,
        selectedAvatarByDefaultId: avatar.id.value,
        selectedRocketByDefaultId: rocket.id.value,
        acquiredAvatarsByDefaultIds: [avatar.id.value],
        acquiredRocketsByDefaultIds: [rocket.id.value],
      }),
    )
  })

  it('rejects a missing default avatar without enqueue', async () => {
    avatars.findAllByPrice.mockResolvedValue([])
    rockets.findAllByPrice.mockResolvedValue([
      RocketsFaker.fake({ isSelectedByDefault: true }),
    ])

    await expect(useCase.execute(request())).rejects.toThrow(
      SelectedAvatarByDefaultNotFoundError,
    )
    expect(broker.publish).not.toHaveBeenCalled()
  })

  it('rejects a missing default rocket without enqueue', async () => {
    avatars.findAllByPrice.mockResolvedValue([
      AvatarsFaker.fake({ isSelectedByDefault: true }),
    ])
    rockets.findAllByPrice.mockResolvedValue([])

    await expect(useCase.execute(request())).rejects.toThrow(
      SelectedRocketByDefaultNotFoundError,
    )
    expect(broker.publish).not.toHaveBeenCalled()
  })
})
