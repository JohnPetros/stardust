import { asc, eq, inArray } from 'drizzle-orm'
import request from 'supertest'
import { ChatNotFoundError } from '@stardust/core/conversation/errors'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'
import { ENV } from '@/constants'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { chatModel } from '@/database/drizzle/schema'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[PATCH] /conversation/chats/:chatId/name', () => {
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
    const response = await request(honoFixture.server).patch(
      '/conversation/chats/00000000-0000-4000-8000-000000000001/name',
    )
    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual({ ...new AuthError('Conta não autorizada') })
  })

  it('should persist the owner rename and reject a foreign rename without mutation', async () => {
    const other = await createOtherAccount()
    const owned = await seedChat(
      authFixture.getAccountId(),
      'Original A chat',
      new Date('2025-01-01T12:00:00Z'),
    )
    await seedChat(
      other.getAccountId(),
      'Original B chat',
      new Date('2025-01-02T12:00:00Z'),
    )
    const response = await request(honoFixture.server)
      .patch(`/conversation/chats/${owned.id}/name`)
      .set(authFixture.getAuthorizationHeader())
      .send({ chatName: 'Renamed A chat' })
    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual({
      id: owned.id,
      name: 'Renamed A chat',
      createdAt: owned.createdAt.toISOString(),
    })
    expect(
      await database.select().from(chatModel).where(eq(chatModel.id, owned.id)),
    ).toEqual([{ ...owned, name: 'Renamed A chat' }])
    const before = await database.select().from(chatModel).orderBy(asc(chatModel.id))
    const denied = await request(honoFixture.server)
      .patch(`/conversation/chats/${owned.id}/name`)
      .set(other.getAuthorizationHeader())
      .send({ chatName: 'Foreign rename' })
    expect(denied.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(denied.body).toEqual({ ...new ChatNotFoundError() })
    expect(await database.select().from(chatModel).orderBy(asc(chatModel.id))).toEqual(
      before,
    )
  })
})
