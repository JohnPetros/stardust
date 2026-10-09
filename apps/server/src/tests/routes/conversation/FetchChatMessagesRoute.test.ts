import { asc, inArray } from 'drizzle-orm'
import request from 'supertest'
import { ChatNotFoundError } from '@stardust/core/conversation/errors'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'
import { ENV } from '@/constants'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { chatModel, chatMessageModel } from '@/database/drizzle/schema'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'

describe('[GET] /conversation/chats/:chatId/messages', () => {
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
    const response = await request(honoFixture.server).get(
      '/conversation/chats/00000000-0000-4000-8000-000000000001/messages',
    )
    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual({ ...new AuthError('Conta não autorizada') })
  })

  it('should return ordered owned messages and reject another account chat', async () => {
    const other = await createOtherAccount()
    const owned = await seedChat(
      authFixture.getAccountId(),
      'Account A chat',
      new Date('2025-01-01T00:00:00Z'),
    )
    const foreign = await seedChat(
      other.getAccountId(),
      'Account B chat',
      new Date('2025-01-01T00:00:00Z'),
    )
    const messages = [
      {
        id: Id.create().value,
        chatId: owned.id,
        content: 'A first',
        sender: 'user' as const,
        createdAt: new Date('2025-01-01T01:00:00Z'),
      },
      {
        id: Id.create().value,
        chatId: owned.id,
        content: 'A second',
        sender: 'user' as const,
        createdAt: new Date('2025-01-01T02:00:00Z'),
      },
      {
        id: Id.create().value,
        chatId: foreign.id,
        content: 'B only',
        sender: 'user' as const,
        createdAt: new Date('2025-01-01T03:00:00Z'),
      },
    ]
    await database.insert(chatMessageModel).values([...messages].reverse())
    const before = await database
      .select()
      .from(chatMessageModel)
      .orderBy(asc(chatMessageModel.id))
    for (const [actor, chat, expected] of [
      [authFixture, owned, messages.slice(0, 2)],
      [other, foreign, messages.slice(2)],
    ] as const) {
      const response = await request(honoFixture.server)
        .get(`/conversation/chats/${chat.id}/messages`)
        .set(actor.getAuthorizationHeader())
      expect(response.status).toBe(HTTP_STATUS_CODE.ok)
      expect(response.body).toEqual(
        expected.map(({ id, content, sender, createdAt }) => ({
          id,
          content,
          sender,
          sentAt: createdAt.toISOString(),
        })),
      )
    }
    const denied = await request(honoFixture.server)
      .get(`/conversation/chats/${owned.id}/messages`)
      .set(other.getAuthorizationHeader())
    expect(denied.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(denied.body).toEqual({ ...new ChatNotFoundError() })
    expect(
      await database.select().from(chatMessageModel).orderBy(asc(chatMessageModel.id)),
    ).toEqual(before)
  })
})
