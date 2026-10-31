import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { CrewRestFixture } from '@/controllers/tests/crew-rest-fixture'

describe('HealthMiddleware', () => {
  let fixture: CrewRestFixture

  beforeAll(async () => {
    fixture = await CrewRestFixture.start()
  })

  afterAll(async () => {
    await fixture.close()
  })

  it('answers GET /health from the database before the built-in route', async () => {
    const { status, text } = await fixture.request('/health')

    expect(status).toBe(200)
    expect(JSON.parse(text)).toEqual({ status: 'ok' })
  })

  it('lets other methods on /health reach later handlers', async () => {
    const { text } = await fixture.request('/health', { method: 'POST' })

    expect(text).toBe('built-in health')
  })

  it('answers 503 once the database is unavailable', async () => {
    await fixture.stopDatabase()

    const { status, text } = await fixture.request('/health')

    expect(status).toBe(503)
    expect(JSON.parse(text)).toEqual({ status: 'unavailable' })
  })
})
