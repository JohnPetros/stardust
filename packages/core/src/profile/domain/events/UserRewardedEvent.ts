import { Event } from '#global/domain/abstracts/Event'

import type { WeekStatusValue } from '../types'

type Payload = {
  userId: string
  newXp: number
  newCoins: number
  newLevel: number | null
  newStreak: number | null
  newWeekStatus: WeekStatusValue | null
}

export class UserRewardedEvent extends Event<Payload> {
  static readonly _NAME = 'profile/user.rewarded'

  constructor(readonly payload: Payload) {
    super(UserRewardedEvent._NAME, payload)
  }
}
