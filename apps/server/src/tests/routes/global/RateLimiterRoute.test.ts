import request from 'supertest'
import IORedis from 'ioredis'
import { createHash } from 'node:crypto'

import { HTTP_HEADERS, HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import type {
  RateLimitDecision,
  RateLimitInput,
  RateLimiterProvider,
  TelemetryProvider,
} from '@stardust/core/global/interfaces'

import { HonoFixture } from '@/tests/fixtures/HonoFixture'
import { IORedisRateLimiterProvider } from '@/provision/rate-limiter'

class CountingRateLimiter implements RateLimiterProvider {
  readonly calls: RateLimitInput[] = []
  private readonly counts = new Map<string, number>()

  async consume(input: RateLimitInput): Promise<RateLimitDecision> {
    this.calls.push(input)
    const count = (this.counts.get(input.key) ?? 0) + 1
    this.counts.set(input.key, count)
    return {
      isAllowed: count <= input.limit,
      retryAfterInSeconds: 7,
    }
  }
}

class FailingRateLimiter implements RateLimiterProvider {
  calls = 0

  async consume(_input: RateLimitInput): Promise<RateLimitDecision> {
    this.calls += 1
    throw new Error('redis unavailable')
  }
}

const createTelemetry = (): TelemetryProvider => ({ trackError: jest.fn() })

describe('global rate limiter HTTP contract', () => {
  it('enforces the general 100-request window through HonoApp', async () => {
    const provider = new CountingRateLimiter()
    const fixture = new HonoFixture(provider, createTelemetry())
    await fixture.setup()
    fixture.hono.get('/rate-limit-general', (context) => context.text('handler'))

    const responses = []
    for (let index = 0; index < 101; index += 1) {
      responses.push(
        await request(fixture.server)
          .get('/rate-limit-general')
          .set('X-Forwarded-For', '198.51.100.10'),
      )
    }

    expect(responses.slice(0, 100).every(({ status }) => status === 200)).toBe(true)
    expect(responses[100]?.status).toBe(HTTP_STATUS_CODE.tooManyRequests)
    expect(responses[100]?.headers[HTTP_HEADERS.retryAfter.toLowerCase()]).toBe('7')
    expect(responses[100]?.body).toEqual({
      title: 'Limite de requisições excedido',
      message: 'Muitas requisições. Tente novamente mais tarde.',
    })
    expect(provider.calls).toHaveLength(101)
  })

  it('applies the sensitive policy independently from the general policy', async () => {
    const provider = new CountingRateLimiter()
    const fixture = new HonoFixture(provider, createTelemetry())
    await fixture.setup()
    fixture.hono.post('/auth/rate-limit-test', (context) => context.text('handler'))

    const responses = []
    for (let index = 0; index < 61; index += 1) {
      responses.push(
        await request(fixture.server)
          .post('/auth/rate-limit-test')
          .set('X-Forwarded-For', '203.0.113.10'),
      )
    }

    expect(responses.slice(0, 60).every(({ status }) => status === 200)).toBe(true)
    expect(responses[60]?.status).toBe(HTTP_STATUS_CODE.tooManyRequests)
    expect(provider.calls.every(({ limit }) => limit === 60)).toBe(true)
  })

  it('keeps operational paths, supported Inngest methods and CORS preflight excluded', async () => {
    const provider = new CountingRateLimiter()
    const fixture = new HonoFixture(provider, createTelemetry())
    await fixture.setup()

    await request(fixture.server).get('/live')
    await request(fixture.server).get('/health')
    await request(fixture.server).get('/inngest')
    await request(fixture.server).put('/inngest').send({})
    await request(fixture.server).post('/inngest').send({})
    await request(fixture.server)
      .options('/auth/sign-in')
      .set('Origin', 'https://example.test')
      .set('Access-Control-Request-Method', 'POST')

    expect(provider.calls).toHaveLength(0)
  })

  it('uses the general policy for unsupported Inngest methods and normalizes proxy identity', async () => {
    const provider = new CountingRateLimiter()
    const fixture = new HonoFixture(provider, createTelemetry())
    await fixture.setup()

    await request(fixture.server)
      .patch('/inngest')
      .set('X-Forwarded-For', '198.51.100.10, 203.0.113.20')

    expect(provider.calls[0]).toEqual(
      expect.objectContaining({
        limit: 100,
        key: `rate-limit:general:ip:${createHash('sha256').update('203.0.113.20').digest('hex')}`,
      }),
    )
  })

  it('uses the same identity for IPv4 and IPv4-mapped IPv6 spellings', async () => {
    const provider = new CountingRateLimiter()
    const fixture = new HonoFixture(provider, createTelemetry())
    await fixture.setup()
    fixture.hono.get('/rate-limit-ipv4-mapped', (context) => context.text('handler'))

    for (const address of [
      '192.0.2.1',
      '::ffff:192.0.2.1',
      '::ffff:c000:201',
      '0:0:0:0:0:ffff:c000:0201',
    ]) {
      await request(fixture.server)
        .get('/rate-limit-ipv4-mapped')
        .set('X-Forwarded-For', address)
    }

    const keys = provider.calls.map(({ key }) => key)
    expect(new Set(keys).size).toBe(1)
    expect(keys[0]).toBe(
      `rate-limit:general:ip:${createHash('sha256').update('192.0.2.1').digest('hex')}`,
    )
  })

  it('ignores a forwarded address received from an untrusted connection', async () => {
    const provider = new CountingRateLimiter()
    const fixture = new HonoFixture(provider, createTelemetry(), undefined, [
      '192.0.2.0/24',
    ])
    await fixture.setup()
    fixture.hono.get('/rate-limit-untrusted-forwarded-for', (context) =>
      context.text('handler'),
    )

    await request(fixture.server)
      .get('/rate-limit-untrusted-forwarded-for')
      .set('X-Forwarded-For', '198.51.100.10')
    await request(fixture.server)
      .get('/rate-limit-untrusted-forwarded-for')
      .set('X-Forwarded-For', '198.51.100.11')

    expect(provider.calls[0]?.key).toBe(provider.calls[1]?.key)
  })

  it('fails open, reports one telemetry event per outage and probes recovery', async () => {
    const provider = new FailingRateLimiter()
    const telemetry = createTelemetry()
    let now = 0
    const fixture = new HonoFixture(provider, telemetry, () => now)
    await fixture.setup()
    fixture.hono.get('/rate-limit-breaker', (context) => context.text('handler'))

    expect((await request(fixture.server).get('/rate-limit-breaker')).status).toBe(200)
    expect((await request(fixture.server).get('/rate-limit-breaker')).status).toBe(200)
    expect(provider.calls).toBe(1)
    expect(telemetry.trackError).toHaveBeenCalledTimes(1)

    now = 30_000
    expect((await request(fixture.server).get('/rate-limit-breaker')).status).toBe(200)
    expect(provider.calls).toBe(2)
    expect(telemetry.trackError).toHaveBeenCalledTimes(1)
  })

  it('uses the real Redis adapter atomically with an isolated key', async () => {
    const key = `rate-limit:test:provider:${Date.now()}`
    const provider = new IORedisRateLimiterProvider('redis://127.0.0.1:6379')
    const cleanup = new IORedis('redis://127.0.0.1:6379')

    try {
      const decisions = await Promise.all(
        Array.from({ length: 4 }, () =>
          provider.consume({ key, limit: 3, windowInSeconds: 60 }),
        ),
      )

      expect(decisions.filter(({ isAllowed }) => isAllowed)).toHaveLength(3)
      expect(decisions.filter(({ isAllowed }) => !isAllowed)).toHaveLength(1)
      expect(decisions.every(({ retryAfterInSeconds }) => retryAfterInSeconds > 0)).toBe(
        true,
      )
      expect(await cleanup.ttl(key)).toBeGreaterThan(0)
    } finally {
      await cleanup.del(key)
      await cleanup.quit()
      await provider.shutdown()
    }
  })
})
