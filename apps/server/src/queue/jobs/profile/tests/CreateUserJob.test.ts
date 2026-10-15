import { mock } from 'ts-jest-mocker'
import type { Amqp, Broker, Database } from '@stardust/core/global/interfaces'
import type { EventPayload } from '@stardust/core/global/types'
import type { UsersRepository } from '@stardust/core/profile/interfaces'
import type { ShopItemsAcquiredByDefaultEvent } from '@stardust/core/shop/events'
import { UsersFaker } from '@stardust/core/profile/entities/fakers'
import {
  AcquireAvatarUseCase,
  AcquireRocketUseCase,
  CreateUserUseCase,
  FinishUserCreationUseCase,
  UnlockStarUseCase,
} from '@stardust/core/profile/use-cases'
import { CreateUserJob } from '../CreateUserJob'

type Payload = EventPayload<typeof ShopItemsAcquiredByDefaultEvent>

describe('Create User Job transaction', () => {
  const database = mock<Database>()
  const repository = mock<UsersRepository>()
  const broker = mock<Broker>()
  const amqp = mock<Amqp<Payload>>()
  let job: CreateUserJob
  let transactionActive = false
  let steps: string[]

  beforeEach(() => {
    jest.restoreAllMocks()
    jest.clearAllMocks()
    steps = []
    transactionActive = false
    job = new CreateUserJob(repository, broker, database)
    database.run.mockImplementation(async (operation) => {
      transactionActive = true
      try {
        return await operation()
      } finally {
        transactionActive = false
      }
    })
    amqp.run.mockImplementation(async (operation) => operation())
    amqp.getPayload.mockReturnValue({
      user: { id: 'user-id', name: 'Test User', email: 'test@example.com' },
      firstReachedTierId: 'tier-id',
      firstUnlockedStarId: 'star-id',
      acquiredAvatarsByDefaultIds: ['avatar-1', 'avatar-2'],
      acquiredRocketsByDefaultIds: ['rocket-1', 'rocket-2'],
      selectedAvatarByDefaultId: 'avatar-1',
      selectedRocketByDefaultId: 'rocket-1',
    })
    jest.spyOn(CreateUserUseCase.prototype, 'execute').mockImplementation(async () => {
      expect(transactionActive).toBe(true)
      steps.push('create')
    })
    jest.spyOn(UnlockStarUseCase.prototype, 'execute').mockImplementation(async () => {
      expect(transactionActive).toBe(true)
      steps.push('unlock')
      return UsersFaker.fakeDto()
    })
    jest.spyOn(AcquireRocketUseCase.prototype, 'execute').mockImplementation(async () => {
      expect(transactionActive).toBe(true)
      steps.push('rocket')
      return UsersFaker.fakeDto()
    })
    jest.spyOn(AcquireAvatarUseCase.prototype, 'execute').mockImplementation(async () => {
      expect(transactionActive).toBe(true)
      steps.push('avatar')
      return UsersFaker.fakeDto()
    })
    jest
      .spyOn(FinishUserCreationUseCase.prototype, 'execute')
      .mockImplementation(async () => {
        expect(transactionActive).toBe(true)
        steps.push('finish')
      })
  })

  it('keeps user creation, default inventory, unlock and final event in one durable database step', async () => {
    await job.handle(amqp)
    expect(amqp.run).toHaveBeenCalledTimes(1)
    expect(amqp.run).toHaveBeenCalledWith(expect.any(Function), CreateUserUseCase.name)
    expect(database.run).toHaveBeenCalledTimes(1)
    expect(steps).toEqual([
      'create',
      'unlock',
      'rocket',
      'rocket',
      'avatar',
      'avatar',
      'finish',
    ])
    expect(transactionActive).toBe(false)
  })

  it('propagates item failure through the transaction and does not emit the completion event', async () => {
    const failure = new Error('inventory write failed')
    jest.spyOn(AcquireRocketUseCase.prototype, 'execute').mockRejectedValue(failure)
    await expect(job.handle(amqp)).rejects.toBe(failure)
    expect(AcquireAvatarUseCase.prototype.execute).not.toHaveBeenCalled()
    expect(FinishUserCreationUseCase.prototype.execute).not.toHaveBeenCalled()
    expect(transactionActive).toBe(false)
  })
})
