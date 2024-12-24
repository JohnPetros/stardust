import type { IUseCase } from "#interfaces"
import { UserDto } from "#global/dtos"
import { User } from "#global/entities"
import { PlanetDto } from "#space/dtos"
import { Planet } from "#space/entities"
import { NotFoundError } from "#global/errors"

type Request = {
  planetsDto: PlanetDto[]
  userDto: UserDto
}

export class GetLastUnlockedStarIdUseCase implements IUseCase<Request, string> {
  async do({ planetsDto, userDto }: Request): Promise<string> {
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

    const lastUnlockedStarId = planets[0]?.stars[0]?.id

    if (!lastUnlockedStarId) throw new NotFoundError('Estrela desbloqueada não encontrada')

    return lastUnlockedStarId
  }
}
