import { PostHog } from 'posthog-node'

import type { ServerAnalyticsProvider } from '@stardust/core/analytics/interfaces'
import type { AnalyticsEvent } from '@stardust/core/analytics/structures'
import { AppError } from '@stardust/core/global/errors'

import { ENV } from '@/constants'

export class PostHogAnalyticsProvider implements ServerAnalyticsProvider {
  async trackEvent(event: AnalyticsEvent): Promise<void> {
    const client = new PostHog(ENV.posthogProjectToken, {
      host: ENV.posthogHost,
      flushAt: 1,
      flushInterval: 0,
    })

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
}
