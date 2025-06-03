import { APP_PREFIX } from './app-prefix'

export const COOKIES = {
  shouldResetPassword: {
    key: `${APP_PREFIX}:should-reset-password`,
    durationInSeconds: 60 * 15, // 15 minutes
  },
  accessToken: {
    key: `${APP_PREFIX}:access-token`,
  },
  refreshToken: {
    key: `${APP_PREFIX}:refresh-token`,
    durationInSeconds: 60 * 60 * 24, // 1 day
  },
  keys: {
    rewardingPayload: `${APP_PREFIX}:rewarding-payload`,
    challengePanelsOffset: `${APP_PREFIX}:challenge-panels-offset`,
  },
}
