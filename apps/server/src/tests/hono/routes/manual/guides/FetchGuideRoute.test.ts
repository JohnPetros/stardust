import { asc, inArray } from 'drizzle-orm'
import request from 'supertest'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { Id } from '@stardust/core/global/structures'
import { ENV } from '@/constants'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'
import { GuideNotFoundError } from '@stardust/core/manual/errors'
import { guideModel } from '@/database/drizzle/schema'
describe('[GET] /manual/guides/:id', () => {
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

  it('should publicly fetch an exact persisted guide and return 404 for missing id', async () => {
    const row = await seed('Public guide', 999)
    const before = await database.select().from(guideModel).orderBy(asc(guideModel.id))
    const response = await request(hono.server).get(`/manual/guides/${row.id}`)
    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual(row)
    const missing = await request(hono.server).get(`/manual/guides/${Id.create().value}`)
    expect(missing.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(missing.body).toEqual({ ...new GuideNotFoundError() })
    expect(await database.select().from(guideModel).orderBy(asc(guideModel.id))).toEqual(
      before,
    )
  })
})
