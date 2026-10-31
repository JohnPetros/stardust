import { Hono } from 'hono'
import { describe, expect, it } from 'vitest'

import { DenyBuiltInRoutesMiddleware } from '@/middlewares/deny-built-in-routes-middleware'

function createApp(enabled: boolean) {
  const app = new Hono()

  app.use('*', new DenyBuiltInRoutesMiddleware({ enabled }).handle)
  app.all('*', (c) => c.text('reached'))

  return app
}

async function getStatuses(app: Hono, paths: string[]) {
  return Promise.all(paths.map(async (path) => (await app.request(path)).status))
}

const PATHS = ['/api', '/api/agents', '/apiary', '/health']
const ENCODED_PATHS = [
  '/%61pi/agents',
  '/%2e/api',
  '//api/agents',
  '/API/agents',
  '/%2Fapi/agents',
  '/%41pi',
  '/api/%2e%2e/api/agents',
]
const OTHER_PATHS = ['/pr-reviewer/v1/runs', '/%61piary', '/%E0%A4%A']

describe('DenyBuiltInRoutesMiddleware', () => {
  it('blocks /api routes only when enabled', async () => {
    const enabled = createApp(true)

    expect(await getStatuses(enabled, PATHS)).toEqual([404, 404, 200, 200])

    const blocked = await enabled.request('/api/agents')
    expect(await blocked.json()).toEqual({ error: { code: 'not_found' } })

    const disabled = createApp(false)

    expect(await getStatuses(disabled, PATHS)).toEqual([200, 200, 200, 200])
  })

  it('blocks encoded, repeated-slash and upper-case spellings of /api', async () => {
    const enabled = createApp(true)
    const disabled = createApp(false)

    expect(await getStatuses(enabled, ENCODED_PATHS)).toEqual(
      ENCODED_PATHS.map(() => 404),
    )
    expect(await getStatuses(enabled, OTHER_PATHS)).toEqual(OTHER_PATHS.map(() => 200))
    expect(await getStatuses(disabled, ENCODED_PATHS)).toEqual(
      ENCODED_PATHS.map(() => 200),
    )
  })
})
