import type { Database } from './Database'
import type { SupabaseStar } from './SupabaseStar'

export type SupabasePlanet = Database['public']['Views']['planets_view']['Row'] & {
  stars: SupabaseStar[]
}
