import type { Database } from './Database'

export type SupabaseStar = Pick<
  Database['public']['Tables']['stars']['Row'],
  'id' | 'name' | 'slug' | 'number' | 'is_challenge' | 'planet_id'
>
