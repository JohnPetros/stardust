import { asc, inArray } from 'drizzle-orm'
import request from 'supertest'
import { HTTP_HEADERS, HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'
import { ENV } from '@/constants'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { chatModel } from '@/database/drizzle/schema'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /conversation/chats', () => {
  const honoFixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const authFixture = new AuthFixture(supabaseFixture.supabase)
  const profileFixture = new ProfileFixture(supabaseFixture.supabase)
  const database = supabaseFixture.database
  const chatIds: string[] = []
  beforeAll(async () => {
    await honoFixture.setup()
  })
  afterAll(async () => {
    await DrizzleClient.close()
  })
  beforeEach(async () => {
    ENV.godAccountIds = []
    await supabaseFixture.clearDatabase()
    chatIds.length = 0
    await authFixture.createAccount()
    await profileFixture.createAccountUser(authFixture.getAccountId())
  })
  afterEach(async () => {
    if (chatIds.length)
      await database.delete(chatModel).where(inArray(chatModel.id, chatIds))
  })
  async function createOtherAccount() {
    const other = new AuthFixture(supabaseFixture.supabase)
    await other.createAccount()
    await profileFixture.createAccountUser(other.getAccountId())
    return other
  }
  async function seedChat(userId: string, name: string, createdAt: Date) {
    const id = Id.create().value
    chatIds.push(id)
    const row = { id, userId, name, createdAt }
    await database.insert(chatModel).values(row)
    return row
  }
  it('should reject anonymous requests', async () => {
    const response = await request(honoFixture.server).get('/conversation/chats')
    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual({ ...new AuthError('Conta não autorizada') })
  })

  it('should paginate only each account own chats without changing persisted rows', async () => {
    const other = await createOtherAccount()
    const newer = await seedChat(
      authFixture.getAccountId(),
      'A newer',
      new Date('2025-01-02T12:00:00Z'),
    )
    const older = await seedChat(
      authFixture.getAccountId(),
      'A older',
      new Date('2025-01-01T12:00:00Z'),
    )
    const foreign = await seedChat(
      other.getAccountId(),
      'B only',
      new Date('2025-01-03T12:00:00Z'),
    )
    const before = await database.select().from(chatModel).orderBy(asc(chatModel.id))
    for (const [actor, page, row, total] of [
      [authFixture, 1, newer, 2],
      [authFixture, 2, older, 2],
      [other, 1, foreign, 1],
    ] as const) {
      const response = await request(honoFixture.server)
        .get('/conversation/chats')
        .query({ page, itemsPerPage: 1 })
        .set(actor.getAuthorizationHeader())
      expect(response.status).toBe(HTTP_STATUS_CODE.ok)
      expect(response.body).toEqual([
        { id: row.id, name: row.name, createdAt: row.createdAt.toISOString() },
      ])
      expect(response.headers[HTTP_HEADERS.xTotalItemsCount.toLowerCase()]).toBe(
        String(total),
      )
      expect(response.headers[HTTP_HEADERS.xTotalPagesCount.toLowerCase()]).toBe(
        String(total),
      )
      expect(response.headers[HTTP_HEADERS.xPage.toLowerCase()]).toBe(String(page))
      expect(response.headers[HTTP_HEADERS.xItemsPerPage.toLowerCase()]).toBe('1')
    }
    expect(await database.select().from(chatModel).orderBy(asc(chatModel.id))).toEqual(
      before,
    )
  })
})
