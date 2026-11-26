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
import { noteModel } from '@/database/drizzle/schema'
import { NoteNotFoundError } from '@stardust/core/profile/errors'
describe('[DELETE] /profile/notes/:id', () => {
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
    const response = await request(hono.server).delete(
      '/profile/notes/00000000-0000-4000-8000-000000000001',
    )
    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual({ ...new AuthError('Conta não autorizada') })
  })

  it('should reject a foreign mutation and persist only the owner operation', async () => {
    const other = await otherAccount()
    const owned = await seed(auth.getAccountId(), 'Original note', '2025-01-01T12:00:00Z')
    const foreign = await seed(other.getAccountId(), 'Other note', '2025-01-02T12:00:00Z')
    const before = await database.select().from(noteModel).orderBy(asc(noteModel.id))
    const denied = await request(hono.server)
      .delete(`/profile/notes/${owned.id}`)
      .set(other.getAuthorizationHeader())
    expect(denied.status).toBe(HTTP_STATUS_CODE.notFound)
    expect(denied.body).toEqual({ ...new NoteNotFoundError() })
    expect(await database.select().from(noteModel).orderBy(asc(noteModel.id))).toEqual(
      before,
    )
    const response = await request(hono.server)
      .delete(`/profile/notes/${owned.id}`)
      .set(auth.getAuthorizationHeader())
    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.text).toBe('')
    expect(
      await database.select().from(noteModel).where(eq(noteModel.id, owned.id)),
    ).toEqual([])
    expect(
      await database.select().from(noteModel).where(eq(noteModel.id, foreign.id)),
    ).toEqual([foreign])
  })
})
