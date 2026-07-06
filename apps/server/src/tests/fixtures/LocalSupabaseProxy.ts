import { execFileSync } from 'node:child_process'
import { mkdirSync, rmSync, statSync } from 'node:fs'

declare global {
  var __stardustSupabaseProxyPromise__: Promise<void> | undefined
}

const PROXY_CONTAINER_NAME = 'stardust_supabase_test_proxy'
const SUPABASE_NETWORK_NAME = 'supabase_network_server'
const START_LOCK_DIRECTORY = '/tmp/stardust-supabase-test-proxy.lock'
const START_LOCK_STALE_MS = 15000

export class LocalSupabaseProxy {
  static async ensureRunning() {
    if (process.env.MODE !== 'test') return

    if (!globalThis.__stardustSupabaseProxyPromise__) {
      globalThis.__stardustSupabaseProxyPromise__ = this.start().catch((error) => {
        globalThis.__stardustSupabaseProxyPromise__ = undefined
        throw error
      })
    }

    await globalThis.__stardustSupabaseProxyPromise__
  }

  private static async start() {
    const supabaseUrl = process.env.SUPABASE_URL
    if (!supabaseUrl) return

    const url = new URL(supabaseUrl)
    const listenPort = Number(url.port || 80)

    const alreadyListening = await this.isHealthy(supabaseUrl)
    if (alreadyListening) return

    await this.withStartLock(async () => {
      const becameHealthyWhileWaiting = await this.isHealthy(supabaseUrl)
      if (becameHealthyWhileWaiting) return

      this.removeExistingProxy()
      this.startSupabase()

      const becameHealthyAfterSupabaseStart = await this.waitUntilHealthy(supabaseUrl)
      if (becameHealthyAfterSupabaseStart) return

      this.restartSupabase()

      const becameHealthyAfterSupabaseRestart = await this.waitUntilHealthy(supabaseUrl)
      if (becameHealthyAfterSupabaseRestart) return

      const existingContainerId = this.runDockerCommand([
        'ps',
        '-aq',
        '--filter',
        `name=^${PROXY_CONTAINER_NAME}$`,
      ]).trim()

      if (existingContainerId) this.removeExistingProxy()

      this.runDockerCommand(
        [
          'run',
          '-d',
          '--rm',
          '--name',
          PROXY_CONTAINER_NAME,
          '--network',
          SUPABASE_NETWORK_NAME,
          '-p',
          `0.0.0.0:${listenPort}:8000`,
          'alpine/socat',
          'TCP-LISTEN:8000,fork,reuseaddr',
          'TCP:kong:8000',
        ],
        true,
      )
    })

    const started = await this.waitUntilHealthy(supabaseUrl)
    if (started) return

    throw new Error('Timed out waiting for local Supabase proxy to become healthy')
  }

  private static async isHealthy(supabaseUrl: string) {
    try {
      const response = await fetch(`${supabaseUrl}/auth/v1/health`)
      return response.ok
    } catch {
      return false
    }
  }

  private static async waitUntilHealthy(supabaseUrl: string) {
    const startedAt = Date.now()

    while (Date.now() - startedAt < 10000) {
      const isHealthy = await this.isHealthy(supabaseUrl)
      if (isHealthy) return true

      await new Promise((resolve) => setTimeout(resolve, 250))
    }

    return false
  }

  private static async withStartLock(callback: () => Promise<void>) {
    const timeoutAt = Date.now() + 10000

    while (Date.now() < timeoutAt) {
      try {
        mkdirSync(START_LOCK_DIRECTORY)

        try {
          await callback()
          return
        } finally {
          rmSync(START_LOCK_DIRECTORY, { force: true, recursive: true })
        }
      } catch (error) {
        if (!this.isLockAlreadyHeldError(error)) {
          throw error
        }

        this.releaseStaleStartLockIfNeeded()

        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    }

    throw new Error('Timed out waiting to acquire local Supabase proxy start lock')
  }

  private static isLockAlreadyHeldError(error: unknown) {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'EEXIST'
    )
  }

  private static releaseStaleStartLockIfNeeded() {
    try {
      const stats = statSync(START_LOCK_DIRECTORY)
      const isStale = Date.now() - stats.mtimeMs > START_LOCK_STALE_MS

      if (isStale) {
        rmSync(START_LOCK_DIRECTORY, { force: true, recursive: true })
      }
    } catch {
      return
    }
  }

  private static removeExistingProxy() {
    const existingContainerId = this.runDockerCommand([
      'ps',
      '-aq',
      '--filter',
      `name=^${PROXY_CONTAINER_NAME}$`,
    ]).trim()

    if (existingContainerId) {
      this.runDockerCommand(['rm', '-f', PROXY_CONTAINER_NAME], true)
    }
  }

  private static startSupabase() {
    this.runSupabaseCommand(['start'])
  }

  private static restartSupabase() {
    this.runSupabaseCommand(['stop'])
    this.runSupabaseCommand(['start'])
  }

  private static runSupabaseCommand(command: string[]) {
    execFileSync('npx', ['supabase', ...command], {
      encoding: 'utf8',
      stdio: 'ignore',
    })
  }

  private static runDockerCommand(command: string[], ignoreOutput = false) {
    let lastError: unknown

    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        return execFileSync('docker', command, {
          encoding: 'utf8',
          stdio: ignoreOutput ? 'ignore' : 'pipe',
        })
      } catch (error) {
        lastError = error
      }
    }

    throw lastError
  }
}
