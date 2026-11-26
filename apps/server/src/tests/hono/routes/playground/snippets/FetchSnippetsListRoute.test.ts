import { asc, inArray } from 'drizzle-orm'
import request from 'supertest'
import { HTTP_HEADERS, HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'
import { ENV } from '@/constants'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'
import { snippetModel } from '@/database/drizzle/schema'
import { DrizzleSnippetsRepository } from '@/database/drizzle/repositories'
describe('[GET] /playground/snippets', () => {
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

  async function otherAccount() {
    const other = new AuthFixture(fixture.supabase)
    await other.createAccount()
    await profile.createAccountUser(other.getAccountId())
    return other
  }
  const reader = new DrizzleSnippetsRepository(database, { kind: 'system' })
  async function seed(userId: string, title: string, isPublic = false) {
    const row = {
      id: Id.create().value,
      userId,
      title,
      code: 'escreva(1)',
      isPublic,
      createdAt: new Date('2025-01-01T12:00:00Z'),
    }
    ids.push(row.id)
    await database.insert(snippetModel).values(row)
    return row
  }
  async function expected(id: string) {
    const snippet = await reader.findById(Id.create(id))
    if (!snippet) throw new Error('Seeded snippet missing')
    const dto = JSON.parse(JSON.stringify(snippet.dto))
    dto.author.entity.id = expect.stringMatching(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    )
    return dto
  }
  it('should reject anonymous requests', async () => {
    const response = await request(hono.server).get('/playground/snippets')
    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual({ ...new AuthError('Conta não autorizada') })
  })

  it('should paginate only owned snippet membership without assuming order', async () => {
    const other = await otherAccount()
    const first = await seed(auth.getAccountId(), 'Private A first')
    const second = await seed(auth.getAccountId(), 'Private A second')
    const foreign = await seed(other.getAccountId(), 'Private B only')
    const before = await database
      .select()
      .from(snippetModel)
      .orderBy(asc(snippetModel.id))
    const received: unknown[] = []
    for (const page of [1, 2]) {
      const response = await request(hono.server)
        .get('/playground/snippets')
        .query({ page, itemsPerPage: 1 })
        .set(auth.getAuthorizationHeader())
      expect(response.status).toBe(HTTP_STATUS_CODE.ok)
      expect(response.body).toHaveLength(1)
      expect([first.id, second.id]).toContain(response.body[0].id)
      expect(response.body[0]).toEqual(await expected(response.body[0].id))
      expect(response.headers[HTTP_HEADERS.xTotalItemsCount.toLowerCase()]).toBe('2')
      expect(response.headers[HTTP_HEADERS.xTotalPagesCount.toLowerCase()]).toBe('2')
      expect(response.headers[HTTP_HEADERS.xPage.toLowerCase()]).toBe(String(page))
      received.push(response.body[0])
    }
    expect(received).toEqual(
      expect.arrayContaining([await expected(first.id), await expected(second.id)]),
    )
    const response = await request(hono.server)
      .get('/playground/snippets')
      .query({ page: 1, itemsPerPage: 1 })
      .set(other.getAuthorizationHeader())
    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual([await expected(foreign.id)])
    expect(response.headers[HTTP_HEADERS.xTotalItemsCount.toLowerCase()]).toBe('1')
    expect(response.headers[HTTP_HEADERS.xTotalPagesCount.toLowerCase()]).toBe('1')
    expect(
      await database.select().from(snippetModel).orderBy(asc(snippetModel.id)),
    ).toEqual(before)
  })
})
