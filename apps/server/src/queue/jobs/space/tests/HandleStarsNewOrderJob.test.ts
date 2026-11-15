import { mock, type Mock } from 'ts-jest-mocker'

import type { Amqp, Broker } from '@stardust/core/global/interfaces'
import type {
  GalaxiesRepository,
  PlanetsRepository,
} from '@stardust/core/space/interfaces'
import { HandleStarsNewOrderUseCase } from '@stardust/core/space/use-cases'

import { HandleStarsNewOrderJob } from '../HandleStarsNewOrderJob'

describe('Handle Stars New Order Job', () => {
  let amqp: Mock<Amqp>
  let planetsRepository: Mock<PlanetsRepository>
  let galaxiesRepository: Mock<GalaxiesRepository>
  let broker: Mock<Broker>
  let job: HandleStarsNewOrderJob

  beforeEach(() => {
    jest.restoreAllMocks()
    amqp = mock<Amqp>()
    planetsRepository = mock()
    galaxiesRepository = mock()
    broker = mock()
    job = new HandleStarsNewOrderJob(planetsRepository, galaxiesRepository, broker)

    amqp.run.mockImplementation(async (callback) => await callback())
  })

  it('should run the use case inside amqp.run', async () => {
    const executeSpy = jest
      .spyOn(HandleStarsNewOrderUseCase.prototype, 'execute')
      .mockResolvedValue(undefined)

    await job.handle(amqp)

    expect(amqp.run).toHaveBeenCalledWith(
      expect.any(Function),
      HandleStarsNewOrderUseCase.name,
    )
    expect(executeSpy).toHaveBeenCalledTimes(1)
  })

  it('should propagate use case failures', async () => {
    const error = new Error('first galaxy not found')
    jest.spyOn(HandleStarsNewOrderUseCase.prototype, 'execute').mockRejectedValue(error)

    await expect(job.handle(amqp)).rejects.toThrow(error)
  })
})
