import { randomUUID } from 'node:crypto'
import request from 'supertest'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { ReportingFixture } from '@/tests/fixtures/ReportingFixture'
import { ENV } from '@/constants'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET /reporting/feedback/mine/:feedbackReportId]', () => {
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
  it('returns the owned conversation and canonical latest admin message', async () => {
    const reportId = await reporting.createReportForAuthor(auth.getAccountId())
    const message = await reporting.createAdministrativeReply(
      reportId,
      auth.getAccountId(),
    )
    const response = await request(hono.server)
      .get(`/reporting/feedback/mine/${reportId}`)
      .set(auth.getAuthorizationHeader())
    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual(
      expect.objectContaining({
        id: reportId,
        messages: [expect.objectContaining({ id: message.id, authorRole: 'admin' })],
        latestAdminMessageId: message.id,
      }),
    )
  })
  it('uses the same safe 404 for absent and another author report', async () => {
    const other = new AuthFixture(fixture.supabase)
    await other.createAccount()
    await profile.createAccountUser(other.getAccountId())
    const reportId = await reporting.createReportForAuthor(other.getAccountId())
    const absent = await request(hono.server)
      .get(`/reporting/feedback/mine/${randomUUID()}`)
      .set(auth.getAuthorizationHeader())
    const foreign = await request(hono.server)
      .get(`/reporting/feedback/mine/${reportId}`)
      .set(auth.getAuthorizationHeader())
    expect(absent.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(foreign.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(foreign.body).toEqual(absent.body)
  })
})
