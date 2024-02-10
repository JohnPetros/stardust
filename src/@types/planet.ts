import type { Star } from './Star'

export type Planet = {
  id: string
  name: string
  icon: string
  image: string
  position: number
  stars: Pick<
    Star,
    'id' | 'slug' | 'name' | 'number' | 'isChallenge' | 'isUnlocked'
  >[]
}
