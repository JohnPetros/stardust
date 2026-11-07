import { PostHog } from 'posthog-node'

import type { ServerAnalyticsProvider } from '@stardust/core/analytics/interfaces'
import type { AnalyticsEvent } from '@stardust/core/analytics/structures'
import { AppError } from '@stardust/core/global/errors'

import { ENV } from '@/constants'

export class PostHogAnalyticsProvider implements ServerAnalyticsProvider {
  async trackEvent(event: AnalyticsEvent): Promise<void> {
    const { posthogProjectToken, posthogHost } = ENV
    if (ENV.mode === 'development' || !posthogProjectToken || !posthogHost) return

    const client = this.createClient(posthogProjectToken, posthogHost)

    try {
      client.capture({
        distinctId: event.distinctId.value,
        event: event.name.value,
        properties: {
          environment: ENV.mode,
          ...event.properties,
          $insert_id: event.insertId.value,
        },
      })

      await client.shutdown()
    } catch (error) {
      throw new AppError(
        error instanceof Error ? error.message : 'Failed to send analytics event',
        'PostHog Analytics Provider Error',
      )
    }
  }

  private createClient(token: string, host: string): PostHog {
    return new PostHog(token, { host, flushAt: 1, flushInterval: 0 })
  }
}
