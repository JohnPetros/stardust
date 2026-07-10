type ServeFn = typeof import('@hono/node-server').serve
type ServeOptions = Parameters<ServeFn>[0]
type ListeningListener = Parameters<ServeFn>[1]

type StartNodeServerParams = {
  serve: ServeFn
  fetch: ServeOptions['fetch']
  port: number
  mode: 'development' | 'production' | 'test'
  baseUrl: string
}

const MAX_PORT_ATTEMPTS = 10

export function startNodeServer({
  serve,
  fetch,
  port,
  mode,
  baseUrl,
}: StartNodeServerParams) {
  for (let portOffset = 0; portOffset < MAX_PORT_ATTEMPTS; portOffset++) {
    const nextPort = port + portOffset

    try {
      return serve(
        {
          fetch,
          port: nextPort,
        },
        ((info) => {
          console.log(`🏢 Server is running on ${baseUrl}:${info.port}`)
        }) satisfies ListeningListener,
      )
    } catch (error) {
      if (!isAddressInUseError(error) || mode !== 'development') throw error

      console.warn(`Port ${nextPort} is already in use. Trying ${nextPort + 1}.`)
    }
  }

  throw new Error(`Could not find an available port after ${MAX_PORT_ATTEMPTS} attempts.`)
}

function isAddressInUseError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && 'code' in error && error.code === 'EADDRINUSE'
}
