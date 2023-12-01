import { Star } from '@/@types/star'

export interface IStarService {
  getStarBySlug(starSlug: string): Promise<Star>
  getNextStar(currentStar: Star, userId: string): Promise<Star | null>
  getNextStarFromNextPlanet(
    currentPlanetId: string,
    userId: string
  ): Promise<Star | null>
  getUserUnlockedStarsIds(userId: string): Promise<string[]>
  addUnlockedStar(starId: string, userId: string): Promise<void>
}
