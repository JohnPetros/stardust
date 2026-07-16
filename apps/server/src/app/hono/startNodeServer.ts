type ServeFn = typeof import('@hono/node-server').serve
type ServeOptions = Parameters<ServeFn>[0]
type ListeningListener = Parameters<ServeFn>[1]
type ServerType = ReturnType<ServeFn>

type StartNodeServerParams = {
  serve: ServeFn
  fetch: ServeOptions['fetch']
  port: number
  mode: 'development' | 'production' | 'test'
  baseUrl: string
}

const MAX_PORT_ATTEMPTS = 10

export async function startNodeServer({
  serve,
  fetch,
  port,
  mode,
  baseUrl,
}: StartNodeServerParams) {
  for (let portOffset = 0; portOffset < MAX_PORT_ATTEMPTS; portOffset++) {
    const nextPort = port + portOffset

    try {
      return await listenOnPort({ serve, fetch, port: nextPort, baseUrl })
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

function listenOnPort({
  serve,
  fetch,
  port,
  baseUrl,
}: Omit<StartNodeServerParams, 'mode'>): Promise<ServerType> {
  return new Promise((resolve, reject) => {
    let server: ServerType | null = null
    let settled = false

    const stopListeningForStartupError = () => {
      server?.off('error', handleStartupError)
    }

    const settle = (callback: () => void) => {
      if (settled) return

      settled = true
      stopListeningForStartupError()
      callback()
    }

    const handleStartupError = (error: Error) => {
      settle(() => {
        server?.close()
        reject(error)
      })
    }

    const handleListening = ((info) => {
      settle(() => {
        console.log(`🏢 Server is running on ${baseUrl}:${info.port}`)
        resolve(server as ServerType)
      })
    }) satisfies ListeningListener

    try {
      server = serve({ fetch, port }, handleListening)
      server.once('error', handleStartupError)
    } catch (error) {
      reject(error)
    }
  })
}
