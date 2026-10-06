import { mock, type Mock } from 'ts-jest-mocker'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { GetFeedbackReportUseCase } from '@stardust/core/reporting/use-cases'
import { PostgresFeedbackMessagesRepository } from '@/database/postgres/PostgresFeedbackMessagesRepository'
import { PostgresFeedbackReportsRepository } from '@/database/postgres/PostgresFeedbackReportsRepository'
import type { PostgresClient } from '@/database/postgres/PostgresClient'
import { GetFeedbackReportController } from '../GetFeedbackReportController'

describe('Get Feedback Report Controller', () => {
  let http: Mock<Http<any>>

  beforeEach(() => {
    http = mock()
  })

  it('returns the report conversation with ordered attachments and latest message ids', async () => {
    const reportId = '11111111-1111-4111-8111-111111111111'
    const userId = '22222222-2222-4222-8222-222222222222'
    const messageIds = [
      '33333333-3333-4333-8333-333333333333',
      '44444444-4444-4444-8444-444444444444',
    ]
    const attachmentRows = [
      [],
      [
        {
          id: '66666666-6666-4666-8666-666666666666',
          storage_key: 'feedback/second.png',
          original_name: 'second.png',
          mime_type: 'image/png',
          size: '128',
          position: 1,
        },
        {
          id: '55555555-5555-4555-8555-555555555555',
          storage_key: 'feedback/first.jpg',
          original_name: 'first.jpg',
          mime_type: 'image/jpeg',
          size: 64,
          position: 0,
        },
      ],
    ]
    const reportRow = {
      id: reportId,
      content: 'I need help with a challenge',
      screenshot: null,
      intent: 'bug',
      user_id: userId,
      title: 'Challenge issue',
      status: 'open',
      created_at: '2025-02-01T10:00:00.000Z',
      last_activity_at: '2025-02-01T11:00:00.000Z',
      last_user_message_at: '2025-02-01T10:00:00.000Z',
      studio_read_at: null,
      last_admin_message_at: '2025-02-01T11:00:00.000Z',
      author_read_at: null,
      admin_message_count: 1,
      author_name: 'Alex Doe',
      author_email: 'alex@example.test',
      author_slug: 'alex-doe',
      avatar_name: 'Alex',
      avatar_image: '/images/alex.png',
      preview: 'Here is the fix',
      is_unread: true,
    }
    const messageRows = [
      {
        id: messageIds[0],
        report_id: reportId,
        author_role: 'user',
        author_id: userId,
        content: 'The challenge does not load',
        created_at: '2025-02-01T10:00:00.000Z',
      },
      {
        id: messageIds[1],
        report_id: reportId,
        author_role: 'admin',
        author_id: '77777777-7777-4777-8777-777777777777',
        content: 'Here is the fix',
        created_at: new Date('2025-02-01T11:00:00.000Z'),
      },
    ]
    const query = jest.fn(
      async (strings: TemplateStringsArray, ..._values: unknown[]) => {
        const statement = strings.join('?')
        if (statement.includes('from public.feedback_reports r')) return [reportRow]
        if (statement.includes('from public.feedback_messages')) return messageRows
        if (statement.includes('from public.feedback_message_attachments')) {
          return attachmentRows.shift() ?? []
        }
        return []
      },
    )
    const client = { query } as unknown as PostgresClient
    const useCase = new GetFeedbackReportUseCase(
      new PostgresFeedbackReportsRepository(client),
      new PostgresFeedbackMessagesRepository(client),
    )
    const controller = new GetFeedbackReportController(useCase)
    const restResponse = mock<RestResponse>()
    http.getRouteParams.mockReturnValue({ feedbackReportId: reportId })
    http.send.mockReturnValue(restResponse)

    const result = await controller.handle(http)
    const response = http.send.mock.calls[0][0]

    expect(result).toBe(restResponse)
    expect(response).toMatchObject({
      id: reportId,
      title: 'Challenge issue',
      authorEmail: 'alex@example.test',
      messages: [
        {
          id: messageIds[0],
          authorRole: 'user',
          attachments: [],
        },
        {
          id: messageIds[1],
          authorRole: 'admin',
          attachments: [
            { originalName: 'first.jpg', size: 64 },
            { originalName: 'second.png', size: 128 },
          ],
        },
      ],
      latestUserMessageId: messageIds[0],
      latestAdminMessageId: messageIds[1],
    })
    expect(query).toHaveBeenCalledTimes(4)
    expect(http.getRouteParams).toHaveBeenCalled()
  })
})
