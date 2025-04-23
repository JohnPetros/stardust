import type { Database } from './Database'

export type SupabaseSolution = Omit<
  Database['public']['Views']['solutions_view']['Row'],
  'challenge_id'
>
