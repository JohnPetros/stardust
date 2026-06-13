import { mock, type Mock } from 'ts-jest-mocker'

import type { Broker } from '#global/interfaces/Broker'
import { UsersFaker } from '#profile/domain/entities/fakers/UsersFaker'
import { UserNotFoundError } from '#profile/domain/errors/UserNotFoundError'
import { Integer } from '#global/domain/structures/Integer'
import { InsigniaRole } from '#global/domain/structures/InsigniaRole'
import { ShopItemPurchasedEvent } from '#profile/domain/events/ShopItemPurchasedEvent'
import { AcquireInsigniaUseCase } from '../AcquireInsigniaUseCase'
import type { UsersRepository } from '../../interfaces'

describe('Acquire Insignia Use Case', () => {
  let broker: Mock<Broker>
  let repository: Mock<UsersRepository>
  let useCase: AcquireInsigniaUseCase

  beforeEach(() => {
    broker = mock<Broker>()
    broker.publish.mockImplementation()
    repository = mock<UsersRepository>()
    repository.findById.mockImplementation()
    repository.replace.mockImplementation()
    repository.addAcquiredInsignia.mockImplementation()
    useCase = new AcquireInsigniaUseCase(repository, broker)
  })

  it('should throw an error if the user is not found', async () => {
    const user = UsersFaker.fake({ coins: 100 })
    repository.findById.mockResolvedValue(null)

    await expect(
      useCase.execute({
        userId: user.id.value,
        insigniaRole: 'engineer',
        insigniaPrice: 0,
      }),
    ).rejects.toThrow(UserNotFoundError)

    expect(repository.addAcquiredInsignia).not.toHaveBeenCalled()
    expect(broker.publish).not.toHaveBeenCalled()
  })

  it('should make the user acquire the insignia', async () => {
    const user = UsersFaker.fake({ coins: 100 })
    user.acquireInsignia = jest.fn()
    const insigniaPrice = Integer.create(100)
    const insigniaRole = InsigniaRole.createAsEngineer()
    repository.findById.mockResolvedValue(user)

    await useCase.execute({
      userId: user.id.value,
      insigniaRole: insigniaRole.value,
      insigniaPrice: insigniaPrice.value,
    })

    expect(user.acquireInsignia).toHaveBeenCalledTimes(1)
    expect(user.acquireInsignia).toHaveBeenCalledWith(insigniaRole, insigniaPrice)
  })

  it('should replace the user in the repository', async () => {
    const user = UsersFaker.fake()
    user.acquireInsignia = jest.fn()
    const insigniaPrice = Integer.create(100)
    const insigniaRole = InsigniaRole.createAsEngineer()
    repository.findById.mockResolvedValue(user)

    await useCase.execute({
      userId: user.id.value,
      insigniaRole: insigniaRole.value,
      insigniaPrice: insigniaPrice.value,
    })

    expect(repository.replace).toHaveBeenCalledTimes(1)
    expect(repository.replace).toHaveBeenCalledWith(user)
  })

  it('should add the acquired insignia to the repository', async () => {
    const user = UsersFaker.fake()
    user.acquireInsignia = jest.fn()
    const insigniaPrice = Integer.create(100)
    const insigniaRole = InsigniaRole.createAsEngineer()
    repository.findById.mockResolvedValue(user)

    await useCase.execute({
      userId: user.id.value,
      insigniaRole: insigniaRole.value,
      insigniaPrice: insigniaPrice.value,
    })

    expect(repository.addAcquiredInsignia).toHaveBeenCalledTimes(1)
    expect(repository.addAcquiredInsignia).toHaveBeenCalledWith(insigniaRole, user.id)
  })

  it('should publish shop item purchased event after acquiring the insignia', async () => {
    const user = UsersFaker.fake({ coins: 100 })
    const insigniaPrice = Integer.create(100)
    const insigniaRole = InsigniaRole.createAsEngineer()
    repository.findById.mockResolvedValue(user)

    await useCase.execute({
      userId: user.id.value,
      insigniaRole: insigniaRole.value,
      insigniaPrice: insigniaPrice.value,
    })

    expect(broker.publish).toHaveBeenCalledWith(
      expect.objectContaining<ShopItemPurchasedEvent>({
        name: ShopItemPurchasedEvent._NAME,
        payload: {
          userId: user.id.value,
          itemId: insigniaRole.value,
          itemType: 'insignia',
          itemName: insigniaRole.value,
          itemPrice: insigniaPrice.value,
        },
      }),
    )
  })
})
