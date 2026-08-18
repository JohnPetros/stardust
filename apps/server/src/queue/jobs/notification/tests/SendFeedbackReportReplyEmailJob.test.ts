import type { Amqp } from '@stardust/core/global/interfaces'
import type { EmailProvider } from '@stardust/core/notification/interfaces'
import { mock, type Mock } from 'ts-jest-mocker'

jest.mock('@stardust/email/templates', () => ({
  FeedbackReportReplyTemplateRender: jest.fn(() => ({
    generateHtml: jest.fn().mockResolvedValue('<p>Thanks for the feedback!</p>'),
  })),
  feedbackReportReplySubject: 'New reply to your feedback',
}))

import {
  SendFeedbackReportReplyEmailJob,
  type FeedbackReplyEmailEventPayload,
} from '../SendFeedbackReportReplyEmailJob'

const payload: FeedbackReplyEmailEventPayload = {
  recipientEmail: 'ada@example.com',
  preview: 'A preview of the conversation',
  reply: 'Thanks for the feedback!',
  conversationUrl: 'https://stardust.dev/feedback/report',
  isClosed: false,
  idempotencyKey: 'feedback-reply-111',
}

describe('SendFeedbackReportReplyEmailJob', () => {
  let amqp: Mock<Amqp<FeedbackReplyEmailEventPayload>>
  let provider: Mock<EmailProvider>
  let job: SendFeedbackReportReplyEmailJob

  beforeEach(() => {
    amqp = mock<Amqp<FeedbackReplyEmailEventPayload>>()
    provider = mock<EmailProvider>()
    job = new SendFeedbackReportReplyEmailJob(provider)
    amqp.getPayload.mockReturnValue(payload)
    amqp.run.mockImplementation(async (callback) => await callback())
    provider.sendFeedbackReportReplyEmail.mockResolvedValue()
  })

  it('renders and sends the reply email inside amqp.run', async () => {
    await job.handle(amqp)

    expect(amqp.run).toHaveBeenCalledWith(expect.any(Function), job.constructor.name)
    expect(provider.sendFeedbackReportReplyEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        recipientEmail: expect.objectContaining({ value: payload.recipientEmail }),
        idempotencyKey: expect.objectContaining({ value: payload.idempotencyKey }),
        subject: expect.objectContaining({ value: expect.any(String) }),
        html: expect.objectContaining({ value: expect.stringContaining(payload.reply) }),
        text: expect.objectContaining({ value: expect.stringContaining(payload.reply) }),
      }),
    )
  })

  it('uses the custom subject when one is provided', async () => {
    const customSubject = 'Your feedback has a new reply'
    amqp.getPayload.mockReturnValue({ ...payload, subject: customSubject })

    await job.handle(amqp)

    expect(provider.sendFeedbackReportReplyEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        subject: expect.objectContaining({ value: customSubject }),
      }),
    )
  })

  it('propagates email provider failures', async () => {
    const failure = new Error('Email provider unavailable')
    provider.sendFeedbackReportReplyEmail.mockRejectedValue(failure)

    await expect(job.handle(amqp)).rejects.toThrow(failure)
  })
})
