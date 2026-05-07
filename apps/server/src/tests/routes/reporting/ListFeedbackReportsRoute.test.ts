import request from 'supertest'

import { HTTP_HEADERS, HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import {
  AuthError,
  NotGodAccountError,
  ValidationError,
} from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'
import { FeedbackReportsFaker } from '@stardust/core/reporting/entities/fakers'

import { ENV } from '@/constants'
import { SupabaseUsersRepository } from '@/database'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { ReportingFixture } from '@/tests/fixtures/ReportingFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /reporting/feedback', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const profileFixture = new ProfileFixture(supabaseFixture.supabase)
  const reportingFixture = new ReportingFixture(supabaseFixture.supabase)
  const usersRepository = new SupabaseUsersRepository(supabaseFixture.supabase)

  beforeAll(async () => {
    await honoFixture.setup()
  })

  beforeEach(async () => {
    ENV.godAccountIds = []
    await reportingFixture.clearFeedbackReports()
    await supabaseFixture.clearDatabase()
    await authFixture.createAccount()
    await profileFixture.createAccountUser(authFixture.getAccountId())
  })

  it('should return 401 when not authenticated', async () => {
    const response = await request(honoFixture.server).get('/reporting/feedback')

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 401 when authenticated account is not a god account', async () => {
    const response = await request(honoFixture.server)
      .get('/reporting/feedback')
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new NotGodAccountError() }),
    )
  })

  it('should return 400 when page is invalid', async () => {
    ENV.godAccountIds.push(authFixture.getAccountId())

    const response = await request(honoFixture.server)
      .get('/reporting/feedback?page=0')
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([
          {
            name: 'page',
            messages: ['Number must be greater than or equal to 1'],
          },
        ]),
      }),
    )
  })

  it('should return a filtered paginated list of feedback reports', async () => {
    ENV.godAccountIds.push(authFixture.getAccountId())

    const user = await usersRepository.findById(Id.create(authFixture.getAccountId()))

    if (!user) {
      throw new Error('Expected a profile user to exist for the authenticated account')
    }

    const author = {
      id: user.dto.id!,
      entity: {
        name: user.dto.name,
        slug: user.dto.slug!,
        avatar: {
          name: user.dto.avatar.entity!.name,
          image: user.dto.avatar.entity!.image,
        },
      },
    }

    const expectedReport = FeedbackReportsFaker.fakeDto({
      author,
      intent: 'bug',
      sentAt: '2024-01-10T12:00:00.000Z',
    })
    const ignoredReport = FeedbackReportsFaker.fakeDto({
      author,
      intent: 'idea',
      sentAt: '2024-01-05T12:00:00.000Z',
    })

    await reportingFixture.createFeedbackReports([ignoredReport, expectedReport])

    const response = await request(honoFixture.server)
      .get(
        `/reporting/feedback?page=1&itemsPerPage=10&authorName=${encodeURIComponent(user.dto.name)}&intent=bug&startDate=2024-01-09&endDate=2024-01-11`,
      )
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.headers[HTTP_HEADERS.xPaginationResponse.toLowerCase()]).toBe('true')
    expect(response.headers[HTTP_HEADERS.xTotalItemsCount.toLowerCase()]).toBe('1')
    expect(response.headers[HTTP_HEADERS.xTotalPagesCount.toLowerCase()]).toBe('1')
    expect(response.headers[HTTP_HEADERS.xItemsPerPage.toLowerCase()]).toBe('10')
    expect(response.headers[HTTP_HEADERS.xPage.toLowerCase()]).toBe('1')
    expect(response.body).toEqual([expect.objectContaining(expectedReport)])
  })
})
