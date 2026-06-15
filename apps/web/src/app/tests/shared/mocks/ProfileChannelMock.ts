import { UserCreatedEvent } from '@stardust/core/profile/events'
import type { ProfileChannel as IProfileChannel } from '@stardust/core/profile/interfaces'

type ProfileChannelMock = IProfileChannel & {
  emitUserCreated: (payload: UserCreatedEvent['payload']) => void
  reset: () => void
  getListenersCount: () => number
  getSubscriptionsCount: () => number
}

export const ProfileChannelMock = (): ProfileChannelMock => {
  const listeners = new Set<(event: UserCreatedEvent) => void>()
  let subscriptionsCount = 0

  return {
    onCreateUser(listener) {
      subscriptionsCount += 1
      listeners.add(listener)

      return () => {
        listeners.delete(listener)
      }
    },

    emitUserCreated(payload) {
      const event = new UserCreatedEvent(payload)

      for (const listener of listeners) {
        listener(event)
      }
    },

    reset() {
      listeners.clear()
    },

    getListenersCount() {
      return listeners.size
    },

    getSubscriptionsCount() {
      return subscriptionsCount
    },
  }
}
