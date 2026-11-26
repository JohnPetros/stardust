import { asc, eq, inArray } from 'drizzle-orm'
import request from 'supertest'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { Id } from '@stardust/core/global/structures'
import { ENV } from '@/constants'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'
import { guideModel } from '@/database/drizzle/schema'
describe('[GET] /manual/guides', () => {
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

  it('should publicly list the complete category in ascending position without mutation', async () => {
    const baseline = await database
      .select()
      .from(guideModel)
      .where(eq(guideModel.category, 'lsp'))
      .orderBy(asc(guideModel.position))
    const max = Math.max(0, ...baseline.map((row) => row.position))
    const higher = await seed('Seed higher guide', max + 3)
    const lower = await seed('Seed lower guide', max + 1)
    await seed('Seed different category', 999, 'mdx')
    const before = await database.select().from(guideModel).orderBy(asc(guideModel.id))
    const response = await request(hono.server)
      .get('/manual/guides')
      .query({ category: 'lsp' })
    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual([
      ...baseline.map((row) => ({ ...row, content: row.content ?? '' })),
      lower,
      higher,
    ])
    expect(await database.select().from(guideModel).orderBy(asc(guideModel.id))).toEqual(
      before,
    )
  })
})
