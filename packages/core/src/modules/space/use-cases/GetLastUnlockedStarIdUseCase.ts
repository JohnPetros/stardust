import { Planet, User } from '#domain/entities'
import type { PlanetDto, UserDto } from '#dtos'
import type { IUseCase } from '#interfaces/handlers'

type Request = {
  planetsDto: PlanetDto[]
  userDto: UserDto
}

export class GetLastUnlockedStarIdUseCase implements IUseCase<Request, string> {
  do({ planetsDto, userDto }: Request): string {
    const planets = planetsDto.map(Planet.create)
    const user = User.create(userDto)

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
