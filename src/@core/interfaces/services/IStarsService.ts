import type { Star } from '@/@core/domain/entities/Star'
import type { ServiceResponse } from '@/@core/responses'

export interface IStarsService {
  fetchStarBySlug(starSlug: string): Promise<ServiceResponse<Star>>
  fetchStarById(starId: string): Promise<ServiceResponse<Star>>
  fetchNextStar(currentStar: Star, userId: string): Promise<ServiceResponse<Star>>
  fetchNextStarFromNextPlanet(
    currentPlanetId: string,
    userId: string
  ): Promise<ServiceResponse<Star>>
  addUnlockedStar(starId: string, userId: string): Promise<ServiceResponse<void>>
  checkStarUnlocking(starId: string, userId: string): Promise<ServiceResponse<boolean>>
}
