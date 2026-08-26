import { AccountsFaker } from '../../../../../../packages/core/src/auth/domain/entities/fakers'
import { UsersFaker } from '../../../../../../packages/core/src/profile/domain/entities/fakers'
import type { AuthFixture } from './AuthFixture'
import type { ServerAppFixture } from './ServerAppFixture'
import type { ServerMockRoute } from '../shared/types/ServerMockRoute'

const USER_ID = '00000000-0000-4000-8000-000000000201'
export const REPORT_ID = '00000000-0000-4000-8000-000000000202'
const ADMIN_MESSAGE_ID = '00000000-0000-4000-8000-000000000203'

export type ReportingFixtures = ReturnType<ReportingFixture['create']>

export class ReportingFixture {
  constructor(
    private readonly serverApp: ServerAppFixture,
    private readonly auth: AuthFixture,
  ) {}

  create() {
    const account = AccountsFaker.fakeDto({
      id: USER_ID,
      name: 'Explorador de feedback',
      email: 'feedback@stardust.dev',
      isAuthenticated: true,
    })
    const user = UsersFaker.fakeDto({
      id: USER_ID,
      name: account.name,
      email: account.email,
      slug: 'explorador-de-feedback',
      lastWeekRankingPosition: null,
    })
    const author = {
      id: USER_ID,
      entity: {
        name: account.name,
        slug: 'explorador-de-feedback',
        avatar: { name: 'Avatar', image: '/images/profile.svg' },
      },
    }
    const report = {
      id: REPORT_ID,
      content: 'Um relato de teste com conteúdo suficiente.',
      title: 'Um relato de teste',
      intent: 'bug',
      author,
      status: 'open' as const,
      createdAt: '2026-08-06T12:00:00.000Z',
      lastActivityAt: '2026-08-06T12:05:00.000Z',
      hasUnreadAdminReply: true,
      preview: 'Resposta administrativa disponível.',
    }
    const detail = {
      ...report,
      latestAdminMessageId: ADMIN_MESSAGE_ID,
      messages: [
        {
          id: ADMIN_MESSAGE_ID,
          reportId: REPORT_ID,
          authorRole: 'admin' as const,
          authorId: '00000000-0000-4000-8000-000000000299',
          content: 'Resposta administrativa de teste.',
          createdAt: '2026-08-06T12:05:00.000Z',
          attachments: [],
        },
      ],
    }

    return { account, user, report, detail }
  }

  routes(): ServerMockRoute[] {
    const { account, user, report, detail } = this.create()

    return [
      { method: 'GET', path: '/auth/account', status: 200, body: account },
      { method: 'GET', path: `/profile/users/id/${USER_ID}`, status: 200, body: user },
      { method: 'GET', path: '/profile/achievements', status: 200, body: [] },
      {
        method: 'POST',
        path: `/profile/achievements/${USER_ID}/observe`,
        status: 200,
        body: [],
      },
      { method: 'GET', path: '/space/planets', status: 200, body: [] },
      {
        method: 'GET',
        path: '/reporting/feedback/mine/unread-count',
        status: 200,
        body: { count: 1 },
      },
      {
        method: 'GET',
        path: '/reporting/feedback/mine',
        status: 200,
        body: { page: 1, itemsPerPage: 10, total: 1, items: [report] },
      },
      {
        method: 'GET',
        path: `/reporting/feedback/mine/${REPORT_ID}`,
        status: 200,
        body: detail,
      },
      {
        method: 'PUT',
        path: `/reporting/feedback/mine/${REPORT_ID}/read`,
        status: 204,
        body: null,
      },
      {
        method: 'POST',
        path: '/reporting/feedback',
        status: 201,
        body: { ...report, id: '00000000-0000-4000-8000-000000000204' },
      },
      {
        method: 'POST',
        path: '/reporting/feedback/attachments/signed-upload-url',
        status: 200,
        body: {
          url: 'https://storage.example.com/feedback-upload',
          folderPath: 'images/feedback-reports',
          fileName: 'feedback-upload.jpg',
        },
      },
      {
        method: 'POST',
        path: `/reporting/feedback/${REPORT_ID}/messages`,
        status: 201,
        body: {
          report,
          message: {
            id: '00000000-0000-4000-8000-000000000205',
            reportId: REPORT_ID,
            authorRole: 'user',
            authorId: USER_ID,
            content: 'Resposta criada pelo teste autenticado.',
            attachments: [],
          },
          isDuplicate: false,
        },
      },
    ]
  }

  async register() {
    const fixtures = this.create()

    await this.auth.authenticate('feedback-dialog-test-token')
    await this.serverApp.register(this.routes())

    return fixtures
  }
}
