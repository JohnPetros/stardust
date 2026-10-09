import { randomUUID } from 'node:crypto'
import { eq } from 'drizzle-orm'
import request from 'supertest'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { ENV } from '@/constants'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import {
  feedbackMessageAttachmentModel,
  feedbackMessageModel,
  feedbackReportModel,
} from '@/database/drizzle/models/reporting'
import { FileStorageFolderPath } from '@stardust/core/storage/structures'
import { Text } from '@stardust/core/global/structures'
import { S3FileStorageProvider } from '@/provision/storage/s3/S3FileStorageProvider'
import { InngestBroker } from '@/queue/inngest/InngestBroker'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { ReportingFixture } from '@/tests/fixtures/ReportingFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[POST /reporting/feedback/:feedbackReportId/messages]', () => {
  const hono = new HonoFixture()
  const fixture = new SupabaseFixture()
  const auth = new AuthFixture(fixture.supabase)
  const profile = new ProfileFixture(fixture.supabase)
  const reporting = new ReportingFixture(fixture.supabase)
  const configuredGodAccounts = [...ENV.godAccountIds]
  const delivery = jest.spyOn(InngestBroker.prototype, 'publish')
  const input = () => ({
    messageId: randomUUID(),
    content: 'A persisted actual route reply',
    attachments: [],
  })
  const send = (reportId: string, body: ReturnType<typeof input>) =>
    request(hono.server)
      .post(`/reporting/feedback/${reportId}/messages`)
      .set(auth.getAuthorizationHeader())
      .send(body)

  beforeAll(async () => {
    await hono.setup()
  })
  afterAll(async () => {
    ENV.godAccountIds = configuredGodAccounts
    delivery.mockRestore()
    await DrizzleClient.close()
  })
  beforeEach(async () => {
    ENV.godAccountIds = []
    delivery.mockReset().mockResolvedValue(undefined)
    await fixture.clearDatabase()
    await auth.createAccount()
    await profile.createAccountUser(auth.getAccountId())
  })

  it('persists one author reply and preserves replay/conflict semantics', async () => {
    const reportId = await reporting.createReportForAuthor(auth.getAccountId())
    const body = input()
    delivery.mockImplementation(async () => {
      expect(await reporting.listFeedbackMessages(reportId)).toEqual([
        expect.objectContaining({
          id: body.messageId,
          content: body.content,
          authorId: auth.getAccountId(),
          authorRole: 'user',
        }),
      ])
    })
    const first = await send(reportId, body)
    expect(first.status).toBe(HTTP_STATUS_CODE.created)
    expect(first.body.isDuplicate).toBe(false)
    const replay = await send(reportId, body)
    expect(replay.status).toBe(HTTP_STATUS_CODE.ok)
    expect(replay.body.isDuplicate).toBe(true)
    expect(delivery.mock.calls.map(([event, key]) => [event.name, key?.value])).toEqual([
      ['feedback.user.message.created', `feedback-user-message:${body.messageId}`],
      ['feedback.user.message.created', `feedback-user-message:${body.messageId}`],
    ])
    const before = await reporting.findFeedbackReportById(reportId)
    const conflict = await send(reportId, {
      ...body,
      content: 'Different content for the same message',
    })
    expect(conflict.status).toBe(HTTP_STATUS_CODE.conflict)
    expect(before).not.toBeNull()
    expect(await reporting.findFeedbackReportById(reportId)).toEqual(
      expect.objectContaining({
        id: before?.id,
        content: before?.content,
        status: before?.status,
        lastActivityAt: before?.lastActivityAt,
        lastUserMessageAt: before?.lastUserMessageAt,
        lastAdminMessageAt: before?.lastAdminMessageAt,
        authorReadAt: before?.authorReadAt,
        studioReadAt: before?.studioReadAt,
      }),
    )
    expect(await reporting.listFeedbackMessages(reportId)).toHaveLength(1)
    expect(delivery).toHaveBeenCalledTimes(2)
  })

  it('rejects another account without changing the conversation', async () => {
    const reportId = await reporting.createReportForAuthor(auth.getAccountId())
    const before = await reporting.findFeedbackReportById(reportId)
    await auth.createAccount()
    await profile.createAccountUser(auth.getAccountId())
    const response = await send(reportId, input())
    expect(response.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(before).not.toBeNull()
    expect(await reporting.findFeedbackReportById(reportId)).toEqual(
      expect.objectContaining({
        id: before?.id,
        content: before?.content,
        status: before?.status,
        lastActivityAt: before?.lastActivityAt,
        lastUserMessageAt: before?.lastUserMessageAt,
        lastAdminMessageAt: before?.lastAdminMessageAt,
        authorReadAt: before?.authorReadAt,
        studioReadAt: before?.studioReadAt,
      }),
    )
    expect(await reporting.listFeedbackMessages(reportId)).toEqual([])
    expect(delivery).not.toHaveBeenCalled()
  })

  it('rejects a closed conversation without writing or publishing', async () => {
    const reportId = await reporting.createReportForAuthor(auth.getAccountId())
    await fixture.database
      .update(feedbackReportModel)
      .set({ status: 'closed' })
      .where(eq(feedbackReportModel.id, reportId))
    const before = await reporting.findFeedbackReportById(reportId)
    const response = await send(reportId, input())
    expect(response.status).toBe(HTTP_STATUS_CODE.conflict)
    expect(before).not.toBeNull()
    expect(await reporting.findFeedbackReportById(reportId)).toEqual(
      expect.objectContaining({
        id: before?.id,
        content: before?.content,
        status: before?.status,
        lastActivityAt: before?.lastActivityAt,
        lastUserMessageAt: before?.lastUserMessageAt,
        lastAdminMessageAt: before?.lastAdminMessageAt,
        authorReadAt: before?.authorReadAt,
        studioReadAt: before?.studioReadAt,
      }),
    )
    expect(await reporting.listFeedbackMessages(reportId)).toEqual([])
    expect(delivery).not.toHaveBeenCalled()
  })

  it('publishes God reply and closure events sequentially after committed state', async () => {
    const reportId = await reporting.createReportForAuthor(auth.getAccountId())
    await auth.createAccount()
    await profile.createAccountUser(auth.getAccountId())
    ENV.godAccountIds = [auth.getAccountId()]
    const body = input()
    delivery.mockImplementation(async () => {
      expect((await reporting.findFeedbackReportById(reportId))?.status).toBe('closed')
      expect(await reporting.listFeedbackMessages(reportId)).toEqual([
        expect.objectContaining({
          id: body.messageId,
          authorId: auth.getAccountId(),
          authorRole: 'admin',
        }),
      ])
    })
    const response = await request(hono.server)
      .post(`/reporting/feedback/${reportId}/messages`)
      .set(auth.getAuthorizationHeader())
      .send({ ...body, targetStatus: 'closed' })
    expect(response.status).toBe(HTTP_STATUS_CODE.created)
    expect(delivery.mock.calls.map(([event, key]) => [event.name, key?.value])).toEqual([
      ['feedback.message.created', `feedback-message:${body.messageId}`],
      ['feedback.admin.message.sent', `feedback-admin-message-sent:${body.messageId}`],
      ['feedback.report.closed', `feedback-report-closed:${reportId}:${body.messageId}`],
    ])
  })

  it('rejects anonymous and invalid requests without mutation', async () => {
    const reportId = await reporting.createReportForAuthor(auth.getAccountId())
    const before = await reporting.findFeedbackReportById(reportId)
    const anonymous = await request(hono.server)
      .post(`/reporting/feedback/${reportId}/messages`)
      .send(input())
    const invalid = await send(reportId, { ...input(), content: '' })
    expect(anonymous.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(invalid.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(before).not.toBeNull()
    expect(await reporting.findFeedbackReportById(reportId)).toEqual(
      expect.objectContaining({
        id: before?.id,
        content: before?.content,
        status: before?.status,
        lastActivityAt: before?.lastActivityAt,
        lastUserMessageAt: before?.lastUserMessageAt,
        lastAdminMessageAt: before?.lastAdminMessageAt,
        authorReadAt: before?.authorReadAt,
        studioReadAt: before?.studioReadAt,
      }),
    )
    expect(await reporting.listFeedbackMessages(reportId)).toEqual([])
    expect(delivery).not.toHaveBeenCalled()
  })

  it('rolls back a message when a real attachment primary key collision occurs', async () => {
    const reportId = await reporting.createReportForAuthor(auth.getAccountId())
    const baseline = await reporting.createUserReply(reportId, auth.getAccountId())
    const attachmentId = randomUUID()
    const messageId = randomUUID()
    const fileName = Text.create(`${randomUUID()}.png`)
    const folder = FileStorageFolderPath.createAsFeedbackMessages(reportId, messageId)
    const storageKey = `${folder.value}/${fileName.value}`
    const bytes = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aZ1sAAAAASUVORK5CYII=',
      'base64',
    )
    const storage = new S3FileStorageProvider()
    await fixture.database.insert(feedbackMessageAttachmentModel).values({
      id: attachmentId,
      messageId: baseline.id,
      storageKey: `images/feedback-messages/${reportId}/${baseline.id}/${randomUUID()}.png`,
      originalName: 'baseline.png',
      mimeType: 'image/png',
      size: bytes.length,
      position: 0,
    })
    const before = await fixture.database
      .select()
      .from(feedbackReportModel)
      .where(eq(feedbackReportModel.id, reportId))
    const messagesBefore = await reporting.listFeedbackMessages(reportId)
    try {
      await storage.upload(
        folder,
        new File([bytes], fileName.value, { type: 'image/png' }),
      )
      expect(await storage.getFileMetadata(folder, fileName)).toEqual({
        mimeType: 'image/png',
        size: bytes.length,
      })
      const response = await request(hono.server)
        .post(`/reporting/feedback/${reportId}/messages`)
        .set(auth.getAuthorizationHeader())
        .send({
          messageId,
          content: 'This message must be rolled back',
          attachments: [
            {
              id: attachmentId,
              storageKey,
              originalName: 'evidence.png',
              mimeType: 'image/png',
              size: bytes.length,
            },
          ],
        })
      expect(response.status).toBe(HTTP_STATUS_CODE.conflict)
      expect(
        await fixture.database
          .select()
          .from(feedbackMessageModel)
          .where(eq(feedbackMessageModel.id, messageId)),
      ).toEqual([])
      expect(
        await fixture.database
          .select()
          .from(feedbackReportModel)
          .where(eq(feedbackReportModel.id, reportId)),
      ).toEqual(before)
      expect(await reporting.listFeedbackMessages(reportId)).toEqual(messagesBefore)
      expect(
        await fixture.database
          .select()
          .from(feedbackMessageAttachmentModel)
          .where(eq(feedbackMessageAttachmentModel.id, attachmentId)),
      ).toEqual([expect.objectContaining({ messageId: baseline.id })])
      expect(delivery).not.toHaveBeenCalled()
    } finally {
      await storage.removeFile(folder, fileName)
      expect(await storage.getFileMetadata(folder, fileName)).toBeNull()
    }
  })
})
