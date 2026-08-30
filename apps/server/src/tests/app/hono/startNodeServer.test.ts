import { EventEmitter } from 'node:events'
import type { ServerType } from '@hono/node-server'

import { startNodeServer } from '@/app/hono/startNodeServer'

type ServeFn = typeof import('@hono/node-server').serve

describe('startNodeServer', () => {
  it('should retry with the next port in development mode', async () => {
    const listenCallback = jest.fn()
    const busyServer = createServer()
    const availableServer = createServer()
    const serve = jest
      .fn()
      .mockImplementationOnce(() => {
        const error = new Error('Port in use') as NodeJS.ErrnoException
        error.code = 'EADDRINUSE'

        process.nextTick(() => busyServer.emit('error', error))

        return busyServer
      })
      .mockImplementationOnce((options, callback) => {
        process.nextTick(() =>
          callback?.({ port: Number(options.port), family: 'IPv6', address: '::' }),
        )

        return availableServer
      })

    const server = await startNodeServer({
      serve: serve as unknown as ServeFn,
      fetch: listenCallback,
      port: 3333,
      mode: 'development',
      baseUrl: 'http://localhost',
    })

    expect(serve).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ fetch: listenCallback, port: 3333 }),
      expect.any(Function),
    )
    expect(serve).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ fetch: listenCallback, port: 3334 }),
      expect.any(Function),
    )
    expect(server).toEqual(expect.objectContaining({ close: expect.any(Function) }))
  })

  it('should rethrow the same error outside development mode', async () => {
    const error = new Error('Port in use') as NodeJS.ErrnoException
    error.code = 'EADDRINUSE'
    const busyServer = createServer()

    const serve = jest.fn(() => {
      process.nextTick(() => busyServer.emit('error', error))

      return busyServer
    })

    await expect(
      startNodeServer({
        serve: serve as unknown as ServeFn,
        fetch: jest.fn(),
        port: 3333,
        mode: 'production',
        baseUrl: 'http://localhost',
      }),
    ).rejects.toThrow(error)
  })
})

function createServer() {
  return Object.assign(new EventEmitter(), {
    close: jest.fn(),
  }) as unknown as ServerType & EventEmitter
}
