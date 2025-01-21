import type { ISpaceService, IUseCase } from '#interfaces'
import { Planet } from '#space/entities'

type Request = {
  userId: string
}

type Response = Promise<{
  firstUnlockedStarId: string
}>

export class UnlockFirstUserStarUseCase implements IUseCase<Request, Response> {
  constructor(private readonly spaceService: ISpaceService) {}

  async do({ userId }: Request) {
    const planet = await this.fetchFirstPlanet()

    const response = await this.spaceService.saveUserUnlockedStar(
      planet.firstStar.id,
      userId,
    )

    if (response.isFailure) response.throwError()

    return {
      firstUnlockedStarId: planet.firstStar.id,
    }
  }

  private async fetchFirstPlanet() {
    const response = await this.spaceService.fetchFirstPlanet()
    if (response.isFailure) response.throwError()
    return Planet.create(response.body)
  }
}
