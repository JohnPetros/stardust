import { mock, type Mock } from 'ts-jest-mocker'

import type { StarsRepository, PlanetsRepository } from '#space/interfaces/index'
import type { EventBroker } from '#global/interfaces/EventBroker'
import { GetNextStarUseCase } from '../GetNextStarUseCase'
import { StarNotFoundError } from '#space/domain/errors/StarNotFoundError'
import { Id } from '#global/domain/structures/Id'
import { StarsFaker } from '#space/domain/entities/tests/fakers/StarsFaker'
import { PlanetNotFoundError } from '#space/domain/errors/PlanetNotFoundError'
import { PlanetsFaker } from '#space/domain/entities/tests/fakers/PlanetsFaker'
import { PlanetCompletedEvent } from '#space/domain/events/PlanetCompletedEvent'

describe('Get Next Star Use Case', () => {
  let starsRepository: Mock<StarsRepository>
  let planetsRepository: Mock<PlanetsRepository>
  let eventBroker: Mock<EventBroker>
  let useCase: GetNextStarUseCase
  const userName = 'John Doe'
  const userSlug = 'john-doe'

  beforeEach(() => {
    starsRepository = mock<StarsRepository>()
    planetsRepository = mock<PlanetsRepository>()
    eventBroker = mock<EventBroker>()
    eventBroker.publish.mockImplementation()
    starsRepository.findById.mockImplementation()
    planetsRepository.findByStar.mockImplementation()
    planetsRepository.findByPosition.mockImplementation()
    useCase = new GetNextStarUseCase(starsRepository, planetsRepository, eventBroker)
  })

  it('should throw an error if the current star is not found', () => {
    starsRepository.findById.mockResolvedValue(null)

    expect(
      useCase.execute({ currentStarId: Id.create().value, userName, userSlug }),
    ).rejects.toThrow(StarNotFoundError)
  })

  it('should throw an error if the current planet is not found', () => {
    const star = StarsFaker.fake()
    starsRepository.findById.mockResolvedValue(star)
    planetsRepository.findByStar.mockResolvedValue(null)

    expect(
      useCase.execute({ currentStarId: star.id.value, userName, userSlug }),
    ).rejects.toThrow(PlanetNotFoundError)
  })

  it('should try to find the next star in the next planet if the current star is the last one of the current planet', async () => {
    const star = StarsFaker.fake()
    const planet = PlanetsFaker.fake({ stars: [star.dto] })
    starsRepository.findById.mockResolvedValue(star)
    planetsRepository.findByStar.mockResolvedValue(planet)

    await useCase.execute({ currentStarId: star.id.value, userName, userSlug })

    expect(planetsRepository.findByPosition).toHaveBeenCalledWith(
      planet.position.increment(),
    )
  })

  it('should return the next star of the current planet', async () => {
    const currentStar = StarsFaker.fake({ number: 1 })
    const nextStar = StarsFaker.fake({ number: 2 })
    const planet = PlanetsFaker.fake({ stars: [currentStar.dto, nextStar.dto] })
    starsRepository.findById.mockResolvedValue(currentStar)
    planetsRepository.findByStar.mockResolvedValue(planet)

    const response = await useCase.execute({
      currentStarId: currentStar.id.value,
      userName,
      userSlug,
    })

    expect(response).toEqual(nextStar.dto)
  })

  it('should try to find the next star in the next planet if the current star is the last one of the current planet', async () => {
    const currentStar = StarsFaker.fake()
    const nextStar = StarsFaker.fake()
    const planet = PlanetsFaker.fake({ stars: [currentStar.dto] })
    const nextPlanet = PlanetsFaker.fake({ stars: [nextStar.dto] })
    starsRepository.findById.mockResolvedValue(currentStar)
    planetsRepository.findByStar.mockResolvedValue(planet)
    planetsRepository.findByPosition.mockResolvedValue(nextPlanet)

    const response = await useCase.execute({
      currentStarId: currentStar.id.value,
      userName,
      userSlug,
    })

    expect(planetsRepository.findByPosition).toHaveBeenCalledWith(
      planet.position.increment(),
    )
    expect(response).toEqual(nextStar.dto)
  })

  it('should publish an event when the current planet is completed', async () => {
    const currentStar = StarsFaker.fake()
    const nextStar = StarsFaker.fake()
    const planet = PlanetsFaker.fake({ stars: [currentStar.dto] })
    const nextPlanet = PlanetsFaker.fake({ stars: [nextStar.dto] })
    starsRepository.findById.mockResolvedValue(currentStar)
    planetsRepository.findByStar.mockResolvedValue(planet)
    planetsRepository.findByPosition.mockResolvedValue(nextPlanet)

    await useCase.execute({
      currentStarId: currentStar.id.value,
      userName,
      userSlug,
    })

    expect(eventBroker.publish).toHaveBeenCalledWith(
      new PlanetCompletedEvent({
        userSlug,
        userName,
        planetName: planet.name.value,
      }),
    )
  })

  it('should return null if no next star is found', async () => {
    const currentStar = StarsFaker.fake()
    const planet = PlanetsFaker.fake({ stars: [currentStar.dto] })
    starsRepository.findById.mockResolvedValue(currentStar)
    planetsRepository.findByStar.mockResolvedValue(planet)

    const response = await useCase.execute({
      currentStarId: currentStar.id.value,
      userName,
      userSlug,
    })

    expect(response).toBeNull()
  })
})
