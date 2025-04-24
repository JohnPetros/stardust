import { User } from '../../global/domain/entities'
import type { UserDto } from '../../global/dtos'
import { Planet, Star } from '../domain/entities'
import type { SpaceService, UseCase } from '../../global/interfaces'

type Request = {
  userDto: UserDto
  starId: string
}

export class UnlockNextStarUseCase implements UseCase<Request> {
  constructor(private readonly spaceService: SpaceService) {}

  async do({ userDto, starId }: Request) {
    const user = User.create(userDto)
    const nextStar = await this.fetchNextStar(starId)

    if (nextStar) {
      if (user.hasUnlockedStar(nextStar.id).isFalse) {
        const response = await this.spaceService.saveUnlockedStar(nextStar.id, user.id)
        if (response.isFailure) response.throwError()
      }
    }
  }

  private async fetchNextStar(currentStarId: string) {
    const planet = await this.fetchPlanet(currentStarId)
    let nextStar = planet.getNextStar(currentStarId)

    if (!nextStar) {
      const response = await this.spaceService.fetchNextStarFromNextPlanet(planet)
      if (response.isSuccess) {
        nextStar = Star.create(response.body)
      }
    }

    return nextStar
  }

  private async fetchPlanet(starId: string) {
    const response = await this.spaceService.fetchPlanetByStar(starId)
    if (response.isFailure) response.throwError()

    return Planet.create(response.body)
  }
}
