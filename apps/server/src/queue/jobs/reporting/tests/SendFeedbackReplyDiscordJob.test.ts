import { mock, type Mock } from 'ts-jest-mocker'

import type { Amqp } from '@stardust/core/global/interfaces'
import type { NotificationService } from '@stardust/core/notification/interfaces'
import { RestResponse } from '@stardust/core/global/responses'

import {
  SendFeedbackReplyDiscordJob,
  type FeedbackReplyDiscordEventPayload,
} from '../SendFeedbackReplyDiscordJob'

const payload: FeedbackReplyDiscordEventPayload = {
  reportId: '11111111-1111-4111-8111-111111111111',
  messageId: '22222222-2222-4222-8222-222222222222',
  userName: 'Test User',
  preview: 'New reply',
  hasAttachments: true,
  conversationUrl: 'https://stardust.dev/feedback/report',
}

describe('SendFeedbackReplyDiscordJob', () => {
  let amqp: Mock<Amqp<FeedbackReplyDiscordEventPayload>>
  let service: Mock<NotificationService>
  let sendFeedbackReplyNotification: jest.Mock
  let job: SendFeedbackReplyDiscordJob

  beforeEach(() => {
    amqp = mock<Amqp<FeedbackReplyDiscordEventPayload>>()
    service = mock<NotificationService>()
    sendFeedbackReplyNotification = jest.fn()
    service.sendFeedbackReplyNotification = sendFeedbackReplyNotification
    job = new SendFeedbackReplyDiscordJob(service)
    amqp.getPayload.mockReturnValue(payload)
    amqp.run.mockImplementation(async (callback) => await callback())
    sendFeedbackReplyNotification.mockResolvedValue(new RestResponse())
  })

  it('keeps the stable job key and performs Discord IO inside amqp.run', async () => {
    await job.handle(amqp)

    expect(SendFeedbackReplyDiscordJob.KEY).toBe(
      'reporting/send.feedback.reply.discord.job',
    )
    expect(amqp.run).toHaveBeenCalledWith(
      expect.any(Function),
      SendFeedbackReplyDiscordJob.name,
    )
    expect(service.sendFeedbackReplyNotification).toHaveBeenCalledWith(payload)
  })

  it('propagates Discord failures so Inngest can retry without touching persistence', async () => {
    const failure = new Error('Discord unavailable')
    sendFeedbackReplyNotification.mockRejectedValue(failure)

    await expect(job.handle(amqp)).rejects.toThrow(failure)
  })
})
