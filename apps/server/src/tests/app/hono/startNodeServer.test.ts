import { startNodeServer } from '@/app/hono/startNodeServer'

describe('startNodeServer', () => {
  it('should retry with the next port in development mode', () => {
    const listenCallback = jest.fn()
    const serve = jest
      .fn()
      .mockImplementationOnce(() => {
        const error = new Error('Port in use') as NodeJS.ErrnoException
        error.code = 'EADDRINUSE'
        throw error
      })
      .mockImplementationOnce((options, callback) => {
        callback?.({ port: Number(options.port), family: 'IPv6', address: '::' })

        return { close: jest.fn() }
      })

    const server = startNodeServer({
      serve,
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

  it('should rethrow the same error outside development mode', () => {
    const error = new Error('Port in use') as NodeJS.ErrnoException
    error.code = 'EADDRINUSE'

    const serve = jest.fn(() => {
      throw error
    })

    expect(() =>
      startNodeServer({
        serve,
        fetch: jest.fn(),
        port: 3333,
        mode: 'production',
        baseUrl: 'http://localhost',
      }),
    ).toThrow(error)
  })
})
