import { execFileSync } from 'node:child_process'
import { mkdirSync, rmSync } from 'node:fs'

declare global {
  var __stardustSupabaseProxyPromise__: Promise<void> | undefined
}

const PROXY_CONTAINER_NAME = 'stardust_supabase_test_proxy'
const SUPABASE_NETWORK_NAME = 'supabase_network_server'
const START_LOCK_DIRECTORY = '/tmp/stardust-supabase-test-proxy.lock'

export class LocalSupabaseProxy {
  static async ensureRunning() {
    if (process.env.MODE !== 'test') return

    if (!globalThis.__stardustSupabaseProxyPromise__) {
      globalThis.__stardustSupabaseProxyPromise__ = this.start()
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

      const existingContainerId = this.runDockerCommand([
        'ps',
        '-aq',
        '--filter',
        `name=^${PROXY_CONTAINER_NAME}$`,
      ]).trim()

      if (existingContainerId) {
        this.runDockerCommand(['rm', '-f', PROXY_CONTAINER_NAME], true)
      }

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

    const startedAt = Date.now()

    while (Date.now() - startedAt < 10000) {
      const isHealthy = await this.isHealthy(supabaseUrl)
      if (isHealthy) return

      await new Promise((resolve) => setTimeout(resolve, 250))
    }

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

        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    }

    throw new Error('Timed out waiting to acquire local Supabase proxy start lock')
  }

  private static isLockAlreadyHeldError(error: unknown) {
    return error instanceof Error && 'code' in error && error.code === 'EEXIST'
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
