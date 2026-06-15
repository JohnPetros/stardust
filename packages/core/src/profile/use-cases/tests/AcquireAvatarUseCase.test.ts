import { mock, type Mock } from 'ts-jest-mocker'

import { Integer } from '#global/domain/structures/Integer'
import type { Broker } from '#global/interfaces/Broker'
import { UsersFaker } from '#profile/domain/entities/fakers/UsersFaker'
import { AvatarAggregatesFaker } from '#profile/domain/aggregates/fakers/AvatarAggregatesFaker'
import { UserNotFoundError } from '#profile/domain/errors/UserNotFoundError'
import { ShopItemPurchasedEvent } from '#profile/domain/events/ShopItemPurchasedEvent'
import { AcquireAvatarUseCase } from '../AcquireAvatarUseCase'
import type { UsersRepository } from '../../interfaces'

describe('Acquire Avatar Use Case', () => {
  let broker: Mock<Broker>
  let repository: Mock<UsersRepository>
  let useCase: AcquireAvatarUseCase

  beforeEach(() => {
    broker = mock<Broker>()
    broker.publish.mockImplementation()
    repository = mock<UsersRepository>()
    repository.findById.mockImplementation()
    repository.replace.mockImplementation()
    repository.addAcquiredAvatar.mockImplementation()
    useCase = new AcquireAvatarUseCase(repository, broker)
  })

  it('should throw an error if the user is not found', async () => {
    const user = UsersFaker.fake()
    const avatar = AvatarAggregatesFaker.fake()
    repository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({
        userId: user.id.value,
        avatarId: avatar.id.value,
        avatarName: avatar.name.value,
        avatarImage: avatar.image.value,
        avatarPrice: 0,
      }),
    ).rejects.toThrow(UserNotFoundError)

    expect(repository.addAcquiredAvatar).not.toHaveBeenCalled()
    expect(broker.publish).not.toHaveBeenCalled()
  })

  it('should add the acquire avatar to the repository only if the user can acquire the avatar and not has acquired it yet', async () => {
    const avatar = AvatarAggregatesFaker.fake()
    let user = UsersFaker.fake({ coins: 100, acquiredAvatarsIds: [avatar.id.value] })
    user.acquireAvatar = jest.fn()
    repository.findById.mockResolvedValue(user)

    await useCase.execute({
      userId: user.id.value,
      avatarId: avatar.id.value,
      avatarName: avatar.name.value,
      avatarImage: avatar.image.value,
      avatarPrice: 101,
    })

    expect(repository.addAcquiredAvatar).toHaveBeenCalledTimes(0)
    expect(broker.publish).not.toHaveBeenCalled()

    user = UsersFaker.fake({ coins: 100, acquiredAvatarsIds: [avatar.id.value] })
    repository.findById.mockResolvedValue(user)

    await useCase.execute({
      userId: user.id.value,
      avatarId: avatar.id.value,
      avatarName: avatar.name.value,
      avatarImage: avatar.image.value,
      avatarPrice: 0,
    })

    expect(repository.addAcquiredAvatar).toHaveBeenCalledTimes(0)
    expect(broker.publish).not.toHaveBeenCalled()

    user = UsersFaker.fake({ coins: 100, acquiredAvatarsIds: [] })
    repository.findById.mockResolvedValue(user)

    await useCase.execute({
      userId: user.id.value,
      avatarId: avatar.id.value,
      avatarName: avatar.name.value,
      avatarImage: avatar.image.value,
      avatarPrice: 0,
    })

    expect(repository.addAcquiredAvatar).toHaveBeenCalledTimes(1)
    expect(repository.addAcquiredAvatar).toHaveBeenCalledWith(avatar.id, user.id)
    expect(broker.publish).toHaveBeenCalledWith(
      expect.objectContaining<ShopItemPurchasedEvent>({
        name: ShopItemPurchasedEvent._NAME,
        payload: {
          userId: user.id.value,
          itemId: avatar.id.value,
          itemType: 'avatar',
          itemName: avatar.name.value,
          itemPrice: 0,
        },
      }),
    )
  })

  it('should try to acquire the avatar', async () => {
    const avatar = AvatarAggregatesFaker.fake()
    const user = UsersFaker.fake()
    user.acquireAvatar = jest.fn()
    const avatarPrice = Integer.create(100)
    repository.findById.mockResolvedValue(user)

    await useCase.execute({
      userId: user.id.value,
      avatarId: avatar.id.value,
      avatarName: avatar.name.value,
      avatarImage: avatar.image.value,
      avatarPrice: avatarPrice.value,
    })

    expect(user.acquireAvatar).toHaveBeenCalledTimes(1)
    expect(user.acquireAvatar).toHaveBeenCalledWith(avatar, avatarPrice)
  })
})
