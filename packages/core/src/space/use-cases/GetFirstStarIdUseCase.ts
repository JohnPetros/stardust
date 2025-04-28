import type { UseCase } from '@/global/interfaces'
import type { SpaceService } from '../interfaces'
import { Planet } from '../domain/entities'

type Response = Promise<{
  firstUnlockedStarId: string
}>

export class GetFirstStarIdUseCase implements UseCase<void, Response> {
  constructor(private readonly spaceService: SpaceService) {}

  async do() {
    const planet = await this.fetchFirstPlanet()
    return { firstUnlockedStarId: planet.firstStar.id.value }
  }

  private async fetchFirstPlanet() {
    const response = await this.spaceService.fetchFirstPlanet()
    if (response.isFailure) response.throwError()
    return Planet.create(response.body)
  }
}
