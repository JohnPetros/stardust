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
      key: 'auth/user.signed.up',
      eventName: UserSignedUpEvent.NAME,
    },
    updateRanking: {
      key: 'auth/update.ranking',
      eventName: UserSignedUpEvent.NAME,
    },
  },
  shop: {
    handleUserSignedUp: {
      key: 'auth/user.signed.up',
      eventName: UserSignedUpEvent.NAME,
    },
  },
  space: {
    handleUserSignedUp: {
      key: 'auth/user.signed.up',
      eventName: UserSignedUpEvent.NAME,
    },
  },
} as const
