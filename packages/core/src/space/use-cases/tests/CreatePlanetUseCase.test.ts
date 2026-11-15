import { mock } from 'ts-jest-mocker'
import { CreatePlanetUseCase } from '../CreatePlanetUseCase'
import type { GalaxiesRepository, PlanetsRepository } from '../../interfaces'
import { GalaxyNotFoundError } from '../../domain/errors'
import { GalaxiesFaker } from '../../domain/entities/fakers/GalaxiesFaker'
import { PlanetsFaker } from '../../domain/entities/tests/fakers'

describe('Create Planet Use Case', () => {
  let useCase: CreatePlanetUseCase
  let planetsRepository: jest.Mocked<PlanetsRepository>
  let galaxiesRepository: jest.Mocked<GalaxiesRepository>
  const galaxy = GalaxiesFaker.fake({ position: 1 })

  beforeEach(() => {
    planetsRepository = mock<PlanetsRepository>()
    planetsRepository.add.mockImplementation()
    planetsRepository.findLastPlanet.mockImplementation()
    galaxiesRepository = mock<GalaxiesRepository>()
    galaxiesRepository.findFirst.mockResolvedValue(galaxy)
    useCase = new CreatePlanetUseCase(planetsRepository, galaxiesRepository)
  })

  it('should create a new planet using the next position', async () => {
    const lastPlanet = PlanetsFaker.fake({ position: 5 })
    planetsRepository.findLastPlanet.mockResolvedValue(lastPlanet)
    const planetDto = PlanetsFaker.fakeDto()

    const response = await useCase.execute({
      name: planetDto.name,
      icon: planetDto.icon,
      image: planetDto.image,
    })
    expect(planetsRepository.findLastPlanet).toHaveBeenCalledTimes(1)
    expect(planetsRepository.findLastPlanet).toHaveBeenCalledWith(galaxy.id)
    expect(planetsRepository.add).toHaveBeenCalledTimes(1)
    const createdPlanet = planetsRepository.add.mock.calls[0][0]
    expect(createdPlanet.galaxyId.value).toBe(galaxy.id.value)
    expect(createdPlanet.name.value).toBe(planetDto.name)
    expect(createdPlanet.icon.value).toBe(planetDto.icon)
    expect(createdPlanet.image.value).toBe(planetDto.image)
    // Expect increment
    expect(createdPlanet.position.value).toBe(6)
    expect(createdPlanet.isAvailable.isFalse).toBe(true)
    expect(createdPlanet.completionCount.value).toBe(0)
    expect(createdPlanet.stars).toHaveLength(0)
    expect(response).toEqual(createdPlanet.dto)
  })

  it('should create the first planet with position 1 if no previous planet exists', async () => {
    const planetDto = PlanetsFaker.fakeDto()
    planetsRepository.findLastPlanet.mockResolvedValue(null)

    const response = await useCase.execute({
      name: planetDto.name,
      icon: planetDto.icon,
      image: planetDto.image,
    })

    expect(planetsRepository.findLastPlanet).toHaveBeenCalledTimes(1)
    expect(planetsRepository.add).toHaveBeenCalledTimes(1)

    const createdPlanet = planetsRepository.add.mock.calls[0][0]
    expect(createdPlanet.position.value).toBe(1)
    expect(response).toEqual(createdPlanet.dto)
  })

  it('should throw GalaxyNotFoundError when there is no first galaxy', async () => {
    const planetDto = PlanetsFaker.fakeDto()
    galaxiesRepository.findFirst.mockResolvedValue(null)

    await expect(
      useCase.execute({
        name: planetDto.name,
        icon: planetDto.icon,
        image: planetDto.image,
      }),
    ).rejects.toThrow(GalaxyNotFoundError)
    expect(planetsRepository.add).not.toHaveBeenCalled()
  })
})
