import type { StarDTO } from './StarDTO'

export type PlanetDTO = {
  id: string
  name: string
  icon: string
  image: string
  position: number
  stars: StarDTO[]
}
