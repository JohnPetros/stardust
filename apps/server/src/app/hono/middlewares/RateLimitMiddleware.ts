import { createHash } from 'node:crypto'
import net from 'node:net'

import type { Context, Next } from 'hono'
import { getConnInfo } from '@hono/node-server/conninfo'

import type {
  RateLimitDecision,
  RateLimiterProvider,
  TelemetryProvider,
} from '@stardust/core/global/interfaces'
import { AppError } from '@stardust/core/global/errors'
import { HTTP_HEADERS, HTTP_STATUS_CODE } from '@stardust/core/global/constants'

const GENERAL_POLICY = {
  name: 'general',
  limit: 100,
  windowInSeconds: 60,
} as const

const SENSITIVE_POLICY = {
  name: 'sensitive',
  limit: 60,
  windowInSeconds: 60,
} as const

const BREAKER_DURATION_IN_MILLISECONDS = 30_000
const RATE_LIMIT_ERROR_TITLE = 'Limite de requisições excedido'
const RATE_LIMIT_ERROR_MESSAGE = 'Muitas requisições. Tente novamente mais tarde.'

type RateLimitPolicy = typeof GENERAL_POLICY | typeof SENSITIVE_POLICY
export type RateLimitClock = () => number
type ConnectionResolver = (context: Context) => string | null | undefined

const DEFAULT_TRUSTED_PROXY_CIDRS = [
  '127.0.0.1/32',
  '::1/128',
  '::ffff:127.0.0.1/128',
] as const

export type RateLimitMiddlewareOptions = {
  rateLimiterProvider: RateLimiterProvider
  telemetryProvider: TelemetryProvider
  clock?: RateLimitClock
  connectionResolver?: ConnectionResolver
  trustedProxyCidrs?: readonly string[]
}

type BreakerState = 'closed' | 'open' | 'half-open'

const createConnectionResolver = (
  trustedProxyCidrs: readonly string[],
): ConnectionResolver => {
  const trustedProxyBlockList = createTrustedProxyBlockList(trustedProxyCidrs)

  return (context) => {
    let remoteAddress: string | undefined
    try {
      remoteAddress = getConnInfo(context).remote.address
    } catch {
      return undefined
    }

    if (!remoteAddress || !isTrustedProxy(remoteAddress, trustedProxyBlockList))
      return remoteAddress

    const forwardedFor = context.req.header('X-Forwarded-For')
    const forwardedIps = forwardedFor
      ?.split(',')
      .map((value) => value.trim())
      .filter((value) => net.isIP(value) !== 0)
    if (forwardedIps?.length) return forwardedIps.at(-1)

    return remoteAddress
  }
}

const createTrustedProxyBlockList = (trustedProxyCidrs: readonly string[]) => {
  const blockList = new net.BlockList()
  const cidrs = trustedProxyCidrs.length ? trustedProxyCidrs : DEFAULT_TRUSTED_PROXY_CIDRS

  for (const cidr of cidrs) {
    const [address, prefix = ''] = cidr.split('/')
    const family = net.isIP(address)
    const prefixLength = prefix ? Number(prefix) : family === 4 ? 32 : 128
    const maxPrefixLength = family === 4 ? 32 : 128

    if (
      family === 0 ||
      !Number.isInteger(prefixLength) ||
      prefixLength < 0 ||
      prefixLength > maxPrefixLength
    )
      continue

    if (family === 4) {
      blockList.addSubnet(address, prefixLength, 'ipv4')
      blockList.addSubnet(`::ffff:${address}`, prefixLength + 96, 'ipv6')
    } else {
      blockList.addSubnet(address, prefixLength, 'ipv6')
    }
  }

  return blockList
}

const isTrustedProxy = (remoteAddress: string, blockList: net.BlockList): boolean => {
  const address = remoteAddress.replace(/^\[|\]$/g, '').split('%')[0]
  const family = net.isIP(address)
  if (family === 0) return false

  return blockList.check(address, family === 4 ? 'ipv4' : 'ipv6')
}

export class RateLimitMiddleware {
  private breakerState: BreakerState = 'closed'
  private breakerOpenedAt = 0
  private halfOpenProbe: Promise<RateLimitDecision | null> | null = null
  private telemetryReported = false

  private readonly clock: RateLimitClock
  private readonly connectionResolver: ConnectionResolver
  private readonly options: RateLimitMiddlewareOptions

