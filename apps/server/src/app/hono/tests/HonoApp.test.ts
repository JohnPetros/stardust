import { EventEmitter } from 'node:events'
import type { ServerType } from '@hono/node-server'
import { serve as serveInngest } from 'inngest/hono'
import { mock } from 'ts-jest-mocker'
import { DrizzleClient, type DrizzleDatabase } from '@/database/drizzle/DrizzleClient'

import { HonoApp } from '../HonoApp'

jest.mock('inngest/hono', () => ({
  serve: jest.fn((options: { client?: unknown }) => {
    return (context: { json: (body: unknown) => Response }) =>
      context.json({
        has_client: Boolean(options.client),
      })
  }),
}))

describe('Hono App', () => {
  beforeEach(() => {
    jest.spyOn(DrizzleClient, 'getInstance').mockReturnValue(mock<DrizzleDatabase>())
  })
  afterEach(() => {
    jest.restoreAllMocks()
  })
  it('should pass the Inngest client to the serve handler', async () => {
    const app = new HonoApp()

    app.registerMiddlewares()
    app.registerInngestRoute()

    const response = await app.hono.request('/inngest', {
      method: 'GET',
    })

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({
      has_client: true,
    })
    expect(serveInngest).toHaveBeenCalledWith(
      expect.objectContaining({
        client: expect.anything(),
      }),
    )
  })
})

describe('Hono server startup failures', () => {
  const options = {
    fetch: jest.fn(),
    port: 3390,
    mode: 'development' as const,
    baseUrl: 'http://localhost',
  }
  const createServer = () =>
    Object.assign(new EventEmitter(), { close: jest.fn() }) as unknown as ServerType &
      EventEmitter

  it('stops after ten occupied ports and closes each failed server', async () => {
    const servers: ReturnType<typeof createServer>[] = []
    const serve = jest.fn(() => {
      const server = createServer()
      servers.push(server)
      process.nextTick(() =>
        server.emit(
          'error',
          Object.assign(new Error('Port busy'), { code: 'EADDRINUSE' }),
        ),
      )
      return server
    })
    const warning = jest.spyOn(console, 'warn').mockImplementation(() => undefined)
    try {
      await expect(new HonoApp().startNodeServer({ ...options, serve })).rejects.toThrow(
        '10 tentativas',
      )
      expect(serve).toHaveBeenCalledTimes(10)
      for (const server of servers) expect(server.close).toHaveBeenCalledTimes(1)
    } finally {
      warning.mockRestore()
    }
  })

  it('preserves a non-address startup error without trying another port', async () => {
    const failure = Object.assign(new Error('Access denied'), { code: 'EACCES' })
    const server = createServer()
    const serve = jest.fn(() => {
      process.nextTick(() => server.emit('error', failure))
      return server
    })
    await expect(new HonoApp().startNodeServer({ ...options, serve })).rejects.toBe(
      failure,
    )
    expect(serve).toHaveBeenCalledTimes(1)
    expect(server.close).toHaveBeenCalledTimes(1)
  })

  it('preserves a synchronous listener failure', async () => {
    const failure = new Error('Invalid listener')
    const serve = jest.fn(() => {
      throw failure
    })
    await expect(new HonoApp().startNodeServer({ ...options, serve })).rejects.toBe(
      failure,
    )
    expect(serve).toHaveBeenCalledTimes(1)
  })
})
