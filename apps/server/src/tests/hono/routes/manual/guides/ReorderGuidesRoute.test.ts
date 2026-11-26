import { asc, inArray } from 'drizzle-orm'
import request from 'supertest'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError, NotGodAccountError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'
import { ENV } from '@/constants'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'
import { guideModel } from '@/database/drizzle/schema'
describe('[POST] /manual/guides/reorder', () => {
  const hono = new HonoFixture()
  const fixture = new SupabaseFixture()
  const auth = new AuthFixture(fixture.supabase)
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
  })
  afterEach(async () => {
    if (ids.length) await database.delete(guideModel).where(inArray(guideModel.id, ids))
  })
  async function seed(title: string, position: number, category: 'lsp' | 'mdx' = 'lsp') {
    const row = {
      id: Id.create().value,
      title,
      content: `Content ${title}`,
      position,
      category,
    }
    ids.push(row.id)
    await database.insert(guideModel).values(row)
    return row
  }
  it('should reject anonymous mutation', async () => {
    const response = await request(hono.server).post('/manual/guides/reorder')
    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual({ ...new AuthError('Conta não autorizada') })
  })
  it('should reject ordinary writes unchanged and persist only the God operation', async () => {
    const baseline = await database.select().from(guideModel).orderBy(asc(guideModel.id))
    const max = Math.max(
      0,
      ...baseline.filter((row) => row.category === 'lsp').map((row) => row.position),
    )
    const first = await seed('First seeded guide', max + 1)
    const second = await seed('Second seeded guide', max + 3)
    const before = await database.select().from(guideModel).orderBy(asc(guideModel.id))
    const denied = await request(hono.server)
      .post('/manual/guides/reorder')
      .set(auth.getAuthorizationHeader())
      .send({ guideIds: [second.id, first.id] })
    expect(denied.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(denied.body).toEqual({ ...new NotGodAccountError() })
    expect(await database.select().from(guideModel).orderBy(asc(guideModel.id))).toEqual(
      before,
    )
    ENV.godAccountIds = [auth.getAccountId()]
    const response = await request(hono.server)
      .post('/manual/guides/reorder')
      .set(auth.getAuthorizationHeader())
      .send({ guideIds: [second.id, first.id] })
    expect(response.status).toBe(HTTP_STATUS_CODE.noContent)
    expect(response.text).toBe('')
    expect(await database.select().from(guideModel).orderBy(asc(guideModel.id))).toEqual(
      before.map((row) =>
        row.id === first.id
          ? { ...row, position: 2 }
          : row.id === second.id
            ? { ...row, position: 1 }
            : row,
      ),
    )
  })
})
