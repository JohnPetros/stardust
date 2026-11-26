import { eq, inArray } from 'drizzle-orm'
import request from 'supertest'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'
import { ENV } from '@/constants'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'
import { noteModel } from '@/database/drizzle/schema'
describe('[POST] /profile/notes', () => {
  const hono = new HonoFixture()
  const fixture = new SupabaseFixture()
  const auth = new AuthFixture(fixture.supabase)
  const profile = new ProfileFixture(fixture.supabase)
  const database = fixture.database
  const ids: string[] = []
  beforeAll(async () => {
    await hono.setup()
  })
  afterAll(async () => {
    await DrizzleClient.close()
  })
  beforeEach(async () => {
    ENV.godAccountIds = []
    await fixture.clearDatabase()
    ids.length = 0
    await auth.createAccount()
    await profile.createAccountUser(auth.getAccountId())
  })
  afterEach(async () => {
    if (ids.length) await database.delete(noteModel).where(inArray(noteModel.id, ids))
  })

  it('should reject anonymous requests', async () => {
    const response = await request(hono.server).post('/profile/notes')
    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual({ ...new AuthError('Conta não autorizada') })
  })

  it('should create an owned note with exact persisted content and timestamps', async () => {
    const payload = { title: 'Created note', content: 'Persisted note content' }
    const response = await request(hono.server)
      .post('/profile/notes')
      .set(auth.getAuthorizationHeader())
      .send(payload)
    expect(response.status).toBe(HTTP_STATUS_CODE.created)
    expect(response.body).toEqual({
      id: expect.any(String),
      ...payload,
      userId: auth.getAccountId(),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    })
    ids.push(Id.create(response.body.id).value)
    expect(
      await database.select().from(noteModel).where(eq(noteModel.id, response.body.id)),
    ).toEqual([
      {
        ...response.body,
        createdAt: new Date(response.body.createdAt),
        updatedAt: new Date(response.body.updatedAt),
      },
    ])
    expect(Number.isFinite(new Date(response.body.createdAt).getTime())).toBe(true)
    expect(Number.isFinite(new Date(response.body.updatedAt).getTime())).toBe(true)
  })
})
