import type { Email, Id } from '#global/domain/structures/index'

export interface ClientAnalyticsProvider {
  trackEvent(eventName: string, properties?: Record<string, unknown>): void
  identifyUser(userId: Id, userEmail: Email): void
  reset(): void
}
