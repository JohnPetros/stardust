import type { PlanetDTO, UserDTO } from '@/@core/dtos'
import { Planet, User } from '@/@core/domain/entities'
import type { IUseCase } from '@/@core/interfaces/handlers'

type Request = {
  planetsDTO: PlanetDTO[]
  userDTO: UserDTO
}

export class GetLastUnlockedStarIdUseCase implements IUseCase<Request, string> {
  do({ planetsDTO, userDTO }: Request): string {
    const planets = planetsDTO.map(Planet.create)
    const user = User.create(userDTO)

    const reversedPlants = [...planets]
    reversedPlants.reverse()

    for (const planet of reversedPlants) {
      const stars = planet.stars

      for (const star of stars) {
        const isUnlocked = user.hasUnlockedStar(star.id)

        if (isUnlocked) {
          return star.id
        }
      }
    }

    return planets[0].stars[0].id
  }
}
