import { asc, eq } from 'drizzle-orm'
import request from 'supertest'
import postgres from 'postgres'
import type { TextBlockDto } from '@stardust/core/global/entities/dtos'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthError, NotGodAccountError } from '@stardust/core/global/errors'
import { ENV } from '@/constants'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { starModel } from '@/database/drizzle/schema'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { SpaceFixture, type CreatedStar } from '@/tests/fixtures/SpaceFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'
describe('[DELETE] /lesson/text-blocks/star/:starId/audio/file', () => {
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
    await sql.end({ timeout: 2 })
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
  const blocks: TextBlockDto[] = [
    {
      type: 'default',
      content: 'First narration',
      title: 'First title',
      picture: 'first.jpg',
      isRunnable: false,
    },
    {
      type: 'quote',
      content: 'Second narration',
      title: 'Second title',
      isRunnable: false,
    },
    { type: 'code', content: 'escreva(1)', isRunnable: true },
  ]

  const sql = postgres(ENV.databaseUrl, { max: 2 })
  async function withLockedStar(
    run: (lockHolderPid: number) => Promise<void>,
  ): Promise<void> {
    let release!: () => void
    let locked!: (pid: number) => void
    const acquired = new Promise<number>((resolve) => {
      locked = resolve
    })
    const released = new Promise<void>((resolve) => {
      release = resolve
    })
    const lock = sql.begin(async (transaction) => {
      await transaction`SELECT id FROM public.stars WHERE id = ${stars[0].id}::uuid FOR UPDATE`
      const [holder] = await transaction<
        { pid: number }[]
      >`SELECT pg_backend_pid() AS pid`
      locked(holder.pid)
      await released
    })
    const lockHolderPid = await Promise.race([
      acquired,
      lock.then(() => {
        throw new Error('Star lock ended before acquisition')
      }),
    ])
    try {
      await run(lockHolderPid)
    } finally {
      release()
      await lock
    }
  }
  async function expectTwoBlockedUpdates(lockHolderPid: number): Promise<void> {
    const deadline = Date.now() + 5000
    while (Date.now() < deadline) {
      const rows = await sql<{ count: number }[]>`
          WITH RECURSIVE candidates AS (
            SELECT pid FROM pg_stat_activity
            WHERE datname = current_database()
              AND pid <> pg_backend_pid()
              AND wait_event_type = 'Lock'
              AND query ILIKE ${'%update%'}
              AND query ILIKE ${'%stars%'}
              AND query ILIKE ${'%jsonb_set%'}
          ), blocker_walk(origin_pid, pid, path) AS (
            SELECT pid, pid, ARRAY[pid] FROM candidates
            UNION ALL
            SELECT walk.origin_pid, blocker.pid, walk.path || blocker.pid
            FROM blocker_walk AS walk
            CROSS JOIN LATERAL unnest(pg_blocking_pids(walk.pid)) AS blocker(pid)
            WHERE NOT blocker.pid = ANY(walk.path)
          )
          SELECT count(DISTINCT origin_pid)::int AS count
          FROM blocker_walk WHERE pid = ${lockHolderPid}::int
        `
      if (rows[0].count >= 2) return
      await new Promise<void>((resolve) => setTimeout(resolve, 20))
    }
    throw new Error('Expected two real JSONB updates blocked by the held star row lock')
  }
  it('should reject anonymous requests', async () => {
    const response = await request(hono.server).delete(
      `/lesson/text-blocks/star/${stars[0].id}/audio/file`,
    )
    expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(response.body).toEqual({ ...new AuthError('Conta não autorizada') })
  })

  it('should deny ordinary writes and preserve both concurrent per-index audio changes', async () => {
    const seeded = blocks.map((block, index) =>
      index < 2
        ? {
            ...block,
            audio: {
              fileName: '',
              voice: index === 0 ? 'panda' : 'shark',
              status: 'error',
            },
          }
        : block,
    )
    await database
      .update(starModel)
      .set({ texts: seeded })
      .where(eq(starModel.id, stars[0].id))
    const before = await database.select().from(starModel).orderBy(asc(starModel.id))
    const denied = await request(hono.server)
      .delete(`/lesson/text-blocks/star/${stars[0].id}/audio/file`)
      .set(auth.getAuthorizationHeader())
      .send({ blockIndex: 0 })
    expect(denied.status).toBe(HTTP_STATUS_CODE.unauthorized)
    expect(denied.body).toEqual({ ...new NotGodAccountError() })
    expect(await database.select().from(starModel).orderBy(asc(starModel.id))).toEqual(
      before,
    )
    ENV.godAccountIds = [auth.getAccountId()]
    const pending: Promise<request.Response>[] = []
    try {
      await withLockedStar(async (lockHolderPid) => {
        for (const blockIndex of [0, 1])
          pending.push(
            request(hono.server)
              .delete(`/lesson/text-blocks/star/${stars[0].id}/audio/file`)
              .set(auth.getAuthorizationHeader())
              .send({ blockIndex })
              .then((response) => response),
          )
        await expectTwoBlockedUpdates(lockHolderPid)
      })
      const responses = await Promise.all(pending)
      expect(responses).toHaveLength(2)
      for (const [index, response] of responses.entries()) {
        expect(response.status).toBe(HTTP_STATUS_CODE.ok)
        expect(response.body).toEqual(
          seeded.map((block, blockIndex) =>
            blockIndex === index ? blocks[blockIndex] : block,
          ),
        )
      }
      expect(await database.select().from(starModel).orderBy(asc(starModel.id))).toEqual(
        before.map((row) => (row.id === stars[0].id ? { ...row, texts: blocks } : row)),
      )
    } finally {
      await Promise.allSettled(pending)
    }
  })
})
