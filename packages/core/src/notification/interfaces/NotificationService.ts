import type { EventPayload } from '@stardust/core/global/types'
import type { RestResponse } from '@stardust/core/global/responses'
import type { FeedbackReportSentEvent } from '../../reporting/domain/events/FeedbackReportSentEvent'

export interface NotificationService {
  sendPlanetCompletedNotification(
    userSlug: string,
    userName: string,
    planetName: string,
  ): Promise<RestResponse>
  sendSpaceCompletedNotification(
    userSlug: string,
    userName: string,
  ): Promise<RestResponse>
  sendErrorNotification(
    app: 'server' | 'web',
    errorMessage: string,
  ): Promise<RestResponse>
  sendFeedbackReportNotification(
    payload: EventPayload<typeof FeedbackReportSentEvent>,
  ): Promise<RestResponse>
}
