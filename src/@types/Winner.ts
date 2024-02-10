import type { User } from './User'

export type Winner = {
  id: string
  userId: string
  position: number
} & Pick<User, 'name' | 'xp' | 'avatarId' | 'rankingId'>
