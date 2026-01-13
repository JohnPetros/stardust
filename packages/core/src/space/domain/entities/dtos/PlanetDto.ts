import type { StarDto } from './StarDto'

export type PlanetDto = {
  id?: string
  name: string
  icon: string
  image: string
  position: number
  completionCount: number
  userCount: number
  stars: StarDto[]
  isAvailable: boolean
}
