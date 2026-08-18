import { RestResponse } from '@stardust/core/global/responses'
import type { Amqp } from '@stardust/core/global/interfaces'
import type { NotificationService } from '@stardust/core/notification/interfaces'
import { mock, type Mock } from 'ts-jest-mocker'

import { SendFeedbackNotificationJob } from '../SendFeedbackNotificationJob'

const payload = {
  feedbackReportId: '11111111-1111-4111-8111-111111111111',
  feedbackReportContent: 'The lesson was helpful',
  feedbackReportIntent: 'suggestion',
  feedbackReportSentAt: '2026-08-17T12:00:00.000Z',
  author: { id: '22222222-2222-4222-8222-222222222222' },
}

describe('SendFeedbackNotificationJob', () => {
  let amqp: Mock<Amqp<typeof payload>>
  let service: Mock<NotificationService>
  let job: SendFeedbackNotificationJob

  beforeEach(() => {
    amqp = mock<Amqp<typeof payload>>()
    service = mock<NotificationService>()
    job = new SendFeedbackNotificationJob(service)
    amqp.getPayload.mockReturnValue(payload)
    amqp.run.mockImplementation(async (callback) => await callback())
    service.sendFeedbackReportNotification.mockResolvedValue(new RestResponse())
  })

  it('sends the feedback notification with the complete event payload', async () => {
    await job.handle(amqp)

    expect(amqp.run).toHaveBeenCalledWith(
      expect.any(Function),
      SendFeedbackNotificationJob.SERVICE_NAME,
    )
    expect(service.sendFeedbackReportNotification).toHaveBeenCalledWith(payload)
  })

  it('propagates notification failures', async () => {
    const failure = new Error('Notification service unavailable')
    service.sendFeedbackReportNotification.mockRejectedValue(failure)

    await expect(job.handle(amqp)).rejects.toThrow(failure)
  })

  it('throws when the notification service returns a failure response', async () => {
    service.sendFeedbackReportNotification.mockResolvedValue(
      new RestResponse({ statusCode: 500, errorMessage: 'Notification failed' }),
    )

    await expect(job.handle(amqp)).rejects.toThrow('Notification failed')
  })
})
