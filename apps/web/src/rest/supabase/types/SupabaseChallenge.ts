import type { Database } from './Database'

export type SupabaseChallenge = Required<
  Database['public']['Views']['challenges_view']['Row']
>