  constructor(options: RateLimitMiddlewareOptions)
  constructor(
    provider: RateLimiterProvider,
    telemetry: TelemetryProvider,
    clock?: RateLimitClock,
    connectionResolver?: ConnectionResolver,
  )
  constructor(
    optionsOrProvider: RateLimitMiddlewareOptions | RateLimiterProvider,
    telemetry?: TelemetryProvider,
    clock?: RateLimitClock,
    connectionResolver?: ConnectionResolver,
  ) {
    if ('consume' in optionsOrProvider) {
      if (!telemetry) throw new AppError('TelemetryProvider é obrigatório')
      this.options = {
        rateLimiterProvider: optionsOrProvider,
        telemetryProvider: telemetry,
        clock,
        connectionResolver,
      }
    } else {
      this.options = optionsOrProvider
    }

    this.clock = this.options.clock ?? (() => Date.now())
    this.connectionResolver =
      this.options.connectionResolver ??
      createConnectionResolver(this.options.trustedProxyCidrs ?? [])
  }

  readonly limitByIp = async (
    context: Context,
    next: Next,
  ): Promise<Response | undefined> => {
    const policy = this.getPolicy(context)
    if (!policy) {
      await next()
      return undefined
    }

    const decision = await this.consume(
      this.createKey(policy, 'ip', this.resolveIp(context)),
      policy,
      'ip',
    )
    if (decision && !decision.isAllowed) return this.toTooManyRequests(context, decision)

    context.set('rateLimiter', this)
    await next()
    return undefined
  }

  readonly limitByAccount = async (
    context: Context,
    next: Next,
  ): Promise<Response | undefined> => {
    const policy = this.getPolicy(context)
    if (!policy) {
      await next()
      return undefined
    }

    const account = context.get('account')
    if (!account?.isAuthenticated || !account.id) {
      await next()
      return undefined
    }

    const decision = await this.consume(
      this.createKey(policy, 'account', String(account.id)),
      policy,
      'account',
    )
    if (decision && !decision.isAllowed) return this.toTooManyRequests(context, decision)

    await next()
    return undefined
  }

  private async consume(
    key: string,
    policy: RateLimitPolicy,
    dimension: 'ip' | 'account',
  ): Promise<RateLimitDecision | null> {
    if (this.breakerState === 'open') {
      if (this.clock() - this.breakerOpenedAt < BREAKER_DURATION_IN_MILLISECONDS)
        return null

      this.breakerState = 'half-open'
    }

    if (this.breakerState === 'half-open') {
      if (this.halfOpenProbe) return null

      this.halfOpenProbe = this.consumeFromProvider(key, policy, dimension).finally(
        () => {
          this.halfOpenProbe = null
        },
      )
      return this.halfOpenProbe
    }

    return this.consumeFromProvider(key, policy, dimension)
  }

  private async consumeFromProvider(
    key: string,
    policy: RateLimitPolicy,
    dimension: 'ip' | 'account',
  ): Promise<RateLimitDecision | null> {
    try {
      const decision = await this.options.rateLimiterProvider.consume({
        key,
        limit: policy.limit,
        windowInSeconds: policy.windowInSeconds,
      })

      if (!this.isValidDecision(decision))
        throw new AppError('Resposta inválida do rate limiter')

      this.closeCircuit()
      return decision
    } catch (error) {
      this.openCircuit(error, dimension)
      return null
    }
  }

  private openCircuit(error: unknown, operation: string): void {
    const wasClosed = this.breakerState === 'closed'
    this.breakerState = 'open'
    this.breakerOpenedAt = this.clock()

    if (!wasClosed || this.telemetryReported) return

    this.telemetryReported = true
    const normalizedClass =
      error instanceof Error ? error.constructor.name : 'UnknownError'
    this.options.telemetryProvider.trackError(
      new AppError(
        `Rate limiter failure: operation=${operation}; state=open; error=${normalizedClass}`,
      ),
    )
  }

  private closeCircuit(): void {
    this.breakerState = 'closed'
    this.breakerOpenedAt = 0
    this.telemetryReported = false
  }

  private getPolicy(context: Context): RateLimitPolicy | null {
    const method = context.req.method.toUpperCase()
    const pathname = this.normalizePathname(context.req.url)

    if (method === 'OPTIONS' || pathname === '/health' || pathname === '/live')
      return null

    if (pathname === '/inngest' && ['GET', 'PUT', 'POST'].includes(method)) return null

    if (
      pathname === '/auth' ||
      pathname.startsWith('/auth/') ||
      (method === 'POST' &&
        /^\/challenging\/challenges\/[^/]+\/code-executions$/.test(pathname))
    )
      return SENSITIVE_POLICY

    return GENERAL_POLICY
  }

