import { RestResponse } from '@stardust/core/global/responses'
import type { Amqp } from '@stardust/core/global/interfaces'
import type { NotificationService } from '@stardust/core/notification/interfaces'
import { mock, type Mock } from 'ts-jest-mocker'

import { SendChallengePostedNotificationJob } from '../SendChallengePostedNotificationJob'

const payload = {
  challengeSlug: 'hello-world',
  challengeTitle: 'Hello World',
  challengeAuthor: { id: '11111111-1111-4111-8111-111111111111' },
}

describe('SendChallengePostedNotificationJob', () => {
  let amqp: Mock<Amqp<typeof payload>>
  let service: Mock<NotificationService>
  let job: SendChallengePostedNotificationJob

  beforeEach(() => {
    amqp = mock<Amqp<typeof payload>>()
    service = mock<NotificationService>()
    job = new SendChallengePostedNotificationJob(service)
    amqp.getPayload.mockReturnValue(payload)
    amqp.run.mockImplementation(async (callback) => await callback())
    service.sendChallengePostedNotification.mockResolvedValue(new RestResponse())
  })

  it('sends the challenge notification inside amqp.run', async () => {
    await job.handle(amqp)

    expect(amqp.run).toHaveBeenCalledWith(
      expect.any(Function),
      SendChallengePostedNotificationJob.SERVICE_NAME,
    )
    expect(service.sendChallengePostedNotification).toHaveBeenCalledWith(payload)
  })

  it('propagates notification failures', async () => {
    const failure = new Error('Notification service unavailable')
    service.sendChallengePostedNotification.mockRejectedValue(failure)

    await expect(job.handle(amqp)).rejects.toThrow(failure)
  })

  it('throws when the notification service returns a failure response', async () => {
    service.sendChallengePostedNotification.mockResolvedValue(
      new RestResponse({ statusCode: 500, errorMessage: 'Notification failed' }),
    )

    await expect(job.handle(amqp)).rejects.toThrow('Notification failed')
  })
})
