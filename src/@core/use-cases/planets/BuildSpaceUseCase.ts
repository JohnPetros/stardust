import { UnlockableItem } from '@/@core/domain/structs/UnlockableItem'
import { Space } from '@/@core/domain/structs/Space'
import type { Planet } from '@/@core/domain/entities'
import type { IUseCase } from '@/@core/interfaces/handlers'
import type {
  IAuthService,
  IPlanetsService,
  IUsersService,
} from '@/@core/interfaces/services'

export class BuildSpaceUseCase implements IUseCase<void, Space> {
  constructor(
    private authService: IAuthService,
    private usersService: IUsersService,
    private planetsService: IPlanetsService
  ) {}

  async do(): Promise<Space> {
    const userId = await this.getUserId()

    const userUnlockedStarsIds = await this.getUserUnlockedStarsIds(userId)

    const planets = await this.getPlanets()

    const unlockableStars = this.getUnlockableStars(planets, userUnlockedStarsIds)
    const lastUnlockedStarId = this.getLasUnlockedStarId(planets, userUnlockedStarsIds)

    return Space.create({ planets, unlockableStars, lastUnlockedStarId })
  }

  private async getUserId() {
    const userIdresponse = await this.authService.fetchUserId()

    if (userIdresponse.isFailure) userIdresponse.throwError()

    return userIdresponse.data
  }

  private async getUserUnlockedStarsIds(userId: string) {
    const userUnlockedStarsIdsResponse =
      await this.usersService.fetchUserUnlockedStarsIds(userId)

    if (userUnlockedStarsIdsResponse.isFailure) userUnlockedStarsIdsResponse.throwError()

    return userUnlockedStarsIdsResponse.data
  }

  private async getPlanets() {
    const planetsResponse = await this.planetsService.fetchPlanets()

    if (planetsResponse.isFailure) planetsResponse.throwError()

    return planetsResponse.data
  }

  private getUnlockableStars(plants: Planet[], userUnlockedStarsIds: string[]) {
    const unlockableStars = []

    for (const planet of plants) {
      const { stars } = planet

      for (const star of stars) {
        const isUnlocked = userUnlockedStarsIds.some((id) => id === star.id)
        unlockableStars.push(UnlockableItem.create({ item: star, isUnlocked }))
      }
    }

    return unlockableStars
  }

  private getLasUnlockedStarId(plants: Planet[], userUnlockedStarsIds: string[]) {
    const reversedPlants = [...plants]
    reversedPlants.reverse()

    for (const planet of reversedPlants) {
      const stars = planet.stars

      for (const star of stars) {
        const isUnlocked = userUnlockedStarsIds.some((id) => id === star.id)

        if (isUnlocked) {
          return star.id
        }
      }
    }

    return plants[0].stars[0].id
  }
}
