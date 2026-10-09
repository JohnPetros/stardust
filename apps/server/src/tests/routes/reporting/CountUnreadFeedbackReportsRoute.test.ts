import request from 'supertest'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { ReportingFixture } from '@/tests/fixtures/ReportingFixture'
import { ENV } from '@/constants'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET /reporting/feedback/mine/unread-count]', () => {
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
  it('rejects anonymous unread counts', async () => {
    expect(
      (await request(hono.server).get('/reporting/feedback/mine/unread-count')).status,
    ).toBe(HTTP_STATUS_CODE.unauthorized)
  })
  it('counts each owned unread report once and excludes another author', async () => {
    const id = await reporting.createReportForAuthor(auth.getAccountId())
    await reporting.createAdministrativeReply(id, auth.getAccountId())
    await reporting.createAdministrativeReply(id, auth.getAccountId())
    const other = new AuthFixture(fixture.supabase)
    await other.createAccount()
    await profile.createAccountUser(other.getAccountId())
    await reporting.createAdministrativeReply(
      await reporting.createReportForAuthor(other.getAccountId()),
      auth.getAccountId(),
    )
    const response = await request(hono.server)
      .get('/reporting/feedback/mine/unread-count')
      .set(auth.getAuthorizationHeader())
    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual({ count: 1 })
  })
})
