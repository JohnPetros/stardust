import type { ISpaceService, IUseCase } from '#interfaces'
import { Planet } from '#space/entities'

type Response = Promise<{
  firstUnlockedStarId: string
}>

export class GetFirstStarIdUseCase implements IUseCase<void, Response> {
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
