import request from 'supertest'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { ENV } from '@/constants'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { ReportingFixture } from '@/tests/fixtures/ReportingFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET /reporting/feedback]', () => {
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
  it('rejects anonymous and authenticated non-God list access', async () => {
    expect((await request(hono.server).get('/reporting/feedback')).status).toBe(
      HTTP_STATUS_CODE.unauthorized,
    )
    expect(
      (
        await request(hono.server)
          .get('/reporting/feedback')
          .set(auth.getAuthorizationHeader())
      ).status,
    ).toBe(HTTP_STATUS_CODE.unauthorized)
  })
  it('returns the persisted queue to a verified God account', async () => {
    const reportId = await reporting.createReportForAuthor(auth.getAccountId())
    ENV.godAccountIds = [auth.getAccountId()]
    const response = await request(hono.server)
      .get('/reporting/feedback?page=1&itemsPerPage=10')
      .set(auth.getAuthorizationHeader())
    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body.items).toEqual([
      expect.objectContaining({ id: reportId, title: 'Persisted report' }),
    ])
  })
})
