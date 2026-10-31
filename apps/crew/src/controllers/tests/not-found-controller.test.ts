import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { CrewRestFixture } from '@/controllers/tests/crew-rest-fixture'

describe('NotFoundController', () => {
  let fixture: CrewRestFixture

  beforeAll(async () => {
    fixture = await CrewRestFixture.start()
  })

  afterAll(async () => {
    await fixture.close()
  })

  it('keeps answering the routes that own a path', async () => {
    const { status, text } = await fixture.request('/api/auth/capabilities')

    expect(status).toBe(200)
    expect(JSON.parse(text)).toEqual({ enabled: false })
  })

  it('answers 404 for every path or method no earlier route owns', async () => {
    const landing = await fixture.request('/')
    const unknown = await fixture.request('/pr-reviewer/v1/unknown')
    const otherMethod = await fixture.request('/api/auth/capabilities', {
      method: 'DELETE',
    })

    for (const { status, text } of [landing, unknown, otherMethod]) {
      expect(status).toBe(404)
      expect(JSON.parse(text)).toEqual({ error: { code: 'not_found' } })
    }
  })
})
