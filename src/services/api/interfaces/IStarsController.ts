import type { Star } from '@/@types/Star'

type NextStar = Pick<Star, 'id' | 'isUnlocked'>

export interface IStarsController {
  getStarBySlug(starSlug: string): Promise<Star>
  getStarById(starId: string): Promise<Star>
  getNextStar(currentStar: Star, userId: string): Promise<NextStar | null>
  getNextStarFromNextPlanet(
    currentPlanetId: string,
    userId: string
  ): Promise<NextStar | null>
  getUserUnlockedStarsIds(userId: string): Promise<string[]>
  addUnlockedStar(starId: string, userId: string): Promise<void>
}
