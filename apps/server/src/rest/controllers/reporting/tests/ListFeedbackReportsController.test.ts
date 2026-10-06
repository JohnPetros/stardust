import { mock, type Mock } from 'ts-jest-mocker'
import type { Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import { ListFeedbackReportsUseCase } from '@stardust/core/reporting/use-cases'
import { FeedbackReportsFaker } from '@stardust/core/reporting/entities/fakers'
import { PostgresFeedbackReportsRepository } from '@/database/postgres/PostgresFeedbackReportsRepository'
import type { PostgresClient } from '@/database/postgres/PostgresClient'
import { ListFeedbackReportsController } from '../ListFeedbackReportsController'

type QueryCall = { statement: string; values: unknown[] }

function createPostgresClient(
  listRows: Record<string, unknown>[],
  summary: Record<string, unknown>,
) {
  const calls: QueryCall[] = []
  const query = jest.fn(async (strings: TemplateStringsArray, ...values: unknown[]) => {
    const statement = strings.join('?')
    calls.push({ statement, values })
    return statement.includes('with filtered as') ? listRows : [summary]
  })

  return {
    client: { query } as unknown as PostgresClient,
    calls,
  }
}

describe('List Feedback Reports Controller', () => {
  let http: Mock<Http<any>>
  let useCase: Mock<ListFeedbackReportsUseCase>
  let controller: ListFeedbackReportsController

  beforeEach(() => {
    http = mock()
    useCase = mock()
    controller = new ListFeedbackReportsController(useCase)
  })

  it('should call the use case with default parameters', async () => {
    const dtos = [FeedbackReportsFaker.fakeDto()]
    const paginationResponse = {
      items: dtos,
      page: 1,
      itemsPerPage: 10,
      total: 1,
      summary: { total: 1, open: 1, closed: 0, unread: 0 },
    }
    const restResponse = mock<RestResponse>()

    http.getQueryParams.mockReturnValue({})
    useCase.execute.mockResolvedValue(paginationResponse)
    http.send.mockReturnValue(restResponse)

    const result = await controller.handle(http)

    expect(useCase.execute).toHaveBeenCalledWith({
      page: 1,
      itemsPerPage: 10,
      authorName: undefined,
      intent: undefined,
      sentAtStartDate: undefined,
      sentAtEndDate: undefined,
    })
    expect(http.send).toHaveBeenCalledWith(paginationResponse)
    expect(result).toBe(restResponse)
  })

  it('should call the use case with provided parameters', async () => {
    const params = {
      page: 2,
      itemsPerPage: 20,
      authorName: 'John Doe',
      intent: 'bug' as const,
      startDate: '2023-01-01',
      endDate: '2023-01-31',
    }
    const dtos = [FeedbackReportsFaker.fakeDto()]
    const paginationResponse = {
      items: dtos,
      page: 2,
      itemsPerPage: 20,
      total: 1,
      summary: { total: 1, open: 1, closed: 0, unread: 0 },
    }
    const restResponse = mock<RestResponse>()

    http.getQueryParams.mockReturnValue(params)
    useCase.execute.mockResolvedValue(paginationResponse)
    http.send.mockReturnValue(restResponse)

    const result = await controller.handle(http)

    expect(useCase.execute).toHaveBeenCalledWith({
      page: params.page,
      itemsPerPage: params.itemsPerPage,
      search: params.authorName,
      intent: params.intent,
      status: undefined,
      sentAtStartDate: params.startDate,
      sentAtEndDate: params.endDate,
    })
    expect(http.send).toHaveBeenCalledWith(paginationResponse)
    expect(result).toBe(restResponse)
  })

  it('returns filtered persisted feedback with author and summary data', async () => {
    const rows = [
      {
        id: '11111111-1111-4111-8111-111111111111',
        content: 'The editor did not save my work',
        screenshot: null,
        intent: 'bug',
        user_id: '22222222-2222-4222-8222-222222222222',
        title: 'Editor did not save',
        status: 'open',
        created_at: new Date('2025-01-12T10:00:00.000Z'),
        last_activity_at: '2025-01-12T10:10:00.000Z',
        last_user_message_at: '2025-01-12T10:10:00.000Z',
        studio_read_at: null,
        last_admin_message_at: null,
        author_read_at: null,
        admin_message_count: '0',
        author_name: 'A',
        author_email: 'alex@example.test',
        author_slug: '',
        avatar_name: null,
        avatar_image: 'https://cdn.example.test/avatar.webp',
        preview: 'The latest user message',
        is_unread: true,
        total_count: '24',
      },
      {
        id: '33333333-3333-4333-8333-333333333333',
        content: 'An idea for lessons',
        screenshot: '/images/feedback.png',
        intent: 'idea',
        user_id: '44444444-4444-4444-8444-444444444444',
        title: 'More examples',
        status: 'closed',
        created_at: '2025-01-10T10:00:00.000Z',
        last_activity_at: '2025-01-10T11:00:00.000Z',
        last_user_message_at: null,
        studio_read_at: null,
        last_admin_message_at: null,
        author_read_at: null,
        admin_message_count: 1,
        author_name: 'Sam Lee',
        author_email: 'sam@example.test',
        author_slug: 'sam-lee',
        avatar_name: 'Sam',
        avatar_image: '/images/sam.png',
        preview: 'Thanks for the idea',
        is_unread: false,
        total_count: '24',
      },
    ]
    const summary = {
      summary_total: '40',
      summary_open: '29',
      summary_closed: '11',
      summary_unread: '3',
      filtered_total: '24',
    }
    const { client, calls } = createPostgresClient(rows, summary)
    const useCase = new ListFeedbackReportsUseCase(
      new PostgresFeedbackReportsRepository(client),
    )
    const controller = new ListFeedbackReportsController(useCase)
    const restResponse = mock<RestResponse>()
    http.getQueryParams.mockReturnValue({
      page: 2,
      itemsPerPage: 10,
      search: 'alex@example.test',
      status: 'open',
      intent: 'bug',
      createdAtStartDate: '2025-01-01',
      createdAtEndDate: '2025-01-31',
    })
    http.send.mockReturnValue(restResponse)

    const result = await controller.handle(http)
    const page = http.send.mock.calls[0][0]

    expect(result).toBe(restResponse)
    expect(page).toMatchObject({
      page: 2,
      itemsPerPage: 10,
      total: 24,
      summary: { total: 40, open: 29, closed: 11, unread: 3 },
      items: [
        {
          id: rows[0].id,
          title: 'Editor did not save',
          author: {
            entity: {
              name: 'Você',
              slug: 'voce',
              avatar: { name: 'Você', image: '/images/profile.svg' },
            },
          },
          authorEmail: 'alex@example.test',
          preview: 'The latest user message',
          isUnread: true,
        },
        {
          id: rows[1].id,
          screenshot: '/images/feedback.png',
          author: {
            entity: {
              name: 'Sam Lee',
              slug: 'sam-lee',
              avatar: { name: 'Sam', image: '/images/sam.png' },
            },
          },
        },
      ],
    })
    expect(calls).toHaveLength(2)
    expect(calls.every(({ values }) => values.includes('alex@example.test'))).toBe(true)
    expect(calls.every(({ values }) => values.includes('open'))).toBe(true)
  })

  it('keeps the filtered total when the requested page is empty', async () => {
    const { client } = createPostgresClient([], {
      summary_total: 40,
      summary_open: 29,
      summary_closed: 11,
      summary_unread: 3,
      filtered_total: 24,
    })
    const useCase = new ListFeedbackReportsUseCase(
      new PostgresFeedbackReportsRepository(client),
    )
    const controller = new ListFeedbackReportsController(useCase)
    http.getQueryParams.mockReturnValue({ page: 4, itemsPerPage: 10 })
    http.send.mockReturnValue(mock<RestResponse>())

    await controller.handle(http)

    expect(http.send).toHaveBeenCalledWith(
      expect.objectContaining({ page: 4, itemsPerPage: 10, total: 24, items: [] }),
    )
  })
})
