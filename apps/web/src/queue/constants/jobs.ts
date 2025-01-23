import { UserSignedUpEvent } from '@stardust/core/auth/events'

export const JOBS = {
  profile: {
    handleUserSignedUp: {
      key: 'profile/handle.user.signed.up',
      eventName: UserSignedUpEvent.NAME,
    },
    observerStreakBreak: {
      key: 'profile/observe.streak.break',
      cronExpression: '0 0 * * *', // Everyday at 00:00
    },
  },
  ranking: {
    handleUserSignedUp: {
      key: 'ranking/user.signed.up',
      eventName: UserSignedUpEvent.NAME,
    },
    updateRankings: {
      key: 'ranking/update.rankings',
      cronExpression: '0 0 * * 0', // Every sunday at 00:00
    },
  },
  shop: {
    handleUserSignedUp: {
      key: 'shop/user.signed.up',
      eventName: UserSignedUpEvent.NAME,
    },
  },
  space: {
    handleUserSignedUp: {
      key: 'space/user.signed.up',
      eventName: UserSignedUpEvent.NAME,
    },
  },
} as const
