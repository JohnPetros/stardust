import { mock, type Mock } from 'ts-jest-mocker'

import type { Amqp, Broker } from '@stardust/core/global/interfaces'
import type { EventPayload } from '@stardust/core/global/types'
import type { AccountSignedUpEvent } from '@stardust/core/auth/events'
import type {
  GalaxiesRepository,
  PlanetsRepository,
} from '@stardust/core/space/interfaces'
import { UnlockFirstStarUseCase } from '@stardust/core/space/use-cases'

import { UnlockFirstStarJob } from '../UnlockFirstStarJob'

type Payload = EventPayload<typeof AccountSignedUpEvent>

describe('Unlock First Star Job', () => {
  let amqp: Mock<Amqp<Payload>>
  let planetsRepository: Mock<PlanetsRepository>
  let galaxiesRepository: Mock<GalaxiesRepository>
  let broker: Mock<Broker>
  let job: UnlockFirstStarJob

  const payload: Payload = {
    accountId: '11111111-1111-4111-8111-111111111111',
    accountName: 'Petros',
    accountEmail: 'petros@stardust.dev',
  }

  beforeEach(() => {
    jest.restoreAllMocks()
    amqp = mock<Amqp<Payload>>()
    planetsRepository = mock()
    galaxiesRepository = mock()
    broker = mock()
    job = new UnlockFirstStarJob(planetsRepository, galaxiesRepository, broker)

    amqp.getPayload.mockReturnValue(payload)
    amqp.run.mockImplementation(async (callback) => await callback())
  })

  it('should run the use case inside amqp.run with the payload', async () => {
    const executeSpy = jest
      .spyOn(UnlockFirstStarUseCase.prototype, 'execute')
      .mockResolvedValue(undefined)

    await job.handle(amqp)

    expect(amqp.getPayload).toHaveBeenCalledTimes(1)
    expect(amqp.run).toHaveBeenCalledWith(
      expect.any(Function),
      UnlockFirstStarUseCase.name,
    )
    expect(executeSpy).toHaveBeenCalledWith({
      userId: payload.accountId,
      userName: payload.accountName,
      userEmail: payload.accountEmail,
    })
  })

  it('should propagate use case failures', async () => {
    const error = new Error('first galaxy not found')
    jest.spyOn(UnlockFirstStarUseCase.prototype, 'execute').mockRejectedValue(error)

    await expect(job.handle(amqp)).rejects.toThrow(error)
  })
})
