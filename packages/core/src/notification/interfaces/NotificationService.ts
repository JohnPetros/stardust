import type { EventPayload } from '@stardust/core/global/types'
import type { RestResponse } from '@stardust/core/global/responses'
import type { FeedbackReportSentEvent } from '../../reporting/domain/events/FeedbackReportSentEvent'
import type { ChallengePostedEvent } from '#challenging/domain/events/ChallengePostedEvent'

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
  sendChallengePostedNotification(
    payload: EventPayload<typeof ChallengePostedEvent>,
  ): Promise<RestResponse>
}
