import type { Database } from './Database'
import type { SupabaseStar } from './SupabaseStar'

export type SupabasePlanet = Database['public']['Tables']['planets']['Row'] & {
  stars: SupabaseStar[]
}
