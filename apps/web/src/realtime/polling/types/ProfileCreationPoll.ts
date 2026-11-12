import type { UserCreatedEvent } from '@stardust/core/profile/events'

export type ProfileCreationPoll =
  | { status: 'pending' }
  | { status: 'created'; payload: UserCreatedEvent['payload'] }
  | { status: 'stopped' }
  | { status: 'failed' }
