import type { RestResponse } from '#global/responses/RestResponse'

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
}
