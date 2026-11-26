import request from 'supertest'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { ENV } from '@/constants'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { ReportingFixture } from '@/tests/fixtures/ReportingFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[PUT /reporting/feedback/:feedbackReportId/read]', () => {
  const hono = new HonoFixture()
  const fixture = new SupabaseFixture()
  const auth = new AuthFixture(fixture.supabase)
  const profile = new ProfileFixture(fixture.supabase)
  const reporting = new ReportingFixture(fixture.supabase)
  const configuredGodAccounts = [...ENV.godAccountIds]
  beforeAll(async () => {
    await hono.setup()
  })
  afterAll(async () => {
    ENV.godAccountIds = configuredGodAccounts
    await DrizzleClient.close()
  })
  beforeEach(async () => {
    ENV.godAccountIds = []
    await fixture.clearDatabase()
    await auth.createAccount()
    await profile.createAccountUser(auth.getAccountId())
  })
  it('denies a non-God account without changing the read marker', async () => {
    const reportId = await reporting.createReportForAuthor(auth.getAccountId())
    const message = await reporting.createUserReply(reportId, auth.getAccountId())
    const before = await reporting.findFeedbackReportById(reportId)
    expect(before).not.toBeNull()
    const response = await request(hono.server)
      .put(`/reporting/feedback/${reportId}/read`)
      .set(auth.getAuthorizationHeader())
      .send({ lastSeenUserMessageId: message.id })
    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    const after = await reporting.findFeedbackReportById(reportId)
    expect(after).not.toBeNull()
    expect(after?.studioReadAt).toBe(before?.studioReadAt)
  })
  it('persists the observed user-message timestamp for a verified God account', async () => {
    const reportId = await reporting.createReportForAuthor(auth.getAccountId())
    const message = await reporting.createUserReply(reportId, auth.getAccountId())
    ENV.godAccountIds = [auth.getAccountId()]
    const response = await request(hono.server)
      .put(`/reporting/feedback/${reportId}/read`)
      .set(auth.getAuthorizationHeader())
      .send({ lastSeenUserMessageId: message.id })
    expect(response.status).toBe(HTTP_STATUS_CODE.noContent)
    expect(response.text).toBe('')
    expect((await reporting.findFeedbackReportById(reportId))?.studioReadAt).toBe(
      message.createdAt.toISOString(),
    )
  })
})
