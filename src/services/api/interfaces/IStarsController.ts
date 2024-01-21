import { Star } from '@/@types/star'

export interface IStarsController {
  getStarBySlug(starSlug: string): Promise<Star>
  getStarById(starId: string): Promise<Star>
  getNextStar(currentStar: Star, userId: string): Promise<Star | null>
  getNextStarFromNextPlanet(
    currentPlanetId: string,
    userId: string
  ): Promise<Star | null>
  getUserUnlockedStarsIds(userId: string): Promise<string[]>
  addUnlockedStar(starId: string, userId: string): Promise<void>
}
