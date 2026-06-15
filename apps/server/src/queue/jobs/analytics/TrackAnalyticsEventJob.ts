import type { AnalyticsEventDto } from '@stardust/core/analytics/entities/dtos'
import type { ServerAnalyticsProvider } from '@stardust/core/analytics/interfaces'
import { AnalyticsEvent } from '@stardust/core/analytics/structures'
import type { Amqp, Job } from '@stardust/core/global/interfaces'

export class TrackAnalyticsEventJob implements Job {
  static readonly KEY = 'analytics/track.event.job'

  constructor(
    private readonly analyticsProvider: ServerAnalyticsProvider,
    private readonly analyticsEventDto: AnalyticsEventDto,
  ) {}

  async handle(amqp: Amqp): Promise<void> {
    const analyticsEvent = AnalyticsEvent.create(this.analyticsEventDto)

    await amqp.run(
      async () => await this.analyticsProvider.trackEvent(analyticsEvent),
      TrackAnalyticsEventJob.name,
    )
  }
}
