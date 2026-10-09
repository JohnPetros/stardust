import { eq, inArray } from 'drizzle-orm'
import request from 'supertest'
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

describe('[POST] /conversation/chats', () => {
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
  it('should reject anonymous requests', async () => {
    const response = await request(honoFixture.server).post('/conversation/chats')
    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual({ ...new AuthError('Conta não autorizada') })
  })

  it('should persist a bodyless new chat for its authenticated owner', async () => {
    const response = await request(honoFixture.server)
      .post('/conversation/chats')
      .set(authFixture.getAuthorizationHeader())
    expect(response.status).toBe(HTTP_STATUS_CODE.created)
    expect(response.body).toEqual({
      id: expect.any(String),
      name: 'Novo chat',
      createdAt: expect.any(String),
    })
    expect(Id.create(response.body.id).value).toBe(response.body.id)
    chatIds.push(response.body.id)
    const rows = await database
      .select()
      .from(chatModel)
      .where(eq(chatModel.userId, authFixture.getAccountId()))
    expect(rows).toEqual([
      {
        id: response.body.id,
        name: 'Novo chat',
        userId: authFixture.getAccountId(),
        createdAt: new Date(response.body.createdAt),
      },
    ])
    expect(Number.isFinite(rows[0]?.createdAt.getTime())).toBe(true)
  })
  it('should increment the latest default name and preserve the prior chat', async () => {
    const prior = {
      id: Id.create().value,
      userId: authFixture.getAccountId(),
      name: 'Novo chat(2)',
      createdAt: new Date('2025-01-01T12:00:00Z'),
    }
    chatIds.push(prior.id)
    await database.insert(chatModel).values(prior)
    const response = await request(honoFixture.server)
      .post('/conversation/chats')
      .set(authFixture.getAuthorizationHeader())
    expect(response.status).toBe(HTTP_STATUS_CODE.created)
    expect(response.body).toEqual({
      id: expect.any(String),
      name: 'Novo chat(3)',
      createdAt: expect.any(String),
    })
    expect(Id.create(response.body.id).value).toBe(response.body.id)
    expect(response.body.id).not.toBe(prior.id)
    chatIds.push(response.body.id)
    expect(Number.isFinite(new Date(response.body.createdAt).getTime())).toBe(true)
    expect(
      await database.select().from(chatModel).where(eq(chatModel.id, prior.id)),
    ).toEqual([prior])
    expect(
      await database.select().from(chatModel).where(eq(chatModel.id, response.body.id)),
    ).toEqual([
      {
        id: response.body.id,
        userId: prior.userId,
        name: 'Novo chat(3)',
        createdAt: new Date(response.body.createdAt),
      },
    ])
  })
})
