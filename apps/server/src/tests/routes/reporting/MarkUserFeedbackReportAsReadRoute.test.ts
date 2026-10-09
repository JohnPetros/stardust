import request from 'supertest'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { ReportingFixture } from '@/tests/fixtures/ReportingFixture'
import { eq } from 'drizzle-orm'
import { ENV } from '@/constants'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { feedbackReportModel } from '@/database/drizzle/models/reporting'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[PUT /reporting/feedback/mine/:feedbackReportId/read]', () => {
  const hono = new HonoFixture()
  const fixture = new SupabaseFixture()
  const auth = new AuthFixture(fixture.supabase)
  const profile = new ProfileFixture(fixture.supabase)
  const reporting = new ReportingFixture(fixture.supabase)
  beforeAll(async () => {
    await hono.setup()
  })
  afterAll(async () => {
    await DrizzleClient.close()
  })
  beforeEach(async () => {
    ENV.godAccountIds = []
    await fixture.clearDatabase()
    await auth.createAccount()
    await profile.createAccountUser(auth.getAccountId())
  })
  it('persists only the observed admin message read timestamp', async () => {
    const reportId = await reporting.createReportForAuthor(auth.getAccountId())
    const message = await reporting.createAdministrativeReply(
      reportId,
      auth.getAccountId(),
    )
    const response = await request(hono.server)
      .put(`/reporting/feedback/mine/${reportId}/read`)
      .set(auth.getAuthorizationHeader())
      .send({ lastSeenMessageId: message.id })
    expect(response.status).toBe(HTTP_STATUS_CODE.noContent)
    expect(response.text).toBe('')
    const [report] = await fixture.database
      .select()
      .from(feedbackReportModel)
      .where(eq(feedbackReportModel.id, reportId))
    expect(report.authorReadAt?.toISOString()).toBe(message.createdAt.toISOString())
  })
  it('cannot mark another author report read', async () => {
    const other = new AuthFixture(fixture.supabase)
    await other.createAccount()
    await profile.createAccountUser(other.getAccountId())
    const reportId = await reporting.createReportForAuthor(other.getAccountId())
    const message = await reporting.createAdministrativeReply(
      reportId,
      auth.getAccountId(),
    )
    const response = await request(hono.server)
      .put(`/reporting/feedback/mine/${reportId}/read`)
      .set(auth.getAuthorizationHeader())
      .send({ lastSeenMessageId: message.id })
    expect(response.status).toBe(HTTP_STATUS_CODE.notFound)
    const [report] = await fixture.database
      .select()
      .from(feedbackReportModel)
      .where(eq(feedbackReportModel.id, reportId))
    expect(report.authorReadAt).toBeNull()
  })
})
