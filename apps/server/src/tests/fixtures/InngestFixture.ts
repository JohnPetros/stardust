import type { AddressInfo } from 'node:net'

import { inngest } from '@/queue/inngest/inngest'
import { HonoFixture } from './HonoFixture'

type RunStatus = 'Running' | 'Completed' | 'Failed' | 'Cancelled'

type Run = {
  status: RunStatus
  output?: unknown
}

type WaitOptions = {
  timeoutInMilliseconds?: number
  intervalInMilliseconds?: number
}

const DEFAULT_TIMEOUT_IN_MILLISECONDS = 60_000
const DEFAULT_INTERVAL_IN_MILLISECONDS = 500
const FINISHED_STATUSES: RunStatus[] = ['Completed', 'Failed', 'Cancelled']

export class InngestFixture {
  // The Inngest Dev Server of docker-compose.yml calls the app back on this port.
  static readonly APP_PORT = 3334

  private readonly hono = new HonoFixture()

  private get baseUrl() {
    return process.env.INNGEST_BASE_URL ?? 'http://127.0.0.1:8288'
  }

  async setup(functionIds: string[]) {
    await this.hono.setup()
    await this.listen()
    await Promise.all(functionIds.map((functionId) => this.waitForFunction(functionId)))
  }

  async teardown() {
    const server = this.hono.server
    if (!server.listening) return
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()))
    })
  }

  async send(name: string, data: Record<string, unknown>) {
    const { ids } = await inngest.send({ name, data })
    const eventId = ids[0]
    if (!eventId) throw new Error(`Inngest did not accept the event ${name}`)
    return eventId
  }

  async waitForRun(eventId: string, options: WaitOptions = {}): Promise<Run> {
    const timeout = options.timeoutInMilliseconds ?? DEFAULT_TIMEOUT_IN_MILLISECONDS
    const interval = options.intervalInMilliseconds ?? DEFAULT_INTERVAL_IN_MILLISECONDS
    const deadline = Date.now() + timeout
    let lastRun: Run | undefined

    while (Date.now() < deadline) {
      lastRun = await this.fetchFirstRun(eventId)
      if (lastRun && FINISHED_STATUSES.includes(lastRun.status)) return lastRun
      await this.sleep(interval)
    }

    throw new Error(
      `Inngest run for event ${eventId} did not finish within ${timeout}ms (last status: ${
        lastRun?.status ?? 'no run found'
      })`,
    )
  }

  private async listen() {
    const server = this.hono.server
    await new Promise<void>((resolve, reject) => {
      server.once('error', (error: NodeJS.ErrnoException) => {
        reject(
          error.code === 'EADDRINUSE'
            ? new Error(
                `Port ${InngestFixture.APP_PORT} is in use. Stop the local Server before running the Inngest tests.`,
              )
            : error,
        )
      })
      server.listen(InngestFixture.APP_PORT, '0.0.0.0', () => resolve())
    })
    const address = server.address() as AddressInfo
    if (address.port !== InngestFixture.APP_PORT) {
      throw new Error(`Unexpected Inngest fixture port ${address.port}`)
    }
  }

  private async waitForFunction(functionId: string) {
    const deadline = Date.now() + DEFAULT_TIMEOUT_IN_MILLISECONDS
    while (Date.now() < deadline) {
      if (await this.isFunctionRegistered(functionId)) return
      await this.sleep(DEFAULT_INTERVAL_IN_MILLISECONDS)
    }
    throw new Error(
      `Inngest Dev Server did not register the function ${functionId}. Check that it is running at ${this.baseUrl}.`,
    )
  }

  private async isFunctionRegistered(functionId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/dev`)
      if (!response.ok) return false
      const info = (await response.json()) as { functions?: { slug?: string }[] }
      return (info.functions ?? []).some(({ slug }) => slug?.endsWith(`-${functionId}`))
    } catch {
      return false
    }
  }

  private async fetchFirstRun(eventId: string): Promise<Run | undefined> {
    const response = await fetch(`${this.baseUrl}/v1/events/${eventId}/runs`)
    if (!response.ok) return undefined
    const body = (await response.json()) as { data?: Run[] }
    return body.data?.[0]
  }

  private sleep(milliseconds: number) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds))
  }
}
