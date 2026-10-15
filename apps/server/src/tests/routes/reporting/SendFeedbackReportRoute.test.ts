import request from 'supertest'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { outboxEventModel } from '@/database/drizzle/models/global/outbox-event-model'
import { feedbackReportModel } from '@/database/drizzle/models/reporting'
import { InngestBroker } from '@/queue/inngest/InngestBroker'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { ReportingFixture } from '@/tests/fixtures/ReportingFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

const enqueue = InngestBroker.prototype.publish

describe('[POST /reporting/feedback]', () => {
  const hono = new HonoFixture()
  const fixture = new SupabaseFixture()
  const auth = new AuthFixture(fixture.supabase)
  const profile = new ProfileFixture(fixture.supabase)
  const reporting = new ReportingFixture(fixture.supabase)
  const input = {
    content: 'A real HTTP feedback report with persisted content',
    intent: 'bug',
  }
  const delivery = jest.spyOn(InngestBroker.prototype, 'publish')
  let errors: jest.SpyInstance
  const send = () =>
    request(hono.server)
      .post('/reporting/feedback')
      .set(auth.getAuthorizationHeader())
      .send({ ...input, userId: 'untrusted', userName: 'untrusted' })

  beforeAll(async () => {
    await hono.setup()
    errors = jest.spyOn(console, 'error').mockImplementation(() => undefined)
  })
  afterAll(async () => {
    delivery.mockRestore()
    errors.mockRestore()
    await DrizzleClient.close()
  })
  beforeEach(async () => {
    delivery.mockReset().mockImplementation(enqueue)
    await fixture.clearDatabase()
    await auth.createAccount()
    await profile.createAccountUser(auth.getAccountId())
  })

  it('commits the verified author and durable event atomically without network delivery', async () => {
    delivery.mockImplementation(async function (this: InngestBroker, event, eventId) {
      // A separate pool query cannot see the business write before the outer commit.
      expect(await fixture.database.select().from(feedbackReportModel)).toEqual([])
      await enqueue.call(this, event, eventId)
      expect(await fixture.database.select().from(outboxEventModel)).toEqual([])
    })
    const response = await send()
    expect(response.status).toBe(HTTP_STATUS_CODE.created)
    expect(await reporting.findFeedbackReportById(response.body.id)).toEqual(
      expect.objectContaining({
        id: response.body.id,
        content: input.content,
        intent: input.intent,
        author: expect.objectContaining({ id: auth.getAccountId() }),
      }),
    )
    expect(await fixture.database.select().from(outboxEventModel)).toEqual([
      expect.objectContaining({
        status: 'pending',
        attempts: 0,
        payload: expect.objectContaining({
          feedbackReportId: response.body.id,
          feedbackReportContent: input.content,
        }),
      }),
    ])
    expect(delivery).toHaveBeenCalledTimes(1)
  })

  it.each(['anonymous', 'invalid'])(
    'rejects %s input without persistence or queued events',
    async (scenario) => {
      const call = request(hono.server).post('/reporting/feedback')
      if (scenario === 'invalid') call.set(auth.getAuthorizationHeader())
      const response = await call.send(
        scenario === 'invalid' ? { ...input, content: 'short' } : input,
      )
      expect(response.status).toBe(
        scenario === 'invalid'
          ? HTTP_STATUS_CODE.badRequest
          : HTTP_STATUS_CODE.unauthorized,
      )
      expect(await reporting.listFeedbackReports()).toEqual([])
      expect(await fixture.database.select().from(outboxEventModel)).toEqual([])
      expect(delivery).not.toHaveBeenCalled()
    },
  )

  it('rolls back the business write and inserted event when enqueue fails in a nested transaction', async () => {
    delivery.mockImplementation(async function (this: InngestBroker, event, eventId) {
      await enqueue.call(this, event, eventId)
      throw new Error('Controlled failure after event insertion')
    })
    const response = await send()
    expect(response.status).toBe(HTTP_STATUS_CODE.serverError)
    expect(await reporting.listFeedbackReports()).toEqual([])
    expect(await fixture.database.select().from(outboxEventModel)).toEqual([])
    expect(delivery).toHaveBeenCalledTimes(1)
  })

  it.each(['40001', '40P01'])(
    'retries %s once and commits only the successful callback',
    async (code) => {
      delivery.mockImplementationOnce(async function (
        this: InngestBroker,
        event,
        eventId,
      ) {
        await enqueue.call(this, event, eventId)
        throw new Error('Controlled query failure', {
          cause: Object.assign(new Error('Controlled transaction conflict'), { code }),
        })
      })
      const response = await send()
      expect(response.status).toBe(HTTP_STATUS_CODE.created)
      expect(delivery).toHaveBeenCalledTimes(2)
      expect(await reporting.listFeedbackReports()).toHaveLength(1)
      expect(await fixture.database.select().from(outboxEventModel)).toEqual([
        expect.objectContaining({
          status: 'pending',
          payload: expect.objectContaining({ feedbackReportId: response.body.id }),
        }),
      ])
    },
  )

  it('returns conflict after the second serialization failure without committing either attempt', async () => {
    delivery.mockImplementation(async function (this: InngestBroker, event, eventId) {
      await enqueue.call(this, event, eventId)
      throw Object.assign(new Error('Controlled repeated conflict'), { code: '40001' })
    })
    const response = await send()
    expect(response.status).toBe(HTTP_STATUS_CODE.conflict)
    expect(delivery).toHaveBeenCalledTimes(2)
    expect(await reporting.listFeedbackReports()).toEqual([])
    expect(await fixture.database.select().from(outboxEventModel)).toEqual([])
  })
})
