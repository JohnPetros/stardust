import { createServer, type Server } from 'node:http'

type InngestDevConfig = {
  startOpts?: {
    urls?: string[]
  }
  functions?: Array<{
    name?: string
  }>
}

type InngestEvent = {
  name: string
  data: Record<string, unknown>
  id?: string
}

type InngestEventResponse = {
  ids: string[]
}

type HonoApp = {
  fetch: (request: Request) => Response | Promise<Response>
}

export class InngestFixture {
  private readonly configuredBaseUrl = process.env.INNGEST_TEST_URL
  private baseUrl = ''
  private callbackServer?: Server
  private callbackUrl?: URL
  private lastCallbackResult = 'no callback request'

  async setup(app: HonoApp, functionNames: string[] = []) {
    this.baseUrl = await this.findBaseUrl()
    this.callbackUrl = await this.getCallbackUrl()
    await this.startCallbackServer(app)
    await this.waitForCallbackRegistration(functionNames)
    return this
  }

  async send(event: InngestEvent): Promise<InngestEventResponse> {
    const response = await fetch(`${this.baseUrl}/e/${this.eventKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    })

    if (!response.ok) {
      throw new Error(`Inngest rejected event with status ${response.status}`)
    }

    return (await response.json()) as InngestEventResponse
  }

  async waitFor(condition: () => boolean, timeoutMs = 15000) {
    const deadline = Date.now() + timeoutMs

    while (Date.now() < deadline) {
      if (condition()) return
      await new Promise((resolve) => setTimeout(resolve, 250))
    }

    throw new Error(
      `Timed out waiting for Inngest function execution (${this.lastCallbackResult})`,
    )
  }

  async teardown() {
    if (!this.callbackServer) return

    await new Promise<void>((resolve, reject) => {
      this.callbackServer?.close((error) => (error ? reject(error) : resolve()))
    })
    this.callbackServer = undefined
  }

  private get eventKey() {
    return process.env.INNGEST_EVENT_KEY ?? 'test-event-key'
  }

  private async findBaseUrl() {
    const candidates = [
      this.configuredBaseUrl,
      'http://127.0.0.1:8288',
      'http://127.0.0.1:8388',
    ].filter((url): url is string => Boolean(url))

    for (const candidate of candidates) {
      try {
        const response = await fetch(`${candidate}/health`)
        if (response.ok) return candidate
      } catch {}
    }

    throw new Error(`Inngest Dev Server is unavailable. Tried: ${candidates.join(', ')}`)
  }

  private async getCallbackUrl() {
    const response = await fetch(`${this.baseUrl}/dev`)
    const config = (await response.json()) as InngestDevConfig
    const callbackUrl = config.startOpts?.urls?.[0]

    if (!callbackUrl) throw new Error('Inngest Dev Server has no configured callback URL')

    return new URL(callbackUrl)
  }

  private async startCallbackServer(app: HonoApp) {
    this.callbackServer = createServer(async (request, response) => {
      try {
        const body = await this.readBody(request)
        const headers = new Headers()

        for (const [name, value] of Object.entries(request.headers)) {
          if (typeof value === 'string') headers.set(name, value)
        }

        const host = this.callbackUrl?.host ?? request.headers.host ?? '127.0.0.1'
        const incomingRequest = new Request(`http://${host}${request.url ?? '/'}`, {
          method: request.method,
          headers,
          body: body.length > 0 ? body : undefined,
        })
        const url = new URL(incomingRequest.url)
        url.pathname = '/inngest'
        const result = await app.fetch(new Request(url, incomingRequest))
        response.statusCode = result.status

        result.headers.forEach((value, name) => response.setHeader(name, value))
        const resultBody = Buffer.from(await result.arrayBuffer())
        this.lastCallbackResult = `${request.method} ${request.url} -> ${result.status} (${resultBody.length} bytes): ${resultBody.toString('utf8').slice(0, 160)}`
        response.end(resultBody)
      } catch (error) {
        this.lastCallbackResult = `${request.method} ${request.url} -> 500: ${
          error instanceof Error ? error.message : String(error)
        }`
        response.statusCode = 500
        response.end(error instanceof Error ? error.message : String(error))
      }
    })

    await new Promise<void>((resolve, reject) => {
      this.callbackServer?.once('error', reject)
      this.callbackServer?.listen(Number(this.callbackUrl?.port), '0.0.0.0', resolve)
    })
  }

  private async waitForCallbackRegistration(functionNames: string[]) {
    const callbackUrl = this.callbackUrl as URL
    const localCallbackUrl = new URL(callbackUrl)
    localCallbackUrl.hostname = '127.0.0.1'
    const deadline = Date.now() + 15000
    let lastResponse = 'no response'

    while (Date.now() < deadline) {
      try {
        const response = await fetch(localCallbackUrl)
        const responseText = await response.text()
        lastResponse = `${response.status}: ${responseText.slice(0, 200)}`
        const body = JSON.parse(responseText) as {
          function_count?: number
          functionsFound?: number
        }

        if (response.ok && (body.functionsFound ?? body.function_count ?? 0) > 0) {
          const devResponse = await fetch(`${this.baseUrl}/dev`)
          const devConfig = (await devResponse.json()) as InngestDevConfig
          const registeredFunctionNames = new Set(
            devConfig.functions?.flatMap((fn) => (fn.name ? [fn.name] : [])) ?? [],
          )

          if (
            functionNames.every((functionName) =>
              registeredFunctionNames.has(functionName),
            )
          ) {
            return
          }
        }
      } catch {
        // The callback may not be reachable until the server is ready.
      }

      await new Promise((resolve) => setTimeout(resolve, 250))
    }

    throw new Error(
      `Inngest did not register the callback at ${callbackUrl}. Last response: ${lastResponse}`,
    )
  }

  private readBody(request: import('node:http').IncomingMessage) {
    return new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = []
      request.on('data', (chunk: Buffer) => chunks.push(chunk))
      request.on('end', () => resolve(Buffer.concat(chunks)))
      request.on('error', reject)
    })
  }
}
