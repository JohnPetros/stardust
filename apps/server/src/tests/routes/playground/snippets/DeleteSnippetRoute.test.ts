import { asc, eq, inArray } from 'drizzle-orm'
import request from 'supertest'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'
import { ENV } from '@/constants'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'
import { snippetModel } from '@/database/drizzle/schema'
describe('[DELETE] /playground/snippets/:id', () => {
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

  it('should reject anonymous requests', async () => {
    const response = await request(hono.server).delete(
      '/playground/snippets/00000000-0000-4000-8000-000000000001',
    )
    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual({ ...new AuthError('Conta não autorizada') })
  })

  it('should reject a private foreign mutation and persist only the owner operation', async () => {
    const other = await otherAccount()
    const owned = await seed(auth.getAccountId(), 'Private A original')
    const foreign = await seed(other.getAccountId(), 'Private B original')
    const before = await database
      .select()
      .from(snippetModel)
      .orderBy(asc(snippetModel.id))
    const denied = await request(hono.server)
      .delete(`/playground/snippets/${owned.id}`)
      .set(other.getAuthorizationHeader())
    expect(denied.status).toBe(HTTP_STATUS_CODE.notAllowed)
    expect(denied.body).toEqual({
      title: 'Erro de operação não permitida',
      message: 'Snippet não encontrado',
    })
    expect(
      await database.select().from(snippetModel).orderBy(asc(snippetModel.id)),
    ).toEqual(before)
    const response = await request(hono.server)
      .delete(`/playground/snippets/${owned.id}`)
      .set(auth.getAuthorizationHeader())
    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.text).toBe('')
    expect(
      await database.select().from(snippetModel).where(eq(snippetModel.id, owned.id)),
    ).toEqual([])
    expect(
      await database.select().from(snippetModel).where(eq(snippetModel.id, foreign.id)),
    ).toEqual([foreign])
  })
})
