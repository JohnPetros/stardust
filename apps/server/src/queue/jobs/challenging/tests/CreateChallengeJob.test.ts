import type { Amqp } from '@stardust/core/global/interfaces'
import type { CreateChallengeWorkflow } from '@stardust/core/challenging/interfaces'
import { mock, type Mock } from 'ts-jest-mocker'

import { CreateChallengeJob } from '../CreateChallengeJob'

describe('CreateChallengeJob', () => {
  let amqp: Mock<Amqp>
  let workflow: Mock<CreateChallengeWorkflow>
  let job: CreateChallengeJob

  beforeEach(() => {
    amqp = mock<Amqp>()
    workflow = mock<CreateChallengeWorkflow>()
    job = new CreateChallengeJob(workflow)
    amqp.run.mockImplementation(async (callback) => await callback())
    workflow.run.mockResolvedValue()
  })

  it('runs the challenge workflow inside amqp.run', async () => {
    await job.handle(amqp)

    expect(amqp.run).toHaveBeenCalledWith(
      expect.any(Function),
      'Create Challenge Workflow',
    )
    expect(workflow.run).toHaveBeenCalledTimes(1)
  })

  it('propagates workflow failures', async () => {
    const failure = new Error('Challenge creation failed')
    workflow.run.mockRejectedValue(failure)

    await expect(job.handle(amqp)).rejects.toThrow(failure)
  })
})
