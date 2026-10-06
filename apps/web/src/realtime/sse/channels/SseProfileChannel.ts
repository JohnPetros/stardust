import type { ProfileChannel } from '@stardust/core/profile/interfaces'
import { UserCreatedEvent } from '@stardust/core/profile/events'

type UserCreatedPayload = ConstructorParameters<typeof UserCreatedEvent>[0]

const USER_CREATED_FIELDS = ['userId', 'userName', 'userEmail', 'userSlug'] as const

function isUserCreatedPayload(payload: unknown): payload is UserCreatedPayload {
  if (!payload || typeof payload !== 'object') return false
  const data = payload as Record<string, unknown>
  return USER_CREATED_FIELDS.every((field) => {
    const value = data[field]
    return typeof value === 'string' && value.length > 0
  })
}

function parseUserCreatedPayload(data: string) {
  try {
    const payload: unknown = JSON.parse(data)
    return isUserCreatedPayload(payload) ? payload : null
  } catch {
    return null
  }
}

function createUserCreatedEvent(payload: UserCreatedPayload) {
  const { userId, userName, userEmail, userSlug } = payload
  return new UserCreatedEvent({ userId, userName, userEmail, userSlug })
}

function parseUserCreatedFrame(event: Event) {
  if (!(event instanceof MessageEvent)) return null
  const payload = parseUserCreatedPayload(event.data)
  if (!payload || event.lastEventId !== `profile:${payload.userId}`) return null
  return { id: event.lastEventId, event: createUserCreatedEvent(payload) }
}

class UserCreationSubscription {
  private readonly deliveredIds = new Set<string>()
  private isClosed = false

  private readonly onUserCreated = (event: Event) => {
    const frame = this.isClosed ? null : parseUserCreatedFrame(event)
    if (!frame || this.deliveredIds.has(frame.id)) return
    this.deliveredIds.add(frame.id)
    this.close()
    this.listener(frame.event)
  }

  private readonly onError = () => {
    if (this.source.readyState === 2) this.close()
  }

  readonly close = () => {
    if (this.isClosed) return
    this.isClosed = true
    for (const [name, listener] of Object.entries(this.handlers)) {
      this.source.removeEventListener(name, listener)
    }
    this.source.close()
  }

  private readonly handlers = {
    'user.created': this.onUserCreated,
    'onboarding.expired': this.close,
    error: this.onError,
  }

  constructor(
    private readonly source: EventSource,
    private readonly listener: Parameters<ProfileChannel['onCreateUser']>[0],
  ) {
    for (const [name, handler] of Object.entries(this.handlers)) {
      source.addEventListener(name, handler)
    }
  }
}

export const SseProfileChannel = (
  createEventSource: (url: string) => EventSource,
): ProfileChannel => ({
  onCreateUser(listener) {
    const source = createEventSource('/api/auth/profile-events')
    return new UserCreationSubscription(source, listener).close
  },
})
