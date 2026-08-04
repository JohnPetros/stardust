import {
  feedbackAttachmentUploadSchema,
  feedbackMessageSchema,
  feedbackReadSchema,
  feedbackReportsQuerySchema,
  feedbackStatusSchema,
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
})
