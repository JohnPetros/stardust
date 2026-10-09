declare global {
  var __stardustSupabaseProxyPromise__: Promise<void> | undefined
}

const LOCAL_ENDPOINTS = {
  SUPABASE_URL: { protocols: ['http:'] },
  DATABASE_URL: {
    protocols: ['postgres:', 'postgresql:'],
  },
} as const

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]'])

export class LocalSupabaseProxy {
  static async ensureRunning() {
    if (process.env.MODE !== 'test') return

    if (!globalThis.__stardustSupabaseProxyPromise__) {
      globalThis.__stardustSupabaseProxyPromise__ =
        LocalSupabaseProxy.ensureStackReady().catch((error) => {
          globalThis.__stardustSupabaseProxyPromise__ = undefined
          throw error
        })
    }

    await globalThis.__stardustSupabaseProxyPromise__
  }

  private static async ensureStackReady() {
    const supabaseUrl = process.env.SUPABASE_URL
    const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY
    const databaseUrl = process.env.DATABASE_URL

    LocalSupabaseProxy.assertLocalEndpoint('SUPABASE_URL', supabaseUrl)
    if (!publishableKey) {
      throw new Error('SUPABASE_PUBLISHABLE_KEY is required for local integration tests')
    }
    LocalSupabaseProxy.assertLocalEndpoint('DATABASE_URL', databaseUrl)

    if (await LocalSupabaseProxy.waitUntilHealthy(supabaseUrl, publishableKey)) return

    throw new Error('Timed out waiting for local Supabase Compose stack readiness')
  }

  private static assertLocalEndpoint(
    variableName: keyof typeof LOCAL_ENDPOINTS,
    value: string | undefined,
  ): asserts value is string {
    if (!value) {
      throw new Error(`${variableName} is required for local integration tests`)
    }

    let endpoint: URL

    try {
      endpoint = new URL(value)
    } catch {
      throw new Error(`${variableName} must use a local endpoint`)
    }

    const expected = LOCAL_ENDPOINTS[variableName]
    const port = Number(endpoint.port)
    const hasValidPort = Number.isInteger(port) && port >= 1 && port <= 65535
    const hasExpectedProtocol = expected.protocols.some(
      (protocol) => protocol === endpoint.protocol,
    )

    if (!LOOPBACK_HOSTS.has(endpoint.hostname) || !hasValidPort || !hasExpectedProtocol) {
      throw new Error(`${variableName} must use a local endpoint`)
    }
  }

  private static async waitUntilHealthy(supabaseUrl: string, publishableKey: string) {
    const startedAt = Date.now()

    while (Date.now() - startedAt < 10000) {
      try {
        const response = await fetch(`${supabaseUrl}/auth/v1/health`, {
          headers: { apikey: publishableKey },
        })
        if (response.ok) return true
      } catch {
        // Compose may still be bringing up GoTrue and Kong.
      }

      await new Promise((resolve) => setTimeout(resolve, 250))
    }

    return false
  }
}
