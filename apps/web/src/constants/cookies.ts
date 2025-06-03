import { APP_PREFIX } from './app-prefix'

export const COOKIES = {
  keys: {
    shouldResetPassword: `${APP_PREFIX}:should-reset-password`,
    rewardingPayload: `${APP_PREFIX}:rewarding-payload`,
    challengePanelsOffset: `${APP_PREFIX}:challenge-panels-offset`,
    accessToken: `${APP_PREFIX}:accessToken`,
    refreshToken: `${APP_PREFIX}:refreshToken`,
  },
}
