import request from 'supertest'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import {
  AuthError,
  NotGodAccountError,
  ValidationError,
} from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'
import { FeedbackReportsFaker } from '@stardust/core/reporting/entities/fakers'

import { ENV } from '@/constants'
import { SupabaseUsersRepository } from '@/database'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { ReportingFixture } from '@/tests/fixtures/ReportingFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[DELETE] /reporting/feedback/:feedbackId', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const profileFixture = new ProfileFixture(supabaseFixture.supabase)
  const reportingFixture = new ReportingFixture(supabaseFixture.supabase)
  const usersRepository = new SupabaseUsersRepository(supabaseFixture.supabase)

  beforeAll(async () => {
    await honoFixture.setup()
  })

  beforeEach(async () => {
    ENV.godAccountIds = []
    await reportingFixture.clearFeedbackReports()
    await supabaseFixture.clearDatabase()
    await authFixture.createAccount()
    await profileFixture.createAccountUser(authFixture.getAccountId())
  })

  it('should return 401 when not authenticated', async () => {
    const response = await request(honoFixture.server).delete(
      `/reporting/feedback/${Id.create().value}`,
    )

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('should return 401 when authenticated account is not a god account', async () => {
    const response = await request(honoFixture.server)
      .delete(`/reporting/feedback/${Id.create().value}`)
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new NotGodAccountError() }),
    )
  })

  it('should return 400 when feedback id is invalid', async () => {
    ENV.godAccountIds.push(authFixture.getAccountId())

    const response = await request(honoFixture.server)
      .delete('/reporting/feedback/invalid-id')
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(response.body).toEqual(
      expect.objectContaining({
        ...new ValidationError([{ name: 'feedbackId', messages: ['Invalid uuid'] }]),
      }),
    )
  })

  it('should return 404 when feedback report does not exist', async () => {
    ENV.godAccountIds.push(authFixture.getAccountId())

    const response = await request(honoFixture.server)
      .delete(`/reporting/feedback/${Id.create().value}`)
      .set(authFixture.getAuthorizationHeader())

    expect(response.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'Relatório de feedback não encontrado',
        title: 'Not Found Error',
      }),
    )
  })

  it('should delete an existing feedback report', async () => {
    ENV.godAccountIds.push(authFixture.getAccountId())

    const user = await usersRepository.findById(Id.create(authFixture.getAccountId()))

    if (!user) {
      throw new Error('Expected a profile user to exist for the authenticated account')
    }

    const feedbackReport = await reportingFixture.createFeedbackReport(
      FeedbackReportsFaker.fakeDto({
        id: Id.create().value,
        author: {
          id: user.dto.id!,
          entity: {
            name: user.dto.name,
            slug: user.dto.slug!,
            avatar: {
              name: user.dto.avatar.entity!.name,
              image: user.dto.avatar.entity!.image,
            },
          },
        },
      }),
    )

    const currentFeedbackReports = await reportingFixture.listFeedbackReports()

    const response = await request(honoFixture.server)
      .delete(`/reporting/feedback/${feedbackReport.id}`)
      .set(authFixture.getAuthorizationHeader())

    const deletedFeedbackReport = await reportingFixture.findFeedbackReportById(
      feedbackReport.id as string,
    )

    expect(currentFeedbackReports).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: feedbackReport.id })]),
    )
    expect(response.status).toBe(HTTP_STATUS_CODE.noContent)
    expect(response.text).toBe('')
    expect(deletedFeedbackReport).toBeNull()
  })
})
