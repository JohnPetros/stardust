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
import { snippetModel } from '@/database/drizzle/schema'
describe('[POST] /playground/snippets', () => {
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
    if (ids.length)
      await database.delete(snippetModel).where(inArray(snippetModel.id, ids))
  })

  it('should reject anonymous requests', async () => {
    const response = await request(hono.server).post('/playground/snippets')
    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual({ ...new AuthError('Conta não autorizada') })
  })

  it('should persist an owned private snippet', async () => {
    const payload = { title: 'Created snippet', code: 'escreva(2)', isPublic: false }
    const response = await request(hono.server)
      .post('/playground/snippets')
      .set(auth.getAuthorizationHeader())
      .send(payload)
    expect(response.status).toBe(HTTP_STATUS_CODE.created)
    expect(response.body).toEqual({
      id: expect.any(String),
      ...payload,
      author: { id: auth.getAccountId() },
      createdAt: expect.any(String),
    })
    ids.push(Id.create(response.body.id).value)
    expect(
      await database
        .select()
        .from(snippetModel)
        .where(eq(snippetModel.id, response.body.id)),
    ).toEqual([
      {
        id: response.body.id,
        ...payload,
        userId: auth.getAccountId(),
        createdAt: new Date(response.body.createdAt),
      },
    ])
    expect(Number.isFinite(new Date(response.body.createdAt).getTime())).toBe(true)
  })
})
