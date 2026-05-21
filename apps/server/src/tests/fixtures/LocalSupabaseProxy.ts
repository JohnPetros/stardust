import { execSync } from 'node:child_process'

declare global {
  var __stardustSupabaseProxyPromise__: Promise<void> | undefined
}

const PROXY_CONTAINER_NAME = 'stardust_supabase_test_proxy'
const SUPABASE_NETWORK_NAME = 'supabase_network_server'

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
    const listenHost = url.hostname
    const listenPort = Number(url.port || 80)

    const alreadyListening = await this.isHealthy(supabaseUrl)
    if (alreadyListening) return

    const existingContainerId = execSync(
      `docker ps -aq --filter "name=^${PROXY_CONTAINER_NAME}$"`,
      { encoding: 'utf8' },
    ).trim()

    if (existingContainerId) {
      execSync(`docker rm -f ${PROXY_CONTAINER_NAME}`, { stdio: 'ignore' })
    }

    execSync(
      [
        'docker run -d --rm',
        `--name ${PROXY_CONTAINER_NAME}`,
        `--network ${SUPABASE_NETWORK_NAME}`,
        `-p ${listenHost}:${listenPort}:8000`,
        'alpine/socat',
        'TCP-LISTEN:8000,fork,reuseaddr',
        'TCP:kong:8000',
      ].join(' '),
      { stdio: 'ignore' },
    )

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
}
