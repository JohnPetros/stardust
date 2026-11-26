import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import request from 'supertest'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { ENV } from '@/constants'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { feedbackReportModel } from '@/database/drizzle/models/reporting'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { ReportingFixture } from '@/tests/fixtures/ReportingFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'
import { InngestBroker } from '@/queue/inngest/InngestBroker'

describe('[PATCH /reporting/feedback/:feedbackReportId/status]', () => {
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

  const delivery = jest.spyOn(InngestBroker.prototype, 'publish')
  beforeEach(() => {
    delivery.mockReset().mockResolvedValue(undefined)
  })
  afterAll(() => {
    delivery.mockRestore()
  })
  const change = (id: string, status: string, expectedStatus: string) =>
    request(hono.server)
      .patch(`/reporting/feedback/${id}/status`)
      .set(auth.getAuthorizationHeader())
      .send({ status, expectedStatus })
  it('allows verified God to close and reopen with committed state and ordered events', async () => {
    const id = await reporting.createReportForAuthor(auth.getAccountId())
    await reporting.createAdministrativeReply(id, auth.getAccountId())
    ENV.godAccountIds = [auth.getAccountId()]
    const states: string[] = []
    delivery.mockImplementation(async () => {
      const rows = await fixture.database
        .select()
        .from(feedbackReportModel)
        .where(eq(feedbackReportModel.id, id))
      states.push(rows[0].status)
    })
    const closed = await change(id, 'closed', 'open')
    expect(closed.status).toBe(HTTP_STATUS_CODE.ok)
    expect(closed.body).toEqual(expect.objectContaining({ id, status: 'closed' }))
    expect((await reporting.findFeedbackReportById(id))?.status).toBe('closed')
    const reopened = await change(id, 'open', 'closed')
    expect(reopened.status).toBe(HTTP_STATUS_CODE.ok)
    expect(reopened.body).toEqual(expect.objectContaining({ id, status: 'open' }))
    expect((await reporting.findFeedbackReportById(id))?.status).toBe('open')
    expect(states).toEqual(['closed', 'open'])
    expect(delivery.mock.calls.map(([event]) => event.name)).toEqual([
      'feedback.report.closed',
      'feedback.report.reopened',
    ])
  })
  it('rejects stale expected status without changing persisted state or publishing', async () => {
    const id = await reporting.createReportForAuthor(auth.getAccountId())
    ENV.godAccountIds = [auth.getAccountId()]
    const before = await fixture.database
      .select()
      .from(feedbackReportModel)
      .where(eq(feedbackReportModel.id, id))
    const response = await change(id, 'open', 'closed')
    expect(response.status).toBe(HTTP_STATUS_CODE.conflict)
    expect(
      await fixture.database
        .select()
        .from(feedbackReportModel)
        .where(eq(feedbackReportModel.id, id)),
    ).toEqual(before)
    expect(delivery).not.toHaveBeenCalled()
  })
  it('rejects anonymous and non-God callers with no mutation', async () => {
    const id = await reporting.createReportForAuthor(auth.getAccountId())
    const before = await fixture.database
      .select()
      .from(feedbackReportModel)
      .where(eq(feedbackReportModel.id, id))
    const anonymous = await request(hono.server)
      .patch(`/reporting/feedback/${id}/status`)
      .send({ status: 'closed', expectedStatus: 'open' })
    const denied = await change(id, 'closed', 'open')
    expect(anonymous.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(denied.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(
      await fixture.database
        .select()
        .from(feedbackReportModel)
        .where(eq(feedbackReportModel.id, id)),
    ).toEqual(before)
    expect(delivery).not.toHaveBeenCalled()
  })
  it('rejects invalid statuses and absent reports', async () => {
    ENV.godAccountIds = [auth.getAccountId()]
    expect((await change(randomUUID(), 'invalid', 'open')).status).toBe(
      HTTP_STATUS_CODE.badRequest,
    )
    expect((await change(randomUUID(), 'closed', 'open')).status).toBe(
      HTTP_STATUS_CODE.notFound,
    )
    expect(delivery).not.toHaveBeenCalled()
  })
})
