export type RateLimitInput = {
  key: string
  limit: number
  windowInSeconds: number
}

export type RateLimitDecision = {
  isAllowed: boolean
  retryAfterInSeconds: number
}

export interface RateLimiterProvider {
  consume(input: RateLimitInput): Promise<RateLimitDecision>
}
