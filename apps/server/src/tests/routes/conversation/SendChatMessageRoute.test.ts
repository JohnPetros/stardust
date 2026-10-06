import { asc, eq, inArray } from 'drizzle-orm'
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

describe('[POST] /conversation/chats/:chatId/messages', () => {
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
    const response = await request(honoFixture.server).post(
      '/conversation/chats/00000000-0000-4000-8000-000000000001/messages',
    )
    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual({ ...new AuthError('Conta não autorizada') })
  })

  it('should persist owned messages and leave complete state unchanged after a foreign write', async () => {
    const other = await createOtherAccount()
    const owned = await seedChat(
      authFixture.getAccountId(),
      'Account A chat',
      new Date('2025-01-01T00:00:00Z'),
    )
    const foreign = await seedChat(
      other.getAccountId(),
      'Account B chat',
      new Date('2025-01-02T00:00:00Z'),
    )
    for (const [actor, chat, content] of [
      [authFixture, owned, 'A message'],
      [other, foreign, 'B message'],
    ] as const) {
      const response = await request(honoFixture.server)
        .post(`/conversation/chats/${chat.id}/messages`)
        .set(actor.getAuthorizationHeader())
        .send({ content, sender: 'user' })
      expect(response.status).toBe(HTTP_STATUS_CODE.created)
      expect(response.body).toEqual({
        id: expect.any(String),
        content,
        sender: 'user',
        sentAt: expect.any(String),
      })
      expect(Id.create(response.body.id).value).toBe(response.body.id)
      expect(
        await database
          .select()
          .from(chatMessageModel)
          .where(eq(chatMessageModel.id, response.body.id)),
      ).toEqual([
        {
          id: response.body.id,
          chatId: chat.id,
          content,
          sender: 'user',
          createdAt: new Date(response.body.sentAt),
        },
      ])
    }
    const chatsBefore = await database.select().from(chatModel).orderBy(asc(chatModel.id))
    const messagesBefore = await database
      .select()
      .from(chatMessageModel)
      .orderBy(asc(chatMessageModel.id))
    const denied = await request(honoFixture.server)
      .post(`/conversation/chats/${owned.id}/messages`)
      .set(other.getAuthorizationHeader())
      .send({ content: 'Denied B injection', sender: 'user' })
    expect(denied.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(denied.body).toEqual({ ...new ChatNotFoundError() })
    expect(await database.select().from(chatModel).orderBy(asc(chatModel.id))).toEqual(
      chatsBefore,
    )
    expect(
      await database.select().from(chatMessageModel).orderBy(asc(chatMessageModel.id)),
    ).toEqual(messagesBefore)
  })
})
