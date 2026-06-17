import type {} from '../types/Window'

import { ProfileChannelMock } from '../mocks/ProfileChannelMock'

export const profileChannelMock = ProfileChannelMock()

export function exposeProfileChannelMock() {
  if (typeof window === 'undefined') return

  window.__STARDUST_PROFILE_CHANNEL_MOCK__ = {
    emitUserCreated(payload) {
      profileChannelMock.emitUserCreated(payload)
    },
    getListenersCount() {
      return profileChannelMock.getListenersCount()
    },
    getSubscriptionsCount() {
      return profileChannelMock.getSubscriptionsCount()
    },
    reset() {
      profileChannelMock.reset()
    },
  }
}

exposeProfileChannelMock()
