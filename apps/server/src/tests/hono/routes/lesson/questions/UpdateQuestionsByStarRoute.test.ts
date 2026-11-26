import { asc, eq } from 'drizzle-orm'
import request from 'supertest'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError, NotGodAccountError } from '@stardust/core/global/errors'
import { Id } from '@stardust/core/global/structures'
import { ENV } from '@/constants'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'
import { starModel } from '@/database/drizzle/schema'
import { SpaceFixture, type CreatedStar } from '@/tests/fixtures/SpaceFixture'
import type { OpenQuestionDto } from '@stardust/core/lesson/entities/dtos'
describe('[PUT] /lesson/questions/star/:starId', () => {
  const hono = new HonoFixture()
  const fixture = new SupabaseFixture()
  const auth = new AuthFixture(fixture.supabase)
  const space = new SpaceFixture(fixture.supabase)
  const database = fixture.database
  const stars: CreatedStar[] = []
  beforeAll(async () => {
    await hono.setup()
  })
  afterAll(async () => {
    await DrizzleClient.close()
  })
  beforeEach(async () => {
    ENV.godAccountIds = []
    await fixture.clearDatabase()
    stars.length = 0
    await auth.createAccount()
    stars.push(await space.createStar())
  })
  afterEach(async () => {
    await space.cleanupCreatedStars(stars)
  })
  const questions: OpenQuestionDto[] = [
    {
      id: Id.create().value,
      type: 'open',
      stem: 'Complete output command',
      picture: 'question.jpg',
      answers: ['escreva'],
      lines: [{ number: 1, texts: ['input-1', '(1)'], indentation: 0 }],
    },
  ]
  it('should reject anonymous requests', async () => {
    const response = await request(hono.server).put(
      `/lesson/questions/star/${stars[0].id}`,
    )
    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual({ ...new AuthError('Conta não autorizada') })
  })
  it('should reject ordinary writes unchanged and persist the God update', async () => {
    const before = await database.select().from(starModel).orderBy(asc(starModel.id))
    const denied = await request(hono.server)
      .put(`/lesson/questions/star/${stars[0].id}`)
      .set(auth.getAuthorizationHeader())
      .send({ questions })
    expect(denied.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(denied.body).toEqual({ ...new NotGodAccountError() })
    expect(await database.select().from(starModel).orderBy(asc(starModel.id))).toEqual(
      before,
    )
    ENV.godAccountIds = [auth.getAccountId()]
    const response = await request(hono.server)
      .put(`/lesson/questions/star/${stars[0].id}`)
      .set(auth.getAuthorizationHeader())
      .send({ questions })
    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.body).toEqual(questions)
    expect(await database.select().from(starModel).orderBy(asc(starModel.id))).toEqual(
      before.map((row) =>
        row.id === stars[0].id
          ? {
              ...row,
              questions: questions,
            }
          : row,
      ),
    )
  })
})
