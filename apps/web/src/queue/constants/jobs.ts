import { UserSignedUpEvent } from '@stardust/core/auth/events'
import { FirstTierReachedEvent } from '@stardust/core/ranking/events'
import { ShopItemsAcquiredByDefaultEvent } from '@stardust/core/shop/events'
import { FirstStarUnlockedEvent } from '@stardust/core/space/events'

export const JOBS = {
  profile: {
    handleFirstTierReached: {
      key: 'profile/handle.first.tier.reached',
      eventName: FirstTierReachedEvent._NAME,
    },
    observeStreakBreak: {
      key: 'profile/observe.streak.break',
      cronExpression: '1 0 * * *', // Everyday at 00:01
    },
    resetWeekStatus: {
      key: 'profile/reset.week.status',
      cronExpression: '3 0 * * 0', // Every Sunday at 00:03
    },
  },
  ranking: {
    handleShopItemsAcquiredByDefault: {
      key: 'ranking/handle.shop.items.acquired.by.default',
      eventName: ShopItemsAcquiredByDefaultEvent._NAME,
    },
    updateRankings: {
      key: 'ranking/update.rankings',
      cronExpression: '0 0 * * 0', // Every Sunday at 00:00
    },
  },
  shop: {
    handleFirstStarUnlocked: {
      key: 'shop/handle.first.star.unlocked',
      eventName: FirstStarUnlockedEvent._NAME,
    },
  },
  space: {
    handleUserSignedUp: {
      key: 'space/handle.user.signed.up',
      eventName: UserSignedUpEvent._NAME,
    },
  },
} as const
