import type { ISpaceService, UseCase } from '../../global/interfaces'
import { Planet } from '../domain/entities'

type Response = Promise<{
  firstUnlockedStarId: string
}>

export class GetFirstStarIdUseCase implements UseCase<void, Response> {
  constructor(private readonly spaceService: ISpaceService) {}

  async do() {
    const planet = await this.fetchFirstPlanet()
    return { firstUnlockedStarId: planet.firstStar.id }
  }

  private async fetchFirstPlanet() {
    const response = await this.spaceService.fetchFirstPlanet()
    if (response.isFailure) response.throwError()
    return Planet.create(response.body)
  }
}
