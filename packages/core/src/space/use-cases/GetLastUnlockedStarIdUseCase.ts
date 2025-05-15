import type { UserDto } from '#profile/domain/entities/dtos/UserDto'
import type { UseCase } from '../../global/interfaces'
import type { PlanetDto } from '../domain/entities/dtos'
import { User } from '../../global/domain/entities'
import { Planet } from '../domain/entities'
import { NotFoundError } from '../../global/domain/errors'

type Request = {
  planetsDto: PlanetDto[]
  userDto: UserDto
}

export class GetLastUnlockedStarIdUseCase implements UseCase<Request, string> {
  execute({ planetsDto, userDto }: Request) {
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
          return star.id.value
        }
      }
    }

    const lastUnlockedStarId = planets[0]?.stars[0]?.id

    if (!lastUnlockedStarId)
      throw new NotFoundError('Estrela desbloqueada não encontrada')

    return lastUnlockedStarId.value
  }
}
