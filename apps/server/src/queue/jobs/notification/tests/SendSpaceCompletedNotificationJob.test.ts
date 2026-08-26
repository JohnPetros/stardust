import { RestResponse } from '@stardust/core/global/responses'
import type { Amqp } from '@stardust/core/global/interfaces'
import type { NotificationService } from '@stardust/core/notification/interfaces'
import { mock, type Mock } from 'ts-jest-mocker'

import { SendSpaceCompletedNotificationJob } from '../SendSpaceCompletedNotificationJob'

const payload = { userSlug: 'ada-lovelace', userName: 'Ada' }

describe('SendSpaceCompletedNotificationJob', () => {
  let amqp: Mock<Amqp<typeof payload>>
  let service: Mock<NotificationService>
  let job: SendSpaceCompletedNotificationJob

  beforeEach(() => {
    amqp = mock<Amqp<typeof payload>>()
    service = mock<NotificationService>()
    job = new SendSpaceCompletedNotificationJob(service)
    amqp.getPayload.mockReturnValue(payload)
    amqp.run.mockImplementation(async (callback) => await callback())
    service.sendSpaceCompletedNotification.mockResolvedValue(new RestResponse())
  })

  it('sends the space completion notification with the payload fields', async () => {
    await job.handle(amqp)

    expect(amqp.run).toHaveBeenCalledWith(
      expect.any(Function),
      SendSpaceCompletedNotificationJob.SERVICE_NAME,
    )
    expect(service.sendSpaceCompletedNotification).toHaveBeenCalledWith(
      payload.userSlug,
      payload.userName,
    )
  })

  it('propagates notification failures', async () => {
    const failure = new Error('Notification service unavailable')
    service.sendSpaceCompletedNotification.mockRejectedValue(failure)

    await expect(job.handle(amqp)).rejects.toThrow(failure)
  })

  it('throws when the notification service returns a failure response', async () => {
    service.sendSpaceCompletedNotification.mockResolvedValue(
      new RestResponse({ statusCode: 500, errorMessage: 'Notification failed' }),
    )

    await expect(job.handle(amqp)).rejects.toThrow('Notification failed')
  })
})
