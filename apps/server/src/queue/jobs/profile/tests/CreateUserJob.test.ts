import type { Amqp, Broker } from '@stardust/core/global/interfaces'
import {
  CreateUserUseCase,
  AcquireAvatarUseCase,
  AcquireRocketUseCase,
  FinishUserCreationUseCase,
  UnlockStarUseCase,
} from '@stardust/core/profile/use-cases'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import { mock, type Mock } from 'ts-jest-mocker'

import { CreateUserJob } from '../CreateUserJob'

type Payload = {
  user: { id: string; name: string; email: string }
  firstReachedTierId: string
  firstUnlockedStarId: string
  acquiredAvatarsByDefaultIds: string[]
  acquiredRocketsByDefaultIds: string[]
  selectedAvatarByDefaultId: string
  selectedRocketByDefaultId: string
}

const payload: Payload = {
  user: {
    id: '11111111-1111-4111-8111-111111111111',
    name: 'Ada Lovelace',
    email: 'ada@example.com',
  },
  firstReachedTierId: '22222222-2222-4222-8222-222222222222',
  firstUnlockedStarId: '33333333-3333-4333-8333-333333333333',
  acquiredAvatarsByDefaultIds: ['44444444-4444-4444-8444-444444444444'],
  acquiredRocketsByDefaultIds: ['55555555-5555-4555-8555-555555555555'],
  selectedAvatarByDefaultId: '44444444-4444-4444-8444-444444444444',
  selectedRocketByDefaultId: '55555555-5555-4555-8555-555555555555',
}

describe('CreateUserJob', () => {
  let amqp: Mock<Amqp<Payload>>
  let repository: Mock<UsersRepository>
  let broker: Mock<Broker>
  let executes: jest.SpyInstance[]
  let job: CreateUserJob

  beforeEach(() => {
    amqp = mock<Amqp<Payload>>()
    repository = mock<UsersRepository>()
    broker = mock<Broker>()
    job = new CreateUserJob(repository, broker)
    amqp.getPayload.mockReturnValue(payload)
    amqp.run.mockImplementation(async (callback) => await callback())
    executes = [
      jest
        .spyOn(CreateUserUseCase.prototype, 'execute')
        .mockResolvedValue(undefined as never),
      jest
        .spyOn(UnlockStarUseCase.prototype, 'execute')
        .mockResolvedValue(undefined as never),
      jest
        .spyOn(AcquireRocketUseCase.prototype, 'execute')
        .mockResolvedValue(undefined as never),
      jest
        .spyOn(AcquireAvatarUseCase.prototype, 'execute')
        .mockResolvedValue(undefined as never),
      jest
        .spyOn(FinishUserCreationUseCase.prototype, 'execute')
        .mockResolvedValue(undefined),
    ]
  })

  afterEach(() => jest.restoreAllMocks())

  it('runs the complete user creation workflow in ordered amqp steps', async () => {
    await job.handle(amqp)

    expect(amqp.run).toHaveBeenCalledTimes(5)
    expect(executes[0]).toHaveBeenCalledWith({
      userId: payload.user.id,
      userName: payload.user.name,
      userEmail: payload.user.email,
      firstReachedTierId: payload.firstReachedTierId,
      selectedAvatarByDefaultId: payload.selectedAvatarByDefaultId,
      selectedRocketByDefaultId: payload.selectedRocketByDefaultId,
    })
    expect(executes[1]).toHaveBeenCalledWith({
      userId: payload.user.id,
      starId: payload.firstUnlockedStarId,
    })
    expect(executes[2]).toHaveBeenCalledWith({
      userId: payload.user.id,
      rocketId: payload.acquiredRocketsByDefaultIds[0],
      rocketPrice: 0,
    })
    expect(executes[3]).toHaveBeenCalledWith({
      userId: payload.user.id,
      avatarId: payload.acquiredAvatarsByDefaultIds[0],
      avatarPrice: 0,
    })
    expect(executes[4]).toHaveBeenCalledWith({
      userId: payload.user.id,
      userName: payload.user.name,
      userEmail: payload.user.email,
      userSlug: 'ada-lovelace',
    })
  })

  it('propagates failures from a workflow step', async () => {
    const failure = new Error('User creation failed')
    executes[0].mockRejectedValue(failure)

    await expect(job.handle(amqp)).rejects.toThrow(failure)
  })
})
