import request from 'supertest'
import { randomUUID } from 'node:crypto'

import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError, ConflictError } from '@stardust/core/global/errors'

import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('authenticated user feedback routes', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const profileFixture = new ProfileFixture(supabaseFixture.supabase)

  beforeAll(async () => {
    await honoFixture.setup()
  })

  beforeEach(async () => {
    await supabaseFixture.clearDatabase()
    await authFixture.createAccount()
    await profileFixture.createAccountUser(authFixture.getAccountId())
  })

  async function createReport(
    overrides: { status?: 'open' | 'closed'; lastAdminMessageAt?: string } = {},
  ) {
    const id = randomUUID()
    const now = new Date().toISOString()
    const { error } = await supabaseFixture.supabase.from('feedback_reports').insert({
      id,
      content: 'A persisted report for route testing',
      intent: 'bug',
      user_id: authFixture.getAccountId(),
      title: 'Persisted report',
      status: overrides.status ?? 'open',
      created_at: now,
      last_activity_at: now,
      last_admin_message_at: overrides.lastAdminMessageAt ?? null,
    })
    if (error) throw error
    return id
  }

  async function createAdminMessage(reportId: string) {
    const id = randomUUID()
    const createdAt = new Date(Date.now() - 1000).toISOString()
    const { error } = await supabaseFixture.supabase.from('feedback_messages').insert({
      id,
      report_id: reportId,
      author_role: 'admin',
      author_id: authFixture.getAccountId(),
      content: 'A canonical administrative reply',
      created_at: createdAt,
    })
    if (error) throw error
    await supabaseFixture.supabase
      .from('feedback_reports')
      .update({ last_admin_message_at: createdAt })
      .eq('id', reportId)
    return { id, createdAt }
  }

  it('rejects the history without an authenticated session', async () => {
    const response = await request(honoFixture.server).get('/reporting/feedback/mine')

    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new AuthError('Conta não autorizada') }),
    )
  })

  it('lists only the authenticated author reports and counts each unread report once', async () => {
    const reportId = await createReport()
    await createAdminMessage(reportId)

    const listResponse = await request(honoFixture.server)
      .get('/reporting/feedback/mine?status=open&page=1&itemsPerPage=10')
      .set(authFixture.getAuthorizationHeader())
    const countResponse = await request(honoFixture.server)
      .get('/reporting/feedback/mine/unread-count')
      .set(authFixture.getAuthorizationHeader())

    expect(listResponse.status).toBe(HTTP_STATUS_CODE.ok)
    expect(listResponse.body).toEqual(
      expect.objectContaining({
        page: 1,
        itemsPerPage: 10,
        total: 1,
        items: [expect.objectContaining({ id: reportId, hasUnreadAdminReply: true })],
      }),
    )
    expect(countResponse.status).toBe(HTTP_STATUS_CODE.ok)
    expect(countResponse.body).toEqual({ count: 1 })
  })

  it('returns the private conversation and marks only the observed admin message read', async () => {
    const reportId = await createReport()
    const message = await createAdminMessage(reportId)

    const detailResponse = await request(honoFixture.server)
      .get(`/reporting/feedback/mine/${reportId}`)
      .set(authFixture.getAuthorizationHeader())
    const readResponse = await request(honoFixture.server)
      .put(`/reporting/feedback/mine/${reportId}/read`)
      .set(authFixture.getAuthorizationHeader())
      .send({ lastSeenMessageId: message.id })

    expect(detailResponse.status).toBe(HTTP_STATUS_CODE.ok)
    expect(detailResponse.body).toEqual(
      expect.objectContaining({
        id: reportId,
        messages: [expect.objectContaining({ id: message.id, authorRole: 'admin' })],
        latestAdminMessageId: message.id,
      }),
    )
    expect(readResponse.status).toBe(HTTP_STATUS_CODE.noContent)
    expect(readResponse.text).toBe('')

    const { data, error } = await supabaseFixture.supabase
      .from('feedback_reports')
      .select('author_read_at')
      .eq('id', reportId)
      .single()
    if (error) throw error
    expect(data.author_read_at).toBe(message.createdAt)
  })

  it('uses the same safe 404 response for absent and non-owned details', async () => {
    const first = await request(honoFixture.server)
      .get(`/reporting/feedback/mine/${randomUUID()}`)
      .set(authFixture.getAuthorizationHeader())
    const second = await request(honoFixture.server)
      .get(`/reporting/feedback/mine/${randomUUID()}`)
      .set(authFixture.getAuthorizationHeader())

    expect(first.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(second.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(first.body).toEqual(second.body)
  })

  it('rejects invalid initial uploads before storage signing', async () => {
    const response = await request(honoFixture.server)
      .post('/reporting/feedback/attachments/signed-upload-url')
      .set(authFixture.getAuthorizationHeader())
      .send({ fileName: 'not-a-uuid.png', mimeType: 'image/png', size: 1024 })

    expect(response.status).toBe(HTTP_STATUS_CODE.badRequest)
  })

  it('rejects message mutation on a closed report', async () => {
    const reportId = await createReport({ status: 'closed' })

    const response = await request(honoFixture.server)
      .post(`/reporting/feedback/${reportId}/messages`)
      .set(authFixture.getAuthorizationHeader())
      .send({ messageId: randomUUID(), content: 'Attempt after close', attachments: [] })

    expect(response.status).toBe(HTTP_STATUS_CODE.conflict)
    expect(response.body).toEqual(
      expect.objectContaining({ ...new ConflictError('Relatório de feedback fechado') }),
    )
  })
})
