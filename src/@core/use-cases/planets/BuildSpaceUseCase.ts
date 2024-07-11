import { UnlockableItem } from '@/@core/domain/structs/UnlockableItem'
import { Space } from '@/@core/domain/structs/Space'
import { Planet } from '@/@core/domain/entities'
import type { IUseCase } from '@/@core/interfaces/handlers'
import type { PlanetDTO } from '@/@core/dtos'

type Request = {
  planetsDTO: PlanetDTO[]
  userUnlockedStarsIds: string[]
}

export class BuildSpaceUseCase implements IUseCase<Request, Space> {
  do({ planetsDTO, userUnlockedStarsIds }: Request): Space {
    const planets = planetsDTO.map(Planet.create)

    const unlockableStars = this.getUnlockableStars(planets, userUnlockedStarsIds)
    const lastUnlockedStarId = this.getLasUnlockedStarId(planets, userUnlockedStarsIds)

    return Space.create({
      planets,
      unlockableStars,
      lastUnlockedStarId,
    })
  }

  private getUnlockableStars(planets: Planet[], userUnlockedStarsIds: string[]) {
    const unlockableStars = []

    for (const planet of planets) {
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
