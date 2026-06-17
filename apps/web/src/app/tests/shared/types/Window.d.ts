type UserCreatedPayload = {
  userId: string
  userName: string
  userEmail: string
  userSlug: string
}

declare global {
  interface Window {
    __STARDUST_PROFILE_CHANNEL_MOCK__?: {
      emitUserCreated: (payload: UserCreatedPayload) => void
      getListenersCount: () => number
      getSubscriptionsCount: () => number
      reset: () => void
    }
  }
}

export {}
