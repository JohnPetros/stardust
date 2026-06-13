import type { AnalyticsEvent } from '../domain/structures'

export interface ServerAnalyticsProvider {
  trackEvent(event: AnalyticsEvent): Promise<void>
}
