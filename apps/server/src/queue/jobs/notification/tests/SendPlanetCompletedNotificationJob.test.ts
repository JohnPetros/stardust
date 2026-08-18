import { RestResponse } from '@stardust/core/global/responses'
import type { Amqp } from '@stardust/core/global/interfaces'
import type { NotificationService } from '@stardust/core/notification/interfaces'
import { mock, type Mock } from 'ts-jest-mocker'

import { SendPlanetCompletedNotificationJob } from '../SendPlanetCompletedNotificationJob'

const payload = { userSlug: 'ada-lovelace', userName: 'Ada', planetName: 'Logic' }

describe('SendPlanetCompletedNotificationJob', () => {
  let amqp: Mock<Amqp<typeof payload>>
  let service: Mock<NotificationService>
  let job: SendPlanetCompletedNotificationJob

  beforeEach(() => {
    amqp = mock<Amqp<typeof payload>>()
    service = mock<NotificationService>()
    job = new SendPlanetCompletedNotificationJob(service)
    amqp.getPayload.mockReturnValue(payload)
    amqp.run.mockImplementation(async (callback) => await callback())
    service.sendPlanetCompletedNotification.mockResolvedValue(new RestResponse())
  })

  it('sends the planet completion notification with the payload fields', async () => {
    await job.handle(amqp)

    expect(amqp.run).toHaveBeenCalledWith(
      expect.any(Function),
      SendPlanetCompletedNotificationJob.SERVICE_NAME,
    )
    expect(service.sendPlanetCompletedNotification).toHaveBeenCalledWith(
      payload.userSlug,
      payload.userName,
      payload.planetName,
    )
  })

  it('propagates notification failures', async () => {
    const failure = new Error('Notification service unavailable')
    service.sendPlanetCompletedNotification.mockRejectedValue(failure)

    await expect(job.handle(amqp)).rejects.toThrow(failure)
  })

  it('throws when the notification service returns a failure response', async () => {
    service.sendPlanetCompletedNotification.mockResolvedValue(
      new RestResponse({ statusCode: 500, errorMessage: 'Notification failed' }),
    )

    await expect(job.handle(amqp)).rejects.toThrow('Notification failed')
  })
})