  private normalizePathname(url: string): string {
    const pathname = new URL(url).pathname.replace(/\/+/g, '/')
    if (pathname === '/') return pathname
    return pathname.replace(/\/$/, '')
  }

  private resolveIp(context: Context): string {
    const value = this.connectionResolver(context)?.trim() || 'unknown'
    const normalizedValue = value.replace(/^\[|\]$/g, '').toLowerCase()

    const [address] = normalizedValue.split('%')
    if (net.isIP(address) === 4) return address
    if (net.isIP(address) === 6) {
      const expanded = this.expandIpv6Groups(address)
      const mappedIpv4 = this.extractMappedIpv4(expanded)
      if (mappedIpv4) return mappedIpv4
      return this.normalizeIpv6(normalizedValue)
    }

    return normalizedValue
  }

  private extractMappedIpv4(groups: string[]): string | null {
    if (
      groups.length !== 8 ||
      groups.slice(0, 5).some((group) => group !== '0000') ||
      groups[5] !== 'ffff'
    )
      return null

    const high = Number.parseInt(groups[6] ?? '', 16)
    const low = Number.parseInt(groups[7] ?? '', 16)
    return [high >> 8, high & 0xff, low >> 8, low & 0xff].join('.')
  }

  private normalizeIpv6(value: string): string {
    const [address, zone] = value.split('%')
    const expanded = this.expandIpv6Groups(address)
    const { start, length } = this.findLongestZeroRun(expanded)
    const canonical = expanded.map((group) => group.replace(/^0+/, '') || '0')

    if (length < 2) return `${canonical.join(':')}${zone ? `%${zone}` : ''}`

    const prefix = canonical.slice(0, start).join(':')
    const suffix = canonical.slice(start + length).join(':')
    const compressed = `${prefix}::${suffix}`
      .replace(/^:([^:])/, ':$1')
      .replace(/([^:]):$/, '$1:')
    return `${compressed}${zone ? `%${zone}` : ''}`
  }

  private expandIpv6Groups(address: string): string[] {
    const groups = address.includes('::') ? address.split('::') : [address]
    const left = this.expandIpv6Part(groups[0])
    const right = this.expandIpv6Part(groups[1])
    return [
      ...left,
      ...Array.from({ length: 8 - left.length - right.length }, () => '0'),
      ...right,
    ].map((group) => group.padStart(4, '0'))
  }

  private expandIpv6Part(part: string | undefined): string[] {
    if (!part) return []

    const groups = part.split(':')
    const lastGroup = groups.at(-1)
    if (!lastGroup?.includes('.')) return groups

    const octets = lastGroup.split('.').map(Number)
    groups.splice(-1, 1, ((octets[0] << 8) | octets[1]).toString(16))
    groups.push(((octets[2] << 8) | octets[3]).toString(16))
    return groups
  }

  private findLongestZeroRun(groups: string[]): { start: number; length: number } {
    let bestStart = -1
    let bestLength = 0
    for (let index = 0; index < groups.length; index += 1) {
      if (groups[index] !== '0000') continue
      let end = index
      while (end < groups.length && groups[end] === '0000') end += 1
      if (end - index > bestLength) {
        bestStart = index
        bestLength = end - index
      }
      index = end - 1
    }
    return { start: bestStart, length: bestLength }
  }

  private createKey(
    policy: RateLimitPolicy,
    dimension: 'ip' | 'account',
    identity: string,
  ): string {
    const digest = createHash('sha256').update(identity).digest('hex')
    return `rate-limit:${policy.name}:${dimension}:${digest}`
  }

  private isValidDecision(decision: RateLimitDecision): boolean {
    return (
      typeof decision.isAllowed === 'boolean' &&
      Number.isFinite(decision.retryAfterInSeconds) &&
      decision.retryAfterInSeconds >= 0
    )
  }

  private toTooManyRequests(context: Context, decision: RateLimitDecision): Response {
    const retryAfterInSeconds = Math.max(1, Math.ceil(decision.retryAfterInSeconds))
    return context.json(
      {
        title: RATE_LIMIT_ERROR_TITLE,
        message: RATE_LIMIT_ERROR_MESSAGE,
      },
      HTTP_STATUS_CODE.tooManyRequests,
      { [HTTP_HEADERS.retryAfter]: String(retryAfterInSeconds) },
    )
  }
}
