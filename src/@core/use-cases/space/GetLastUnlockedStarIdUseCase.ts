import type { PlanetDTO, UserDTO } from '@/@core/dtos'
import type { IUseCase } from '@/@core/interfaces/handlers'
import { Planet, User } from '@/@core/domain/entities'

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
      const reversedStars = [...planet.stars]
      reversedStars.reverse()

      for (const star of reversedStars) {
        const isUnlocked = user.hasUnlockedStar(star.id)

        if (isUnlocked.isTrue) {
          return star.id
        }
      }
    }

    return planets[0].stars[0].id
  }
}
