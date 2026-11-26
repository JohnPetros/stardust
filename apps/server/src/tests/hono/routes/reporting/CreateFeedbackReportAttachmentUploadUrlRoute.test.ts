import { randomUUID } from 'node:crypto'
import request from 'supertest'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { ENV } from '@/constants'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { feedbackReportModel } from '@/database/drizzle/models/reporting'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'
import { FileStorageFolderPath } from '@stardust/core/storage/structures'
import { Text } from '@stardust/core/global/structures'
import { S3FileStorageProvider } from '@/provision/storage/s3/S3FileStorageProvider'

describe('[POST feedback report attachment signed-upload-url]', () => {
  const hono = new HonoFixture()
  const fixture = new SupabaseFixture()
  const auth = new AuthFixture(fixture.supabase)
  const profile = new ProfileFixture(fixture.supabase)
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

  const bytes = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aZ1sAAAAASUVORK5CYII=',
    'base64',
  )
  const input = () => ({
    fileName: `${randomUUID()}.png`,
    mimeType: 'image/png',
    size: bytes.length,
  })
  it('issues a usable local PUT URL with the exact requested storage path', async () => {
    const body = input()
    const folder = FileStorageFolderPath.createAsFeedbackReports()
    const fileName = Text.create(body.fileName)
    const before = await fixture.database.select().from(feedbackReportModel)
    const response = await request(hono.server)
      .post('/reporting/feedback/attachments/signed-upload-url')
      .set(auth.getAuthorizationHeader())
      .send(body)
    expect(response.status).toBe(HTTP_STATUS_CODE.created)
    expect(response.body).toEqual(
      expect.objectContaining({ folderPath: folder.value, fileName: body.fileName }),
    )
    const url = new URL(response.body.url)
    expect(
      decodeURIComponent(url.pathname).endsWith(`/${folder.value}/${body.fileName}`),
    ).toBe(true)
    expect(url.searchParams.has('X-Amz-Signature')).toBe(true)
    const storage = new S3FileStorageProvider()
    try {
      const upload = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': body.mimeType },
        body: new File([bytes], body.fileName, { type: body.mimeType }),
      })
      expect(upload.ok).toBe(true)
      expect(await storage.getFileMetadata(folder, fileName)).toEqual({
        mimeType: body.mimeType,
        size: body.size,
      })
      expect(await fixture.database.select().from(feedbackReportModel)).toEqual(before)
    } finally {
      await storage.removeFile(folder, fileName)
      expect(await storage.getFileMetadata(folder, fileName)).toBeNull()
    }
  })
  it('rejects anonymous callers and invalid image requests', async () => {
    const anonymous = await request(hono.server)
      .post('/reporting/feedback/attachments/signed-upload-url')
      .send(input())
    const invalid = await request(hono.server)
      .post('/reporting/feedback/attachments/signed-upload-url')
      .set(auth.getAuthorizationHeader())
      .send({ ...input(), mimeType: 'image/jpeg' })
    expect(anonymous.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(invalid.status).toBe(HTTP_STATUS_CODE.badRequest)
    expect(anonymous.body.url).toBeUndefined()
    expect(invalid.body.url).toBeUndefined()
  })
})
