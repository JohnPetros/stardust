import type { IUseCase } from '../../global/interfaces'
import type { UserDto } from '../../global/dtos'
import { User } from '../../global/domain/entities'
import type { PlanetDto } from '../dtos'
import { Planet } from '../domain/entities'
import { NotFoundError } from '../../global/domain/errors'

type Request = {
  planetsDto: PlanetDto[]
  userDto: UserDto
}

export class GetLastUnlockedStarIdUseCase implements IUseCase<Request, string> {
  do({ planetsDto, userDto }: Request) {
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

    if (!lastUnlockedStarId)
      throw new NotFoundError('Estrela desbloqueada não encontrada')

    return lastUnlockedStarId
  }
}
