import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError, ValidationError } from '@stardust/core/global/errors'
import { FeedbackReportsFaker } from '@stardust/core/reporting/entities/fakers'

import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { ReportingFixture } from '@/tests/fixtures/ReportingFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[POST] /reporting/feedback', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const profileFixture = new ProfileFixture(supabaseFixture.supabase)
  const reportingFixture = new ReportingFixture(supabaseFixture.supabase)

  beforeAll(async () => {
    await honoFixture.setup()
  })

  beforeEach(async () => {
    await reportingFixture.clearFeedbackReports()
    await supabaseFixture.clearDatabase()
    await authFixture.createAccount()
    await profileFixture.createAccountUser(authFixture.getAccountId())
  })

  it('should return 401 when not authenticated', async () => {
    const response = await request(honoFixture.server)
      .post('/reporting/feedback')
      .send(FeedbackReportsFaker.fakeDto())

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 400 when payload is invalid', async () => {
    const response = await request(honoFixture.server)
      .post('/reporting/feedback')
      .set(authFixture.getAuthorizationHeader())
      .send({
        ...FeedbackReportsFaker.fakeDto(),
        content: '',
      })

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([
          {
            name: 'content',
            messages: ['String must contain at least 1 character(s)'],
          },
        ]),
      }),
    )
  })

  it('should send a feedback report and persist it', async () => {
    const feedbackReport = FeedbackReportsFaker.fakeDto()
    const payload = {
      content: feedbackReport.content,
      intent: feedbackReport.intent,
      screenshot: feedbackReport.screenshot,
    }

    const response = await request(honoFixture.server)
      .post('/reporting/feedback')
      .set(authFixture.getAuthorizationHeader())
      .send(payload)

    const persistedReport = await reportingFixture.findFeedbackReportById(
      response.body.id,
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.created)
    expect(response.body).toEqual(
      expect.objectContaining({
        content: payload.content,
        intent: payload.intent,
        screenshot: payload.screenshot,
        id: expect.any(String),
        sentAt: expect.any(String),
        author: expect.objectContaining({
          id: authFixture.getAccountId(),
        }),
      }),
    )
    expect(persistedReport).toEqual(response.body)
  })
})
