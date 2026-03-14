import type { UserCreatedEvent } from '../domain/events'

type ListenersCleanup = () => void

export interface ProfileChannel {
  onCreateUser: (listener: (event: UserCreatedEvent) => void) => ListenersCleanup
}
