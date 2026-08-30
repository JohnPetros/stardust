import { RestResponse } from '@stardust/core/global/responses'
import type { Amqp } from '@stardust/core/global/interfaces'
import type { NotificationService } from '@stardust/core/notification/interfaces'
import { mock, type Mock } from 'ts-jest-mocker'

import { SendUserCreatedNotificationJob } from '../SendUserCreatedNotificationJob'

const payload = {
  userId: '11111111-1111-4111-8111-111111111111',
  userName: 'Ada',
  userEmail: 'ada@example.com',
  userSlug: 'ada-lovelace',
}

describe('SendUserCreatedNotificationJob', () => {
  let amqp: Mock<Amqp<typeof payload>>
  let service: Mock<NotificationService>
  let job: SendUserCreatedNotificationJob

  beforeEach(() => {
    amqp = mock<Amqp<typeof payload>>()
    service = mock<NotificationService>()
    job = new SendUserCreatedNotificationJob(service)
    amqp.getPayload.mockReturnValue(payload)
    amqp.run.mockImplementation(async (callback) => await callback())
    service.sendUserCreatedNotification.mockResolvedValue(new RestResponse())
  })

  it('sends the user-created payload inside amqp.run', async () => {
    await job.handle(amqp)

    expect(amqp.run).toHaveBeenCalledWith(
      expect.any(Function),
      SendUserCreatedNotificationJob.SERVICE_NAME,
    )
    expect(service.sendUserCreatedNotification).toHaveBeenCalledWith(payload)
  })

  it('propagates notification failures', async () => {
    const failure = new Error('Notification service unavailable')
    service.sendUserCreatedNotification.mockRejectedValue(failure)

    await expect(job.handle(amqp)).rejects.toThrow(failure)
  })

  it('throws when the notification service returns a failure response', async () => {
    service.sendUserCreatedNotification.mockResolvedValue(
      new RestResponse({ statusCode: 500, errorMessage: 'Notification failed' }),
    )

    await expect(job.handle(amqp)).rejects.toThrow('Notification failed')
  })
})
