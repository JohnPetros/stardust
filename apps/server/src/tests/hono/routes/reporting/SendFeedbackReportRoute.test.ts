import request from 'supertest'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { InngestBroker } from '@/queue/inngest/InngestBroker'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { ReportingFixture } from '@/tests/fixtures/ReportingFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

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

  beforeAll(async () => {
    await hono.setup()
  })
  afterAll(async () => {
    delivery.mockRestore()
    await DrizzleClient.close()
  })
  beforeEach(async () => {
    delivery.mockReset().mockResolvedValue(undefined)
    await fixture.clearDatabase()
    await auth.createAccount()
    await profile.createAccountUser(auth.getAccountId())
  })

  it('persists the verified author and publishes only after commit', async () => {
    delivery.mockImplementation(async () => {
      const reports = await reporting.listFeedbackReports()
      expect(reports).toHaveLength(1)
      expect(reports[0]).toEqual(
        expect.objectContaining({
          content: input.content,
          author: expect.objectContaining({ id: auth.getAccountId() }),
        }),
      )
    })
    const response = await request(hono.server)
      .post('/reporting/feedback')
      .set(auth.getAuthorizationHeader())
      .send({ ...input, userId: 'untrusted', userName: 'untrusted' })
    expect(response.status).toBe(HTTP_STATUS_CODE.created)
    const persisted = await reporting.findFeedbackReportById(response.body.id)
    expect(persisted).toEqual(
      expect.objectContaining({
        id: response.body.id,
        content: input.content,
        intent: input.intent,
        author: expect.objectContaining({ id: auth.getAccountId() }),
      }),
    )
    expect(delivery).toHaveBeenCalledTimes(1)
    expect(delivery.mock.calls[0][0].payload).toEqual(
      expect.objectContaining({
        feedbackReportId: response.body.id,
        feedbackReportContent: input.content,
      }),
    )
  })

  it.each(['anonymous', 'invalid'])(
    'rejects %s input without persistence or publication',
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
      expect(delivery).not.toHaveBeenCalled()
    },
  )

  it('retains committed data when external publication fails', async () => {
    delivery.mockRejectedValue(new Error('Controlled external delivery failure'))
    const response = await request(hono.server)
      .post('/reporting/feedback')
      .set(auth.getAuthorizationHeader())
      .send(input)
    expect(response.status).toBe(HTTP_STATUS_CODE.serverError)
    const reports = await reporting.listFeedbackReports()
    expect(reports).toHaveLength(1)
    expect(reports[0].content).toBe(input.content)
    expect(delivery).toHaveBeenCalledTimes(1)
  })
})
