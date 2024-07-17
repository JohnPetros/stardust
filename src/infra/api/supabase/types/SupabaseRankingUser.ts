import type { SupabaseUser } from './SupabaseUser'

export type SupabaseRankingUser = Pick<
  SupabaseUser,
  'id' | 'slug' | 'name' | 'weekly_xp'
> & {
  avatars: {
    image: string
  } | null
}
