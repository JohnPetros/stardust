import type { User } from './User'

export type Playground = {
  id: string
  title: string
  code: string | null
  isPublic: boolean
  user: Pick<User, 'id' | 'slug' | 'avatarId'>
}
