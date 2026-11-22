import { mock, type Mock } from 'ts-jest-mocker'

import type { Amqp, Broker } from '@stardust/core/global/interfaces'
import type { EventPayload } from '@stardust/core/global/types'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import {
  AcquireAvatarUseCase,
  AcquireRocketUseCase,
  CreateUserUseCase,
  FinishUserCreationUseCase,
} from '@stardust/core/profile/use-cases'
import type { ShopItemsAcquiredByDefaultEvent } from '@stardust/core/shop/events'

import { CreateUserJob } from '../CreateUserJob'

type Payload = EventPayload<typeof ShopItemsAcquiredByDefaultEvent>

describe('Create User Job', () => {
  let amqp: Mock<Amqp<Payload>>
  let usersRepository: Mock<UsersRepository>
  let broker: Mock<Broker>
  let job: CreateUserJob

  const payload = {
    user: {
      id: '11111111-1111-4111-8111-111111111111',
      name: 'Petros Dev',
      email: 'petros@stardust.dev',
    },
    firstUnlockedStarId: '22222222-2222-4222-8222-222222222222',
    firstReachedTierId: '33333333-3333-4333-8333-333333333333',
    acquiredAvatarsByDefaultIds: ['44444444-4444-4444-8444-444444444444'],
    acquiredRocketsByDefaultIds: ['55555555-5555-4555-8555-555555555555'],
    selectedAvatarByDefaultId: '44444444-4444-4444-8444-444444444444',
    selectedRocketByDefaultId: '55555555-5555-4555-8555-555555555555',
  } as unknown as Payload

  beforeEach(() => {
    jest.restoreAllMocks()
    amqp = mock<Amqp<Payload>>()
    usersRepository = mock()
    broker = mock()
    job = new CreateUserJob(usersRepository, broker)
    amqp.getPayload.mockReturnValue(payload)
    amqp.run.mockImplementation(async (callback) => await callback())
  })

  it('should create the user and its defaults without writing any progress fact', async () => {
    const createSpy = jest
      .spyOn(CreateUserUseCase.prototype, 'execute')
      .mockResolvedValue(undefined as never)
    const rocketSpy = jest
      .spyOn(AcquireRocketUseCase.prototype, 'execute')
      .mockResolvedValue(undefined as never)
    const avatarSpy = jest
      .spyOn(AcquireAvatarUseCase.prototype, 'execute')
      .mockResolvedValue(undefined as never)
    const finishSpy = jest
      .spyOn(FinishUserCreationUseCase.prototype, 'execute')
      .mockResolvedValue(undefined as never)

    await job.handle(amqp)

    expect(createSpy).toHaveBeenCalledTimes(1)
    expect(rocketSpy).toHaveBeenCalledTimes(1)
    expect(avatarSpy).toHaveBeenCalledTimes(1)
    expect(finishSpy).toHaveBeenCalledTimes(1)
    expect(usersRepository.addCompletedStar).not.toHaveBeenCalled()
    expect(usersRepository.addOpenedPlanet).not.toHaveBeenCalled()
    expect(amqp.run).toHaveBeenCalledTimes(4)
  })

  it('should stop when creating the user fails', async () => {
    jest
      .spyOn(CreateUserUseCase.prototype, 'execute')
      .mockRejectedValue(new Error('boom'))
    const finishSpy = jest.spyOn(FinishUserCreationUseCase.prototype, 'execute')

    await expect(job.handle(amqp)).rejects.toThrow('boom')
    expect(finishSpy).not.toHaveBeenCalled()
  })
})
