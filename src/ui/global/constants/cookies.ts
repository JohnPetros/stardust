import { APP_PREFIX } from './app-prefix'

export const COOKIES = {
  keys: {
    shouldReturnPassword: `${APP_PREFIX}:should-return-password`,
    rewardingPayload: `${APP_PREFIX}:rewarding-payload`,
    challengePanelsOffset: `${APP_PREFIX}:challenge-panels-offset`,
    accessToken: `${APP_PREFIX}:accessToken`,
    refreshToken: `${APP_PREFIX}:refreshToken`,
  },
}