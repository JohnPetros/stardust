import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import request from 'supertest'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { ENV } from '@/constants'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { outboxEventModel } from '@/database/drizzle/models/global/outbox-event-model'
import { feedbackReportModel } from '@/database/drizzle/models/reporting'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { ReportingFixture } from '@/tests/fixtures/ReportingFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'
import { InngestBroker } from '@/queue/inngest/InngestBroker'

const enqueue = InngestBroker.prototype.publish

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
    delivery.mockReset().mockImplementation(enqueue)
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
    delivery.mockImplementation(async function (this: InngestBroker, event, eventId) {
      const rows = await fixture.database
        .select()
        .from(feedbackReportModel)
        .where(eq(feedbackReportModel.id, id))
      states.push(rows[0].status)
      await enqueue.call(this, event, eventId)
    })
    const closed = await change(id, 'closed', 'open')
    expect(closed.status).toBe(HTTP_STATUS_CODE.ok)
    expect(closed.body).toEqual(expect.objectContaining({ id, status: 'closed' }))
    expect((await reporting.findFeedbackReportById(id))?.status).toBe('closed')
    const reopened = await change(id, 'open', 'closed')
    expect(reopened.status).toBe(HTTP_STATUS_CODE.ok)
    expect(reopened.body).toEqual(expect.objectContaining({ id, status: 'open' }))
    expect((await reporting.findFeedbackReportById(id))?.status).toBe('open')
    // A separate connection still sees the prior committed state during enqueue.
    expect(states).toEqual(['open', 'closed'])
    expect(delivery.mock.calls.map(([event]) => event.name)).toEqual([
      'feedback.report.closed',
      'feedback.report.reopened',
    ])
    const events = await fixture.database
      .select()
      .from(outboxEventModel)
      .orderBy(outboxEventModel.sequence)
    expect(events).toEqual([
      expect.objectContaining({ eventName: 'feedback.report.closed', status: 'pending' }),
      expect.objectContaining({
        eventName: 'feedback.report.reopened',
        status: 'pending',
      }),
    ])
    expect(new Set(events.map((event) => event.id)).size).toBe(2)
  })
  it('rolls back status and the inserted event when durable enqueue fails', async () => {
    const id = await reporting.createReportForAuthor(auth.getAccountId())
    await reporting.createAdministrativeReply(id, auth.getAccountId())
    ENV.godAccountIds = [auth.getAccountId()]
    delivery.mockImplementation(async function (this: InngestBroker, event, eventId) {
      await enqueue.call(this, event, eventId)
      throw new Error('Controlled status enqueue failure')
    })
    const errors = jest.spyOn(console, 'error').mockImplementation(() => undefined)
    try {
      expect((await change(id, 'closed', 'open')).status).toBe(
        HTTP_STATUS_CODE.serverError,
      )
      expect((await reporting.findFeedbackReportById(id))?.status).toBe('open')
      expect(await fixture.database.select().from(outboxEventModel)).toEqual([])
    } finally {
      errors.mockRestore()
    }
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
