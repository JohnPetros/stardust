import { createHmac, randomUUID } from 'node:crypto'
import postgres from 'postgres'
import { performance } from 'node:perf_hooks'
import request from 'supertest'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { AuthFixture } from '@/tests/fixtures/AuthFixture'
import { SupabaseFixture } from '@/tests/fixtures/SupabaseFixture'
import { ProfileFixture } from '@/tests/fixtures/ProfileFixture'
import { DrizzleClient } from '@/database/drizzle/DrizzleClient'
import { ENV } from '@/constants'
import { HonoFixture } from '@/tests/fixtures/HonoFixture'

const pause = (duration: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, duration))

// Valid signed test attempts use the runtime secret in memory, never in logs/artifacts.
function receipt(expiresInSeconds = 900, accountId: string = randomUUID()): string {
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds
  const payload = Buffer.from(
    JSON.stringify({
      version: 1,
      audience: 'profile-onboarding',
      accountId,
      email: 'stream-route@example.com',
      name: 'Stream Route',
      nonce: randomUUID(),
      iat: exp - 900,
      exp,
    }),
  ).toString('base64url')
  return `${payload}.${createHmac('sha256', ENV.onboardingReceiptSecret).update(payload).digest('base64url')}`
}

describe('[GET] /profile/events lifecycle against local PostgreSQL', () => {
  const fixture = new HonoFixture()
  const supabaseFixture = new SupabaseFixture()
  const auth = new AuthFixture(supabaseFixture.supabase)
  const sql = postgres(ENV.databaseUrl, { max: 2 })

  beforeAll(async () => {
    await fixture.setup()
  })
  afterAll(async () => {
    await sql.end({ timeout: 2 })
    await DrizzleClient.close()
  })

  async function withBlockedUsersQuery(run: () => Promise<void>): Promise<void> {
    let release!: () => void
    let locked!: () => void
    const acquired = new Promise<void>((resolve) => {
      locked = resolve
    })
    const released = new Promise<void>((resolve) => {
      release = resolve
    })
    const lock = sql.begin(async (transaction) => {
      await transaction`LOCK TABLE public.users IN ACCESS EXCLUSIVE MODE`
      locked()
      await released
    })
    await acquired
    try {
      await run()
    } finally {
      release()
      await lock
    }
  }

  async function expectBlockedQuery(): Promise<void> {
    const deadline = Date.now() + 3000
    while (Date.now() < deadline) {
      const rows =
        await sql`SELECT count(*)::int AS count FROM pg_stat_activity WHERE datname = current_database() AND pid <> pg_backend_pid() AND wait_event_type = 'Lock' AND query ILIKE ${'%users%'} AND query ILIKE ${'%select%'}`
      if (rows[0].count > 0) return
      await pause(20)
    }
    throw new Error('Expected a real profile query to wait on the local users lock')
  }

  async function open(signal?: AbortSignal, expiresInSeconds = 900): Promise<Response> {
    return fixture.hono.fetch(
      new Request('http://localhost/profile/events', {
        headers: { 'X-Onboarding-Receipt': receipt(expiresInSeconds) },
        signal,
      }),
    )
  }

  it.each(['receipt', 'bearer'] as const)(
    'emits only the persisted profile belonging to the %s identity',
    async (authorization) => {
      await supabaseFixture.clearDatabase()
      await auth.createAccount()
      const accountId = auth.getAccountId()
      const profiles = new ProfileFixture(supabaseFixture.supabase)
      await profiles.createAccountUser(accountId)
      const foreignAuth = new AuthFixture(supabaseFixture.supabase)
      await foreignAuth.createAccount()
      const foreignId = foreignAuth.getAccountId()
      await profiles.createAccountUser(foreignId)
      const [own] =
        await sql`SELECT id, name, email, slug FROM public.users WHERE id = ${accountId}`
      const [foreign] =
        await sql`SELECT id, name, email, slug FROM public.users WHERE id = ${foreignId}`
      const headers =
        authorization === 'receipt'
          ? { 'X-Onboarding-Receipt': receipt(900, accountId) }
          : {
              ...auth.getAuthorizationHeader(),
              'X-Onboarding-Receipt': receipt(900, foreignId),
            }
      const response = await request(fixture.server)
        .get('/profile/events')
        .set(headers)
        .buffer(true)
      expect(response.status).toBe(HTTP_STATUS_CODE.ok)
      const body = response.text
      expect(body).toContain('retry:1000')
      expect(body.match(/event: user.created/g)).toHaveLength(1)
      expect(body).toContain(`id: profile:${accountId}`)
      const data = body.split('\n').find((line) => line.startsWith('data:'))
      if (!data) throw new Error('Expected the persisted profile event data')
      expect(JSON.parse(data.slice(5))).toEqual({
        userId: own.id,
        userName: own.name,
        userEmail: own.email,
        userSlug: own.slug,
      })
      expect(body).not.toContain(foreign.id)
      expect(body).not.toContain(foreign.email)
      expect(body).not.toContain(foreign.slug)
    },
  )

  it.each(['missing', 'tampered', 'expired'] as const)(
    'rejects a %s receipt before opening SSE',
    async (kind) => {
      const headers: Record<string, string> = {}
      if (kind === 'tampered') {
        const valid = receipt()
        headers['X-Onboarding-Receipt'] =
          `${valid[0] === 'a' ? 'b' : 'a'}${valid.slice(1)}`
      }
      if (kind === 'expired') headers['X-Onboarding-Receipt'] = receipt(-1)
      const response = await request(fixture.server)
        .get('/profile/events')
        .set(headers)
        .buffer(true)
      expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
      expect(response.headers['content-type']).not.toContain('text/event-stream')
      expect(response.text).not.toContain('event: user.created')
    },
  )

  it.each(['invalid', 'expired', 'forged'] as const)(
    'does not fall back to a valid receipt when a present bearer is %s',
    async (kind) => {
      const claims = Buffer.from(
        JSON.stringify({
          sub: randomUUID(),
          exp: kind === 'expired' ? 1 : Math.floor(Date.now() / 1000) + 3600,
        }),
      ).toString('base64url')
      const bearer =
        kind === 'invalid'
          ? 'Bearer invalid'
          : `Bearer eyJhbGciOiJub25lIn0.${claims}.forged`
      const response = await request(fixture.server)
        .get('/profile/events')
        .set({ Authorization: bearer, 'X-Onboarding-Receipt': receipt() })
      expect(response.status).toBe(HTTP_STATUS_CODE.unauthorized)
      expect(response.headers['content-type']).not.toContain('text/event-stream')
      expect(response.text).not.toContain('event: user.created')
    },
  )

  it('returns the final no-store SSE headers', async () => {
    await supabaseFixture.clearDatabase()
    await auth.createAccount()
    await new ProfileFixture(supabaseFixture.supabase).createAccountUser(
      auth.getAccountId(),
    )
    const response = await request(fixture.server)
      .get('/profile/events')
      .set('X-Onboarding-Receipt', receipt(900, auth.getAccountId()))
      .buffer(true)
    expect(response.status).toBe(HTTP_STATUS_CODE.ok)
    expect(response.headers['content-type']).toContain('text/event-stream')
    expect(response.headers['cache-control']).toBe('no-store,no-transform')
    expect(response.headers['x-accel-buffering']).toBe('no')
  })

  it('keeps a blocked lookup serial past the poll interval and emits one persisted profile after release', async () => {
    await supabaseFixture.clearDatabase()
    await auth.createAccount()
    const accountId = auth.getAccountId()
    await new ProfileFixture(supabaseFixture.supabase).createAccountUser(accountId)
    const [persisted] =
      await sql`SELECT id, name, email, slug FROM public.users WHERE id = ${accountId}`
    const controller = new AbortController()
    let reader: ReadableStreamDefaultReader<Uint8Array> | undefined
    let terminal: ReturnType<ReadableStreamDefaultReader<Uint8Array>['read']> | undefined
    try {
      await withBlockedUsersQuery(async () => {
        const response = await fixture.hono.fetch(
          new Request('http://localhost/profile/events', {
            headers: { 'X-Onboarding-Receipt': receipt(900, accountId) },
            signal: controller.signal,
          }),
        )
        expect(response.status).toBe(HTTP_STATUS_CODE.ok)
        if (!response.body) throw new Error('Profile stream response body is missing')
        reader = response.body.getReader()
        expect(new TextDecoder().decode((await reader.read()).value)).toContain(
          'retry:1000',
        )
        terminal = reader.read()
        await expectBlockedQuery()
        await pause(1200)
        const waiting =
          await sql`SELECT pid FROM pg_stat_activity WHERE datname = current_database() AND pid <> pg_backend_pid() AND wait_event_type = 'Lock' AND query ILIKE ${'%users%'} AND query ILIKE ${'%select%'}`
        expect(waiting).toHaveLength(1)
        await pause(200)
        const stillWaiting =
          await sql`SELECT pid FROM pg_stat_activity WHERE datname = current_database() AND pid <> pg_backend_pid() AND wait_event_type = 'Lock' AND query ILIKE ${'%users%'} AND query ILIKE ${'%select%'}`
        expect(stillWaiting.map((row) => row.pid)).toEqual(waiting.map((row) => row.pid))
      })
      if (!reader || !terminal) throw new Error('Expected an open profile stream reader')
      const frame = await terminal
      expect(frame.done).toBe(false)
      let body = new TextDecoder().decode(frame.value)
      for (;;) {
        const next = await reader.read()
        if (next.done) break
        body += new TextDecoder().decode(next.value)
      }
      expect(body.match(/event: user.created/g)).toHaveLength(1)
      expect(body).toContain(`id: profile:${accountId}`)
      const data = body.split('\n').find((line) => line.startsWith('data:'))
      if (!data) throw new Error('Expected persisted profile event data')
      expect(JSON.parse(data.slice(5))).toEqual({
        userId: persisted.id,
        userName: persisted.name,
        userEmail: persisted.email,
        userSlug: persisted.slug,
      })
      expect(await reader.read()).toEqual({ done: true, value: undefined })
    } finally {
      controller.abort()
      await reader?.cancel()
      reader?.releaseLock()
    }
  })

  it('observes initial absence before emitting the profile created on the open connection', async () => {
    await supabaseFixture.clearDatabase()
    await auth.createAccount()
    const accountId = auth.getAccountId()
    const profiles = new ProfileFixture(supabaseFixture.supabase)
    const foreignAuth = new AuthFixture(supabaseFixture.supabase)
    await foreignAuth.createAccount()
    const foreignId = foreignAuth.getAccountId()
    await profiles.createAccountUser(foreignId)
    const [foreign] =
      await sql`SELECT id, email, slug FROM public.users WHERE id = ${foreignId}`
    const controller = new AbortController()
    let reader: ReadableStreamDefaultReader<Uint8Array> | undefined
    let terminal: ReturnType<ReadableStreamDefaultReader<Uint8Array>['read']> | undefined
    let lookupPid: number | undefined
    let terminalReceived = false
    try {
      await withBlockedUsersQuery(async () => {
        const response = await fixture.hono.fetch(
          new Request('http://localhost/profile/events', {
            headers: { 'X-Onboarding-Receipt': receipt(900, accountId) },
            signal: controller.signal,
          }),
        )
        expect(response.status).toBe(HTTP_STATUS_CODE.ok)
        if (!response.body) throw new Error('Profile stream response body is missing')
        reader = response.body.getReader()
        expect(new TextDecoder().decode((await reader.read()).value)).toContain(
          'retry:1000',
        )
        terminal = reader.read().then((result) => {
          terminalReceived = true
          return result
        })
        await expectBlockedQuery()
        const waiting =
          await sql`SELECT pid FROM pg_stat_activity WHERE datname = current_database() AND pid <> pg_backend_pid() AND wait_event_type = 'Lock' AND query ILIKE ${'%users%'} AND query ILIKE ${'%select%'}`
        expect(waiting).toHaveLength(1)
        lookupPid = waiting[0].pid
      })
      if (lookupPid === undefined)
        throw new Error('Expected the blocked profile lookup PID')
      const deadline = Date.now() + 3000
      let lookupCompleted = false
      while (Date.now() < deadline) {
        const activity =
          await sql`SELECT state FROM pg_stat_activity WHERE pid = ${lookupPid}`
        if (activity[0]?.state === 'idle') {
          lookupCompleted = true
          break
        }
        await pause(20)
      }
      expect(lookupCompleted).toBe(true)
      const absent = await sql`SELECT id FROM public.users WHERE id = ${accountId}`
      expect(absent).toHaveLength(0)
      expect(terminalReceived).toBe(false)
      await profiles.createAccountUser(accountId)
      const [persisted] =
        await sql`SELECT id, name, email, slug FROM public.users WHERE id = ${accountId}`
      if (!reader || !terminal) throw new Error('Expected an open profile stream reader')
      const frame = await terminal
      expect(frame.done).toBe(false)
      let body = new TextDecoder().decode(frame.value)
      for (;;) {
        const next = await reader.read()
        if (next.done) break
        body += new TextDecoder().decode(next.value)
      }
      expect(body.match(/event: user.created/g)).toHaveLength(1)
      expect(body).toContain(`id: profile:${accountId}`)
      const data = body.split('\n').find((line) => line.startsWith('data:'))
      if (!data) throw new Error('Expected newly persisted profile event data')
      expect(JSON.parse(data.slice(5))).toEqual({
        userId: persisted.id,
        userName: persisted.name,
        userEmail: persisted.email,
        userSlug: persisted.slug,
      })
      expect(body).not.toContain(foreign.id)
      expect(body).not.toContain(foreign.email)
      expect(body).not.toContain(foreign.slug)
      expect(await reader.read()).toEqual({ done: true, value: undefined })
    } finally {
      controller.abort()
      await reader?.cancel()
      reader?.releaseLock()
    }
  })

  it('discovers a profile created while disconnected after reconnecting with the same receipt', async () => {
    await supabaseFixture.clearDatabase()
    await auth.createAccount()
    const accountId = auth.getAccountId()
    const profiles = new ProfileFixture(supabaseFixture.supabase)
    const foreignAuth = new AuthFixture(supabaseFixture.supabase)
    await foreignAuth.createAccount()
    const foreignId = foreignAuth.getAccountId()
    await profiles.createAccountUser(foreignId)
    const [foreign] =
      await sql`SELECT id, email, slug FROM public.users WHERE id = ${foreignId}`
    const absent = await sql`SELECT id FROM public.users WHERE id = ${accountId}`
    expect(absent).toHaveLength(0)
    const signedReceipt = receipt(900, accountId)
    const before = new Set(process.listeners('SIGTERM'))
    const firstController = new AbortController()
    const secondController = new AbortController()
    let firstReader: ReadableStreamDefaultReader<Uint8Array> | undefined
    let secondReader: ReadableStreamDefaultReader<Uint8Array> | undefined
    let lookupPid: number | undefined
    try {
      await withBlockedUsersQuery(async () => {
        const response = await fixture.hono.fetch(
          new Request('http://localhost/profile/events', {
            headers: { 'X-Onboarding-Receipt': signedReceipt },
            signal: firstController.signal,
          }),
        )
        expect(response.status).toBe(HTTP_STATUS_CODE.ok)
        if (!response.body)
          throw new Error('First profile stream response body is missing')
        firstReader = response.body.getReader()
        const initial = await firstReader.read()
        expect(initial.done).toBe(false)
        expect(new TextDecoder().decode(initial.value)).toBe('retry:1000\n\n')
        await expectBlockedQuery()
        const waiting =
          await sql`SELECT pid FROM pg_stat_activity WHERE datname = current_database() AND pid <> pg_backend_pid() AND wait_event_type = 'Lock' AND query ILIKE ${'%users%'} AND query ILIKE ${'%select%'}`
        expect(waiting).toHaveLength(1)
        lookupPid = waiting[0].pid
      })
      if (lookupPid === undefined)
        throw new Error('Expected the first profile lookup PID')
      const deadline = Date.now() + 3000
      let lookupCompleted = false
      while (Date.now() < deadline) {
        const activity =
          await sql`SELECT state FROM pg_stat_activity WHERE pid = ${lookupPid}`
        if (activity[0]?.state === 'idle') {
          lookupCompleted = true
          break
        }
        await pause(20)
      }
      expect(lookupCompleted).toBe(true)
      expect(await sql`SELECT id FROM public.users WHERE id = ${accountId}`).toHaveLength(
        0,
      )
      if (!firstReader) throw new Error('Expected the first profile stream reader')
      const firstClosed = firstReader.read()
      firstController.abort()
      await expect(firstClosed).resolves.toEqual({ done: true, value: undefined })
      expect(
        process.listeners('SIGTERM').filter((listener) => !before.has(listener)),
      ).toHaveLength(0)
      await profiles.createAccountUser(accountId)
      const [persisted] =
        await sql`SELECT id, name, email, slug FROM public.users WHERE id = ${accountId}`
      const response = await fixture.hono.fetch(
        new Request('http://localhost/profile/events', {
          headers: { 'X-Onboarding-Receipt': signedReceipt },
          signal: secondController.signal,
        }),
      )
      expect(response.status).toBe(HTTP_STATUS_CODE.ok)
      if (!response.body)
        throw new Error('Reconnected profile stream response body is missing')
      secondReader = response.body.getReader()
      let body = ''
      for (;;) {
        const next = await secondReader.read()
        if (next.done) break
        body += new TextDecoder().decode(next.value)
      }
      expect(body.match(/retry:1000/g)).toHaveLength(1)
      expect(body.match(/event: user.created/g)).toHaveLength(1)
      expect(body.match(/id: profile:/g)).toHaveLength(1)
      expect(body).toContain(`id: profile:${accountId}`)
      const data = body.split('\n').find((line) => line.startsWith('data:'))
      if (!data) throw new Error('Expected the reconnected persisted profile event data')
      expect(JSON.parse(data.slice(5))).toEqual({
        userId: persisted.id,
        userName: persisted.name,
        userEmail: persisted.email,
        userSlug: persisted.slug,
      })
      expect(body).not.toContain(foreign.id)
      expect(body).not.toContain(foreign.email)
      expect(body).not.toContain(foreign.slug)
      expect(body).not.toContain('onboarding.expired')
      expect(body).not.toContain('error')
      expect(await secondReader.read()).toEqual({ done: true, value: undefined })
      expect(
        process.listeners('SIGTERM').filter((listener) => !before.has(listener)),
      ).toHaveLength(0)
    } finally {
      firstController.abort()
      secondController.abort()
      try {
        await Promise.all([firstReader?.cancel(), secondReader?.cancel()])
      } finally {
        firstReader?.releaseLock()
        secondReader?.releaseLock()
      }
    }
  })

  it('emits a real heartbeat while no profile exists and cleans up on abort', async () => {
    await supabaseFixture.clearDatabase()
    await auth.createAccount()
    const accountId = auth.getAccountId()
    const absent = await sql`SELECT id FROM public.users WHERE id = ${accountId}`
    expect(absent).toHaveLength(0)
    const before = new Set(process.listeners('SIGTERM'))
    const controller = new AbortController()
    let reader: ReadableStreamDefaultReader<Uint8Array> | undefined
    try {
      const waitingSince = performance.now()
      const response = await fixture.hono.fetch(
        new Request('http://localhost/profile/events', {
          headers: { 'X-Onboarding-Receipt': receipt(900, accountId) },
          signal: controller.signal,
        }),
      )
      expect(response.status).toBe(HTTP_STATUS_CODE.ok)
      if (!response.body) throw new Error('Profile stream response body is missing')
      reader = response.body.getReader()
      const initial = await reader.read()
      expect(initial.done).toBe(false)
      let body = new TextDecoder().decode(initial.value)
      expect(body).toContain('retry:1000')
      const heartbeat = await reader.read()
      expect(performance.now() - waitingSince).toBeGreaterThanOrEqual(14000)
      expect(heartbeat.done).toBe(false)
      const comment = new TextDecoder().decode(heartbeat.value)
      expect(comment).toBe(': heartbeat\n\n')
      body += comment
      expect(body).not.toContain('event: user.created')
      const stillAbsent = await sql`SELECT id FROM public.users WHERE id = ${accountId}`
      expect(stillAbsent).toHaveLength(0)
      const closed = reader.read()
      controller.abort()
      await expect(closed).resolves.toEqual({ done: true, value: undefined })
      expect(
        process.listeners('SIGTERM').filter((listener) => !before.has(listener)),
      ).toHaveLength(0)
    } finally {
      controller.abort()
      await reader?.cancel()
      reader?.releaseLock()
    }
  }, 25000)

  it('closes at the real 60-second cap while the receipt remains valid', async () => {
    await supabaseFixture.clearDatabase()
    await auth.createAccount()
    const accountId = auth.getAccountId()
    const absent = await sql`SELECT id FROM public.users WHERE id = ${accountId}`
    expect(absent).toHaveLength(0)
    const before = new Set(process.listeners('SIGTERM'))
    const controller = new AbortController()
    let reader: ReadableStreamDefaultReader<Uint8Array> | undefined
    try {
      const waitingSince = performance.now()
      const response = await fixture.hono.fetch(
        new Request('http://localhost/profile/events', {
          headers: { 'X-Onboarding-Receipt': receipt(900, accountId) },
          signal: controller.signal,
        }),
      )
      expect(response.status).toBe(HTTP_STATUS_CODE.ok)
      if (!response.body) throw new Error('Profile stream response body is missing')
      reader = response.body.getReader()
      const initial = await reader.read()
      expect(initial.done).toBe(false)
      let body = new TextDecoder().decode(initial.value)
      expect(body).toBe('retry:1000\n\n')
      let heartbeats = 0
      for (;;) {
        const next = await reader.read()
        if (next.done) break
        const comment = new TextDecoder().decode(next.value)
        expect(comment).toBe(': heartbeat\n\n')
        heartbeats += 1
        body += comment
      }
      const elapsed = performance.now() - waitingSince
      expect(elapsed).toBeGreaterThanOrEqual(59000)
      expect(elapsed).toBeLessThan(70000)
      // A fourth heartbeat may race with close at exactly 60 seconds.
      expect(heartbeats).toBeGreaterThanOrEqual(3)
      expect(body).not.toContain('onboarding.expired')
      expect(body).not.toContain('user.created')
      expect(await reader.read()).toEqual({ done: true, value: undefined })
      expect(
        process.listeners('SIGTERM').filter((listener) => !before.has(listener)),
      ).toHaveLength(0)
      const stillAbsent = await sql`SELECT id FROM public.users WHERE id = ${accountId}`
      expect(stillAbsent).toHaveLength(0)
    } finally {
      controller.abort()
      await reader?.cancel()
      reader?.releaseLock()
    }
  }, 80000)

  it('closes without leaking an error payload when the real profile lookup fails after SSE opens', async () => {
    await supabaseFixture.clearDatabase()
    await auth.createAccount()
    const before = new Set(process.listeners('SIGTERM'))
    const controller = new AbortController()
    let reader: ReadableStreamDefaultReader<Uint8Array> | undefined
    let renamed = false
    try {
      await sql`ALTER TABLE public.users RENAME COLUMN id TO stream_lookup_failure_id`
      renamed = true
      const response = await fixture.hono.fetch(
        new Request('http://localhost/profile/events', {
          headers: { 'X-Onboarding-Receipt': receipt(900, auth.getAccountId()) },
          signal: controller.signal,
        }),
      )
      expect(response.status).toBe(HTTP_STATUS_CODE.ok)
      expect(response.headers.get('content-type')).toContain('text/event-stream')
      expect(response.headers.get('cache-control')).toBe('no-store,no-transform')
      expect(response.headers.get('x-accel-buffering')).toBe('no')
      if (!response.body) throw new Error('Profile stream response body is missing')
      reader = response.body.getReader()
      const initial = await reader.read()
      expect(initial.done).toBe(false)
      let body = new TextDecoder().decode(initial.value)
      expect(body).toBe('retry:1000\n\n')
      for (;;) {
        const next = await reader.read()
        if (next.done) break
        body += new TextDecoder().decode(next.value)
      }
      expect(body).toBe('retry:1000\n\n')
      expect(body).not.toContain('error')
      expect(body).not.toContain('{')
      expect(body).not.toContain('user.created')
      expect(body).not.toContain('onboarding.expired')
      expect(await reader.read()).toEqual({ done: true, value: undefined })
      expect(
        process.listeners('SIGTERM').filter((listener) => !before.has(listener)),
      ).toHaveLength(0)
    } finally {
      controller.abort()
      try {
        await reader?.cancel()
      } finally {
        if (renamed)
          await sql`ALTER TABLE public.users RENAME COLUMN stream_lookup_failure_id TO id`
        reader?.releaseLock()
      }
    }
  })

  it('emits one expiry terminal while the initial real profile query remains locked', async () => {
    await supabaseFixture.clearDatabase()
    await auth.createAccount()
    const before = new Set(process.listeners('SIGTERM'))
    const controller = new AbortController()
    let reader: ReadableStreamDefaultReader<Uint8Array> | undefined
    let expiryFrame:
      | ReturnType<ReadableStreamDefaultReader<Uint8Array>['read']>
      | undefined
    try {
      await withBlockedUsersQuery(async () => {
        const response = await fixture.hono.fetch(
          new Request('http://localhost/profile/events', {
            headers: { 'X-Onboarding-Receipt': receipt(3, auth.getAccountId()) },
            signal: controller.signal,
          }),
        )
        expect(response.status).toBe(HTTP_STATUS_CODE.ok)
        if (!response.body) throw new Error('Profile stream response body is missing')
        reader = response.body.getReader()
        expect(new TextDecoder().decode((await reader.read()).value)).toContain(
          'retry:1000',
        )
        const terminal = reader.read()
        await expectBlockedQuery()
        expiryFrame = terminal
        await pause(3300)
      })
      if (!reader || !expiryFrame) throw new Error('Expected the expiry stream reader')
      const frame = await expiryFrame
      expect(frame.done).toBe(false)
      let body = new TextDecoder().decode(frame.value)
      for (;;) {
        const next = await reader.read()
        if (next.done) break
        body += new TextDecoder().decode(next.value)
      }
      expect(body.match(/event: onboarding.expired/g)).toHaveLength(1)
      const data = body.split('\n').find((line) => line.startsWith('data:'))
      if (!data) throw new Error('Expected the expiry event data')
      expect(JSON.parse(data.slice(5))).toEqual({})
      expect(body).not.toContain('event: user.created')
      expect(body).not.toContain('heartbeat')
      expect(
        process.listeners('SIGTERM').filter((listener) => !before.has(listener)),
      ).toHaveLength(0)
      await pause(1100)
      if (!reader) throw new Error('Expected the completed profile stream reader')
      expect(await reader.read()).toEqual({ done: true, value: undefined })
    } finally {
      controller.abort()
      await reader?.cancel()
      reader?.releaseLock()
    }
  })

  it('expires and removes shutdown listeners even when its reader applies backpressure', async () => {
    await supabaseFixture.clearDatabase()
    await auth.createAccount()
    const before = process.listenerCount('SIGTERM')
    const controller = new AbortController()
    let reader: ReadableStreamDefaultReader<Uint8Array> | undefined
    try {
      const response = await fixture.hono.fetch(
        new Request('http://localhost/profile/events', {
          headers: { 'X-Onboarding-Receipt': receipt(2, auth.getAccountId()) },
          signal: controller.signal,
        }),
      )
      expect(response.status).toBe(HTTP_STATUS_CODE.ok)
      if (!response.body) throw new Error('Profile stream response body is missing')
      reader = response.body.getReader()
      const initial = await reader.read()
      expect(initial.done).toBe(false)
      expect(new TextDecoder().decode(initial.value)).toContain('retry:1000')
      // Leave the reader idle after consuming the initial frame until receipt expiry.
      await pause(2300)
      let body = ''
      for (;;) {
        const next = await reader.read()
        if (next.done) break
        body += new TextDecoder().decode(next.value)
      }
      expect(body.match(/event: onboarding.expired/g)).toHaveLength(1)
      const data = body.split('\n').find((line) => line.startsWith('data:'))
      if (!data) throw new Error('Expected the expiry event data')
      expect(JSON.parse(data.slice(5))).toEqual({})
      expect(body).not.toContain('event: user.created')
      expect(body).not.toContain('heartbeat')
      expect(await reader.read()).toEqual({ done: true, value: undefined })
      expect(process.listenerCount('SIGTERM')).toBe(before)
    } finally {
      controller.abort()
      await reader?.cancel()
      reader?.releaseLock()
    }
  })

  it.each(['abort', 'shutdown'] as const)(
    'closes immediately on %s while the real query is pending',
    async (cause) => {
      const before = new Set(process.listeners('SIGTERM'))
      const controller = new AbortController()
      let response!: Response
      let reader!: ReadableStreamDefaultReader<Uint8Array>
      await withBlockedUsersQuery(async () => {
        response = await open(controller.signal)
        if (!response.body) throw new Error('Profile stream response body is missing')
        reader = response.body.getReader()
        expect(new TextDecoder().decode((await reader.read()).value)).toContain(
          'retry:1000',
        )
        const terminal = reader.read()
        await expectBlockedQuery()
        if (cause === 'abort') controller.abort()
        else {
          // Invoke the actual stream shutdown callback without terminating Jest or its DB pool.
          const callbacks = process
            .listeners('SIGTERM')
            .filter((listener) => !before.has(listener))
          expect(callbacks).toHaveLength(1)
          callbacks[0]('SIGTERM')
        }
        await expect(
          Promise.race([
            terminal,
            pause(500).then(() => {
              throw new Error('Stream did not cancel pending query output')
            }),
          ]),
        ).resolves.toEqual({ done: true, value: undefined })
        expect(
          process.listeners('SIGTERM').filter((listener) => !before.has(listener)),
        ).toHaveLength(0)
      })
      await pause(1100)
      await expect(reader.read()).resolves.toEqual({ done: true, value: undefined })
      reader.releaseLock()
    },
  )
})
