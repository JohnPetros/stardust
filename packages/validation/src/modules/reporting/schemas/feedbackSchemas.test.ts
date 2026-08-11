import {
  feedbackAttachmentUploadSchema,
  feedbackInitialAttachmentSchema,
  feedbackMessageSchema,
  feedbackReadSchema,
  feedbackReportSchema,
  feedbackReportsQuerySchema,
  feedbackStatusSchema,
  nextRouteSchema,
  userFeedbackReportsQuerySchema,
} from './index'

describe('feedback reporting schemas', () => {
  it('trims message content and enforces attachment limits', () => {
    const valid = feedbackMessageSchema.parse({
      messageId: '00000000-0000-4000-8000-000000000001',
      content: '  valid reply  ',
      attachments: [],
    })
    expect(valid.content).toBe('valid reply')

    expect(
      feedbackMessageSchema.safeParse({
        ...valid,
        content: ' '.repeat(2001),
      }).success,
    ).toBe(false)

    expect(
      feedbackMessageSchema.safeParse({
        ...valid,
        attachments: [
          {
            id: '00000000-0000-4000-8000-000000000002',
            storageKey: 'images/feedback-messages/report/message/file.jpg',
            originalName: 'scan.JFIF',
            mimeType: 'image/jpeg',
            size: 1,
          },
        ],
      }).success,
    ).toBe(true)
  })

  it('validates contextual uploads, snapshots, status and query dates', () => {
    expect(
      feedbackAttachmentUploadSchema.safeParse({
        fileName: '00000000-0000-4000-8000-000000000001.png',
        mimeType: 'image/png',
        size: 1,
      }).success,
    ).toBe(true)
    expect(
      feedbackAttachmentUploadSchema.safeParse({
        fileName: 'not-a-uuid.gif',
        mimeType: 'image/gif',
        size: 1,
      }).success,
    ).toBe(false)
    expect(
      feedbackAttachmentUploadSchema.safeParse({
        fileName: '00000000-0000-4000-8000-000000000001.png',
        mimeType: 'image/jpeg',
        size: 1,
      }).success,
    ).toBe(false)
    expect(
      feedbackReadSchema.safeParse({
        lastSeenUserMessageId: '00000000-0000-4000-8000-000000000001',
      }).success,
    ).toBe(true)
    expect(
      feedbackStatusSchema.safeParse({ status: 'closed', expectedStatus: 'open' })
        .success,
    ).toBe(true)
    expect(
      feedbackReportsQuerySchema.safeParse({
        createdAtStartDate: '2026-01-02',
        createdAtEndDate: '2026-01-01',
      }).success,
    ).toBe(false)
  })

  it('validates the original report limits without normalizing the persisted content', () => {
    const report = feedbackReportSchema.parse({
      content: '  dez caracteres  ',
      intent: 'idea',
      author: 'must not cross the boundary',
      title: 'must not cross the boundary',
      userId: 'must not cross the boundary',
    })

    expect(report.content).toBe('  dez caracteres  ')
    expect(report).not.toHaveProperty('author')
    expect(report).not.toHaveProperty('title')
    expect(report).not.toHaveProperty('userId')
    expect(
      feedbackReportSchema.safeParse({ content: '         ', intent: 'idea' }).success,
    ).toBe(false)
    expect(
      feedbackReportSchema.safeParse({ content: 'a'.repeat(1001), intent: 'idea' })
        .success,
    ).toBe(false)
  })

  it('validates initial attachment metadata and the user query boundary', () => {
    const attachment = {
      storageKey: 'images/feedback-reports/55555555-5555-4555-8555-555555555555.png',
      originalName: 'capture without extension',
      mimeType: 'image/png' as const,
      size: 10 * 1024 * 1024,
    }
    expect(feedbackInitialAttachmentSchema.safeParse(attachment).success).toBe(true)
    expect(
      feedbackInitialAttachmentSchema.safeParse({ ...attachment, mimeType: 'image/jpeg' })
        .success,
    ).toBe(false)
    expect(
      feedbackInitialAttachmentSchema.safeParse({
        ...attachment,
        size: 10 * 1024 * 1024 + 1,
      }).success,
    ).toBe(false)
    expect(
      userFeedbackReportsQuerySchema.safeParse({
        status: 'open',
        page: '2',
        itemsPerPage: '10',
      }).success,
    ).toBe(true)
    expect(userFeedbackReportsQuerySchema.safeParse({ search: 'secret' }).success).toBe(
      false,
    )
  })

  it('accepts the participant-aware read id and rejects unsafe next routes', () => {
    expect(
      feedbackReadSchema.parse({
        lastSeenMessageId: '00000000-0000-4000-8000-000000000001',
      }).lastSeenMessageId,
    ).toBe('00000000-0000-4000-8000-000000000001')
    expect(nextRouteSchema.safeParse('/feedback/report-id?tab=history').success).toBe(
      true,
    )
    expect(nextRouteSchema.safeParse('https://evil.example').success).toBe(false)
    expect(nextRouteSchema.safeParse('//evil.example').success).toBe(false)
    expect(nextRouteSchema.safeParse('/auth/sign-in').success).toBe(false)
  })
})
