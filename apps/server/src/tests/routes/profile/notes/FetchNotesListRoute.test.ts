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
import { noteModel } from '@/database/drizzle/schema'
describe('[GET] /profile/notes', () => {
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

  async function otherAccount() {
    const other = new AuthFixture(fixture.supabase)
    await other.createAccount()
    await profile.createAccountUser(other.getAccountId())
    return other
  }
  async function seed(userId: string, title: string, time: string) {
    const row = {
      id: Id.create().value,
      userId,
      title,
      content: `Content ${title}`,
      createdAt: new Date(time),
      updatedAt: new Date(time),
    }
    ids.push(row.id)
    await database.insert(noteModel).values(row)
    return row
  }
  it('should reject anonymous requests', async () => {
    const response = await request(hono.server).get('/profile/notes')
    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual({ ...new AuthError('Conta não autorizada') })
  })

  it('should paginate owned notes and search only titles without mutation', async () => {
    const other = await otherAccount()
    const older = await seed(auth.getAccountId(), 'Search alpha', '2025-01-01T12:00:00Z')
    const newer = await seed(auth.getAccountId(), 'Search beta', '2025-01-02T12:00:00Z')
    const foreign = await seed(
      other.getAccountId(),
      'Search foreign',
      '2025-01-03T12:00:00Z',
    )
    const before = await database.select().from(noteModel).orderBy(asc(noteModel.id))
    for (const [actor, page, search, row, count] of [
      [auth, 1, undefined, newer, 2],
      [auth, 2, 'Search', older, 2],
      [auth, 1, 'alpha', older, 1],
      [other, 1, 'Search', foreign, 1],
    ] as const) {
      const response = await request(hono.server)
        .get('/profile/notes')
        .query({ page, itemsPerPage: 1, ...(search ? { search } : {}) })
        .set(actor.getAuthorizationHeader())
      expect(response.status).toBe(HTTP_STATUS_CODE.ok)
      expect(response.body).toEqual([
        {
          ...row,
          createdAt: row.createdAt.toISOString(),
          updatedAt: row.updatedAt.toISOString(),
        },
      ])
      expect(response.headers[HTTP_HEADERS.xTotalItemsCount.toLowerCase()]).toBe(
        String(count),
      )
      expect(response.headers[HTTP_HEADERS.xTotalPagesCount.toLowerCase()]).toBe(
        String(count),
      )
      expect(response.headers[HTTP_HEADERS.xPage.toLowerCase()]).toBe(String(page))
    }
    expect(await database.select().from(noteModel).orderBy(asc(noteModel.id))).toEqual(
      before,
    )
  })
})
