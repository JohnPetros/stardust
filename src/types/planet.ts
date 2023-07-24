import type { Star } from './star'

export type Planet = {
  id: string
  name: string
  icon: string
  image: string
  position: number
  stars: Star[]
}
